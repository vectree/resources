# Используем Redis для хранения
Официальная документация по Redis [советует](http://redis.io/clients) нам обширный список клиентов для Go. На момент написания статьи, рекомендуемыми являются [radix](https://github.com/fzzy/radix) и [redigo](https://github.com/garyburd/redigo). Мы выберем redigo, так как он активно разрабатывается и имеет большее сообщество.

Перейдём к нужному коду:
```bash
git checkout step-8
```
Заглянем в файле redis.go, в нём и будет наша имплементация хранилища Storage для Redis. Базовая структура достаточно проста:
```go
type RedisStorage struct {
	BaseStorage
	pool       *redis.Pool
	prefix     string
	cleanTimer *time.Timer
}
```
В pool будет хранится пул соединений к редису, в prefix — общий префикс для всех ключей. Для создания пула возьмём код из примеров redigo:
```go
func getPool(server string, password string) (pool *redis.Pool) {
	pool = &redis.Pool{
		MaxIdle:     3,
		IdleTimeout: 240 * time.Second,
		Dial: func() (redis.Conn, error) {
			c, err := redis.Dial("tcp", server)
			if err != nil {
				return nil, err
			}
			if password != "" {
				if _, err := c.Do("AUTH", password); err != nil {
					c.Close()
					return nil, err
				}
			}
			return c, err
		},
		TestOnBorrow: func(c redis.Conn, _ time.Time) error {
			_, err := c.Do("PING")
			return err
		},
	}
	return pool
}
```
В Dial мы передаём функцию, которая после соединения с сервером Redis, попытается авторизироваться, если указан пароль. После этого возвращается установленное соединение. Функция TestOnBorrow вызывается, когда соединение запрашивается из пула, в ней можно проверить соединение на жизнеспособность. Второй параметр, это время с момента возврата соединения в пул. Мы просто отправляем пинг каждый раз.

Так же в пакете у нас объявлено несколько констант:
```go
const (
	KEY_SEPARATOR    = "|" // разделитель ключей
	BIN_KEY          = "bins" // ключ для хранения объектов Bin
	REQUESTS_KEY     = "rq"  // ключ для хранения списка запросов
	REQUEST_HASH_KEY = "rhsh" // ключ для хранения запросов в хэш таблице
	CLEANING_SET	 = "cln" // множество, в котором будут хранится объекты Bin для очистки
	CLEANING_FACTOR  = 3 // множитель превышения максимального количества запросов
)
```
Ключи у нас получаются вот по такому шаблону:
```go
func (storage *RedisStorage) getKey(keys ...string) string {
	return fmt.Sprintf("%s%s%s", storage.prefix, KEY_SEPARATOR, strings.Join(keys, KEY_SEPARATOR))
}
```

Чтобы хранить наши данные в редисе, их нужно чем то сериализовать. Мы выберем популярный формат [msgpack](http://msgpack.org/) и воспользуемся популярной библиотекой [codec](https://github.com/ugorji/go). 

Опишем методы, сериализующие всё что можно в бинарные данные и обратно:
```go
func (storage *RedisStorage) Dump(v interface{}) (data []byte, err error) {
	var (
		mh codec.MsgpackHandle
		h  = &mh
	)
	err = codec.NewEncoderBytes(&data, h).Encode(v)
	return
}

func (storage *RedisStorage) Load(data []byte, v interface{}) error {
	var (
		mh codec.MsgpackHandle
		h  = &mh
	)
	return codec.NewDecoderBytes(data, h).Decode(v)
}
```
Опишем теперь другие методы.

### Cоздание объекта Bin
```go
func (storage *RedisStorage) UpdateBin(bin *Bin) (err error) {
	dumpedBin, err := storage.Dump(bin)
	if err != nil {
		return
	}
	conn := storage.pool.Get()
	defer conn.Close()
	key := storage.getKey(BIN_KEY, bin.Name) 
	conn.Send("SET", key, dumpedBin)
	conn.Send("EXPIRE", key, storage.binLifetime)
	conn.Flush()
	return err
}

func (storage *RedisStorage) CreateBin(bin *Bin) error {
	if err := storage.UpdateBin(bin); err != nil {
		return err
	}
	return nil
}
```

Сначала мы сериализуем bin при помощи метода Dump. Потом берём соединение редиса из пула (не забывая его обязательно вернуть при помощи defer).
> Redigo поддерживает режим pipeline, мы можем добавить в буфер команду через метод Send, отправить все данные из буфера методом Flush и получить результат в Receive. Команда Do объединяет все три команды в одну. Так же можно реализовать транзакционность, подробнее в [документации](http://godoc.org/github.com/garyburd/redigo/redis#hdr-Pipelining) redigo.

Мы отправляем две команды, «SET» чтобы сохранить данные Bin по его имени и Expire, чтобы установить время жизни этой записи.

### Получение объекта Bin
```go
func (storage *RedisStorage) LookupBin(name string) (bin *Bin, err error) {
	conn := storage.pool.Get()
	defer conn.Close()
	reply, err := redis.Bytes(conn.Do("GET", storage.getKey(BIN_KEY, name)))
	if err != nil {
		if err == redis.ErrNil {
			err = errors.New("Bin was not found")
		}
		return
	}
	err = storage.Load(reply, &bin)
	return
}
```
Вспомогательный метод redis.Bytes пытается считать пришедший ответ от conn.Do в массив байтов. Если объект был не найден, редис возвратит специальный тип ошибки redis.ErrNil. Если всё прошло успешно, то данные загружаются в объект bin, переданный по ссылке в метод Load.

### Получения списка объектов Bin
```go
func (storage *RedisStorage) LookupBins(names []string) ([]*Bin, error) {
	bins := []*Bin{}
	if len(names) == 0 {
		return bins, nil
	}
	args := redis.Args{}
	for _, name := range names {
		args = args.Add(storage.getKey(BIN_KEY, name))
	}
	conn := storage.pool.Get()
	defer conn.Close()
	if values, err := redis.Values(conn.Do("MGET", args...)); err == nil {
		bytes := [][]byte{}
		if err = redis.ScanSlice(values, &bytes); err != nil {
			return nil, err
		}
		for _, rawbin := range bytes {
			if len(rawbin) > 0 {
				bin := &Bin{}
				if err := storage.Load(rawbin, bin); err == nil {
					bins = append(bins, bin)
				}
			}
		}
		return bins, nil
	} else {
		return nil, err
	}
}
```
Здесь почти всё тоже самое что и в предыдущем методе, за исключением того, что используется команда MGET для получения среза данных и вспомогательный метод redis.ScanSlice для загрузки ответа в слайс нужного типа.

### Создание запроса Request
```go
func (storage *RedisStorage) CreateRequest(bin *Bin, req *Request) (err error) {
	data, err := storage.Dump(req)
	if err != nil {
		return
	}
	conn := storage.pool.Get()
	defer conn.Close()
	key := storage.getKey(REQUESTS_KEY, bin.Name)
	conn.Send("LPUSH", key, req.Id)
	conn.Send("EXPIRE", key, storage.binLifetime)
	key = storage.getKey(REQUEST_HASH_KEY, bin.Name)
	conn.Send("HSET", key, req.Id, data)
	conn.Send("EXPIRE", key, storage.binLifetime)
	conn.Flush()
	requestCount, err := redis.Int(conn.Receive())
	if err != nil {
		return
	}
	if requestCount < storage.maxRequests {
		bin.RequestCount = requestCount
	} else {
		bin.RequestCount = storage.maxRequests
	}
	bin.Updated = time.Now().Unix()
	if requestCount > storage.maxRequests * CLEANING_FACTOR {
		conn.Do("SADD", storage.getKey(CLEANING_SET), bin.Name)
	}
	if err = storage.UpdateBin(bin); err != nil {
		return
	}
	return
}
```
Сначала мы сохраняем идентификатор запроса в список запросов для bin.Name, потом сохраняем сериализованный запрос в хеш таблицу. Не забываем в обоих случаях добавить время жизни. Команда LPUSH возвращает количество записей в списке requestCount, если это количество превысило максимальное, помноженное на фактор, то добавляем этот Bin в кандидаты на следующую очистку.

Получения запроса и списка запросов сделано по аналогии с Bin объектами.

### Очистка
```go
func (storage *RedisStorage) clean() {
	for {
		conn := storage.pool.Get()
		defer conn.Close()
		binName, err := redis.String(conn.Do("SPOP", storage.getKey(CLEANING_SET)))
		if err != nil {
			break
		}
		conn.Send("LRANGE", storage.getKey(REQUESTS_KEY, binName), storage.maxRequests, -1)
		conn.Send("LTRIM", storage.getKey(REQUESTS_KEY, binName), 0, storage.maxRequests-1)
		conn.Flush()
		if values, error := redis.Values(conn.Receive()); error == nil {
			ids := []string{}
			if err := redis.ScanSlice(values, &ids); err != nil {
				continue
			}
			if len(ids) > 0 {
				args := redis.Args{}.Add(storage.getKey(REQUEST_HASH_KEY, binName)).AddFlat(ids)
				conn.Do("HDEL", args...)
			}
		}
	}
}
```
В отличии от MemoryStorage, здесь мы очищаем избыточные запросы, так как время жизни ограничивается командой редиса EXPIRE. Сначала мы берём элемент из списка на очищение, запрашиваем идентификаторы запросов для него, не входящих в лимит, и командой LTRIM сжимаем список до нужного нам размера. Полученные ранее идентификаторы мы удаляем из хэш таблицы при помощи команды HDEL, принимающей сразу несколько ключей.

Мы закончили описывать RedisStorage, рядом с ним, в файле redis_test.go вы найдёте так же и тесты.

Теперь, добавим возможность выбирать хранилище при запуске нашего приложения, в файле api.go:
```go
type RedisConfig struct {
	RedisAddr			string
	RedisPassword		string
	RedisPrefix			string
}

type Config struct {
...
	Storage				string
	RedisConfig
}

func GetApi(config *Config) *martini.ClassicMartini {
	var storage Storage
	switch config.Storage{
	case "redis":
		redisStorage := NewRedisStorage(config.RedisAddr, config.RedisPassword, config.RedisPassword, MAX_REQUEST_COUNT, BIN_LIFETIME)
		redisStorage.StartCleaning(60)
		storage = redisStorage
	default:
		memoryStorage := NewMemoryStorage(MAX_REQUEST_COUNT, BIN_LIFETIME)
		memoryStorage.StartCleaning(60)
		storage = memoryStorage
	}
...
```
Мы добавили новое поле Storage в нашу конфигурационную структуру и в зависимости от неё инициализурем либо RedisStorage либо MemoryStorage. Так же добавили конфигурацию RedisConfig, для специфических опций редиса.

Так же внесём изменения в запускаемом файле main.go:
```go
import (
	"skimmer"
	"flag"
)

var (
	config = skimmer.Config{
		SessionSecret: "secret123",
		RedisConfig: skimmer.RedisConfig{
			RedisAddr: "127.0.0.1:6379",
			RedisPassword: "",
			RedisPrefix: "skimmer",
		},
	}
)

func init() {
	flag.StringVar(&config.Storage, "storage", "memory", "available storages: redis, memory")
	flag.StringVar(&config.SessionSecret, "sessionSecret", config.SessionSecret, "")
	flag.StringVar(&config.RedisAddr, "redisAddr", config.RedisAddr, "redis storage only")
	flag.StringVar(&config.RedisPassword, "redisPassword", config.RedisPassword, "redis storage only")
	flag.StringVar(&config.RedisPrefix, "redisPrefix", config.RedisPrefix, "redis storage only")
}

func main() {
	flag.Parse()
	api := skimmer.GetApi(&config)
	api.Run()
}
```
Мы будем использовать пакет [flag](http://golang.org/pkg/flag/), позволяющий легко и просто добавлять параметры запуска для программ. Добавим в функцию init флаг «storage», который будет сохранять значение прямо в наш config в поле Storage. Так же добавим опции запуска редиса.
> Функция init особенная для Go, она всегда выполняется при загрузке пакета. Подробнее про [выполнение программ](http://golang.org/ref/spec#Program_execution) в Go.

Теперь, запустив нашу программа с параметром --help, мы увидим список доступных параметров:
```bash
> go run ./src/main.go --help
Usage of .../main:
  -redisAddr="127.0.0.1:6379": redis storage only
  -redisPassword="": redis storage only
  -redisPrefix="skimmer": redis storage only
  -sessionSecret="secret123":
  -storage="memory": available storages: redis, memory
```

Теперь у нас есть приложение, пока ещё довольно сырое, и не оптимизированное, но уже готовое к работе и запуску на серверах.

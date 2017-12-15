# Знакомство с Martini
Загрузим код первого шага:
```bash
git checkout step-1
```
Для начала попробуем просто вывести запрос, приходящий к нам. Точка входа в любое приложение на Go, это функция main пакета main. Создадим в директории src файл main.go. В Martini уже есть заготовка приложения, добавляющая логи, обработку ошибок, возможность восстановления и роутер; и дабы не повторяться, мы воспользуемся ей.

Сам по себе Martini достаточно прост:
```go
// Martini represents the top level web application. inject.Injector methods can be invoked to map services on a global level.
type Martini struct {
     inject.Injector
     handlers []Handler
     action   Handler
     logger   *log.Logger
}
```
Он реализует интерфейс [http.Handler](http://golang.org/pkg/net/http/#Handler), имплементируя метод ServeHTTP. Далее все приходящие запросы пропускаются через различные обработчики, хранящиеся в handlers и в конце выполняет Handler action.

Классический Martini:
```go
// Classic creates a classic Martini with some basic default middleware - martini.Logger, martini.Recovery, and martini.Static.
func Classic() *ClassicMartini {
     r := NewRouter()
     m := New()
     m.Use(Logger())
     m.Use(Recovery())
     m.Use(Static("public"))
     m.Action(r.Handle)
     return &ClassicMartini{m, r}
}
```
В этом конструкторе создаётся объект типа Martini и Router, в обработчики handler через метод martini.Use добавляется логирование запросов, перехват panic ([подробнее](http://blog.golang.org/defer-panic-and-recover) об этом механизме), отдача статики, и последним действием устанавливается обработчик роутера.

Мы будем перехватывать любые HTTP запросы к нашему приложению, используя метод Any у роутера, перехватывающий любые урлы и методы. Интерфейс роутера описан в Martini вот так:
```go
type Router interface {
     // Get adds a route for a HTTP GET request to the specified matching pattern.
     Get(string, ...Handler) Route
     // Patch adds a route for a HTTP PATCH request to the specified matching pattern.
     Patch(string, ...Handler) Route
     // Post adds a route for a HTTP POST request to the specified matching pattern.
     Post(string, ...Handler) Route
     // Put adds a route for a HTTP PUT request to the specified matching pattern.
     Put(string, ...Handler) Route
     // Delete adds a route for a HTTP DELETE request to the specified matching pattern.
     Delete(string, ...Handler) Route
     // Options adds a route for a HTTP OPTIONS request to the specified matching pattern.
     Options(string, ...Handler) Route
     // Any adds a route for any HTTP method request to the specified matching pattern.
     Any(string, ...Handler) Route

     // NotFound sets the handlers that are called when a no route matches a request. Throws a basic 404 by default.
     NotFound(...Handler)

     // Handle is the entry point for routing. This is used as a martini.Handler
     Handle(http.ResponseWriter, *http.Request, Context)
}
```
Если очень хочется — можно реализовать свою имплементацию обработчика адресов, но мы воспользуемся той, что идет в Martini по умолчанию.

Первым параметром указывается локейшен. Локейшены в Martini поддерживают параметры через ":param", регулярные выражения, а так же [glob](http://en.wikipedia.org/wiki/Glob_(programming)). Второй параметр и последующие, принимают функцию, которая будет заниматься обработкой запроса. Так как Martini поддерживает цепочку обработчиков, сюда можно добавлять различные вспомогательные хендлеры, например проверку прав доступа. Нам пока это ни к чему, поэтому добавим только один обработчик c интерфейсом, обрабатываемым обычным веб обработчиком Go (пример разработки на нём можно посмотреть [в документации](http://golang.org/doc/articles/wiki/)). Вот код нашего обработчика:
```go
func main() {
     api := martini.Classic()
     api.Any("/", func(res http.ResponseWriter, req *http.Request,) {
          if dumped, err := httputil.DumpRequest(req, true); err == nil {
               res.WriteHeader(200)
               res.Write(dumped)
          } else {
               res.WriteHeader(500)
               fmt.Fprintf(res, "Error: %v", err)
          }
     })
     api.Run()
}
```
Используя готовую функцию [DumpRequest](http://golang.org/pkg/net/http/httputil/#DumpRequest) из пакета [httputil](http://golang.org/pkg/net/http/httputil/) мы сохраняем структуру запроса http.Request, и записываем его в ответ http.ResponseWriter. Так же не забываем обрабатывать возможные ошибки. Функция api.Run просто запускает встроенный сервер go из стандартной библиотеки, указывая порт и хост, которые она берёт из параметров окружения PORT(3000 по умолчанию) и HOST.

Запустим наше первое приложение:
```bash
go run ./src/main.go
```
Попробуем отправить запрос к серверу:
```bash
> curl -X POST -d "fizz=buzz" http://127.0.0.1:3000
POST / HTTP/1.1
Host: 127.0.0.1:3000
Accept: */*
Content-Type: application/x-www-form-urlencoded
User-Agent: curl/7.24.0 (x86_64-apple-darwin12.0) libcurl/7.24.0 OpenSSL/0.9.8y zlib/1.2.5

fizz=buzz
```

Это была всего лишь проба сил, теперь приступим к написанию настоящего приложения.

# Формы HTML

В данном разделе рассмотрим формы.

## Формы

Формы используются для сбора и заполнения информации на сайте.

Например: оставить заявку с номером телефона и email'ом.

Или еще один всем известный пример: каждый раз, когда мы заходим в Google или Yandex, мы видем на странице поисковика форму.

![alt text](https://user-images.githubusercontent.com/4215285/52410916-fe611580-2aea-11e9-89cc-d6af0cd1ef40.jpeg)

При вводе запроса в данную форму и нажатии на кнопку (или Enter), выполняется HTTP-запрос на сторону
сервера Goggle или Yandex. Данный сервер обрабатывает полученные данные и выдает соответствующие
ссылки на странице (см. рисунок выше). 

Каким образом нам создать форму?

Для этого существует тег `form`.

Внутри данного тега, вы можете добавлять различные типы элементов: текстовые поля, кнопки и т.д.

```html
<form action="/example" method="GET">
   <h6>Наша первая форма</h6> 
</form>
```

Результат:

<div class="html">
    <form action="/example" method="GET">
       <h6>Наша первая форма</h6> 
    </form>
</div>

Атрибут `action` указывает `url`, по которому будет выполняться обработка запроса.
`method` указывает способ передачи данных. 

* **GET** - обычно используется для получения данных
и передает параметры с помощью параметров в `uri`. 
* **POST** - используется для отправки данных и сохранения в базу данных (особенно приватной информации). 
Передаваемые параметры не видны в `uri`

Советуем вам больше узнать о методах по данной ссылке: [клик](https://developer.mozilla.org/ru/docs/Web/HTTP/Methods).

### input

Чтобы добавить в форму текстовое поля, мы можем воспользоватсья тегом `input`.

```html
<form action="/example" method="GET">
   <h6>Наша первая форма</h6> 
   <input type="text" name="username" placeholder="Введите свое имя"/>
   <input type="number" name="phone" placeholder="Введите свой номер телефона"/>
   <input type="text" name="race" value="Человек"/>
</form>
```

Результат:

<div class="html">
    <form action="/example" method="GET">
       <h6>Наша первая форма</h6> 
       <input class="form-control" type="text" name="username" placeholder="Введите свое имя"/>
       <input class="form-control" type="number" name="phone" placeholder="Введите свой номер телефона"/>
       <input class="form-control" type="text" name="race" value="Человек"/>
    </form>
</div>

Атрибут `type` используется для указания типа вводимых данных. В нашем примере - это текст (text) и число (number).

> Кроме `text` и `number` существуют следующие типы:
> * password - используется для ввода пароля,
> * url - для ввода url,
> * email - для ввода email,
> * file - для отправки файла,
> * checkbox - для добавления флажка,
> * radio - для добавления переключателя.
>
> Список остальных типов вы можете найти [тут](https://html5book.ru/html5-forms/).

Атрибут `name` указывает имя параметра, который будет передавать обработчику на backend при нажатии на кнопку "Отправить".

`placeholder` - задает текст, отображаемый до заполнения. Обычно оно используется для подсказки.

Ну и `value`, с помощью которого мы можем задать начальное значение введенное в поле. В нашем примере мы предустановили значение **Человек**.

Больше информации о атрибутах вы можете найти [вотут](https://html5book.ru/html5-forms/).

### label

В примере у нас есть текстовое поле **race**. Но нигде не указано подсказки, что это за поле. 
Пользователь просто не поймет, что все это значит.

Для добавления надписи мы можем воспользоваться тегом `label`. 
Дополнительно сгруппируем их спомощью тега `fieldset` и добавим группе название `legend`.

```html
<form action="/example" method="GET">
   <h6>Наша первая форма</h6> 
   <fieldset>
       <legend>Основная информация</legend>
       <input type="text" name="username" placeholder="Введите свое имя"/>
       <hr />
       <input type="number" name="phone" placeholder="Введите свой номер телефона"/>
   </fieldset>
   <fieldset>
      <label for="race">Введите свою расу</label>
      <input type="text" id="race" name="race" value="Человек"/>
   </fieldset>
</form>
```

Результат:

<div class="html">
    <form action="/example" method="GET">
       <h6>Наша первая форма</h6> 
       <fieldset>
           <legend>Основная информация</legend>
           <input class="form-control" type="text" name="username" placeholder="Введите свое имя"/>
           <hr />
           <input class="form-control" type="number" name="phone" placeholder="Введите свой номер телефона"/>
       </fieldset>
       <fieldset>
          <label for="race">Введите свою расу</label>
          <input class="form-control" type="text" id="race" name="race" value="Человек"/>
       </fieldset>
    </form>
</div>

Атрибут `for` указывает к какому `input` привязана данная надпись по `id`.

### select

Если мы хотим добавить раскрывающийся список, то можно воспользоваться тегом `select`.
Внутри данного тега определяются варианты выбора с помощью тега `option`. 

Атрибут `value` в данном случае - это значение, которое будет доставлено на сервер при отправке.
Если `value` не задан, то берется текст внутри `option`.

```html
<form>
  <label for="city">Выберите свой город:</label>
  <select id="city" name="city">
    <option value="Moscow">Москва</option>
    <option value="Saint-Petersburg">Санкт-Петербург</option>
    <option value="Kaliningrad">Калининград</option>
    <option value="Omsk">Омск</option>
    <option value="Kazan">Казань</option>
  </select>
</form>
```

Результат:

<div class="html">
    <form>
      <label for="city">Выберите свой город:</label>
      <select id="city" name="city">
        <option value="Moscow">Москва</option>
        <option value="Saint-Petersburg">Санкт-Петербург</option>
        <option value="Kaliningrad">Калининград</option>
        <option value="Omsk">Омск</option>
        <option value="Kazan">Казань</option>
      </select>
    </form>
</div>


### button

Мы создали свою форму, но как отправить данные к обработчику?

Нам необходима кнопка!

Тег `button` используется для создания кнопки.

```html
<form action="/example" method="GET">
   <h6>Наша первая форма</h6> 
   <input type="text" name="username" placeholder="Введите свое имя"/>
   <input type="number" name="phone" placeholder="Введите свой номер телефона"/>
   <label for="race">Введите свою расу</label>
   <input type="text" id="race" name="race" value="Человек"/>
   <button type="submit">Отправить заявку!</button>
</form>
```

Результат:

<div class="html">
    <form action="/example" method="GET">
       <h6>Наша первая форма</h6> 
       <input class="form-control" type="text" name="username" placeholder="Введите свое имя"/>
       <input class="form-control" type="number" name="phone" placeholder="Введите свой номер телефона"/>
       <label for="race">Введите свою расу</label>
       <input class="form-control" type="text" id="race" name="race" value="Человек"/>
       <button class="btn btn-success" type="submit">Отправить заявку!</button>
    </form>
</div>

Не забудьте указать `type="submit"`. `submit` указывает, что при нажатии на данную кнопку, произойдет отправка к обработчику.

Осатльную часть тегов вы можете найти [тут](https://html5book.ru/html5-forms/).

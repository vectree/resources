## button

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

Остальную часть тегов вы можете найти [тут](https://html5book.ru/html5-forms/).

## Задание

Ну и на последок добавим кнопку, с помощью которой стажер сможет отправить заявку на указанный
обработчик.
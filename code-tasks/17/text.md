## Светофор

К нам пришли из отдела магического транспорта и запросили сделать светофор из трех блоков `div`. Для этого:
- добавим селектор `lights div` в `styles.css`, который говорит нам о том, что будут выбраны элементы `div` внутри `lights` блока (см. `index.html`);
- добавим следующие свойства для `div` блоков внутри `lights`:
  - `width: 50px` - ширину 50 пикселей,
  - `height: 50px` - высоту 50 пикселей,
  - `border: 10px solid #000` - сделаем черную границу,
  - `border-radius: 50%` - сделаем круглыми наши блоки;
- Последовательно для блоков `div` зададим цвета светофора `#eb4e4e`, `#ffa534`, `#85cd00`. Как это сделать? Изучите информацию о псевдоклассах [тут](https://html5book.ru/psevdoklassy/).

<div class="html">
    <div class="lights">
        <div style="height: 50px; border: 10px solid #000; width: 50px; background: #eb4e4e; border-radius: 50%"></div>
        <div style="height: 50px; border: 10px solid #000; width: 50px; background: #ffa534; border-radius: 50%"></div>
        <div style="height: 50px; border: 10px solid #000; width: 50px; background: #85cd00; border-radius: 50%"></div>
    </div>
</div>

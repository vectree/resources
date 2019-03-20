## Визитка

Первое, что вам необходимо сделать, взять ссылку на вашу фотографию и вставить ее в значение атрибута `src`.
Для этого откройте `index.html`.

<div class="html reset">
    <table>
        <tbody>
            <tr>
                <td>
                    <div>
                        <img height="40" src="https://avatars3.githubusercontent.com/u/4215285?v=4">
                        <div>ФИО</div>
                        <div>CSS-разработчик</div>
                    </div>
                </td>
                <td>88005553535</td>
            </tr>
        </tbody>
    </table>
<div>

Теперь, когда мы разобрались с фотографией, добавьте свойство `background: #fff`, которое меняет цвет фона, и свойство `border-radius: 4px`, которое закругляет рамку классу `.card`.

<div class="html reset">
    <table style="background: #fff; border-radius: 4px;">
        <tbody>
            <tr>
                <td>
                    <div>
                        <img height="40" src="https://avatars3.githubusercontent.com/u/4215285?v=4">
                        <div>ФИО</div>
                        <div>Суперразработчик</div>
                    </div>
                </td>
                <td>88005553535</td>
            </tr>
        </tbody>
    </table>
<div>

Хотелось бы, чтобы наша фото было круглым. Каким образом это сделать? Все очень просто. Добавьте свойство  `border-radius: 50%` картинке, для этого воспользуйтесь селектором `img`.

<div class="html reset">
    <table style="background: #fff; border-radius: 4px;">
        <tbody>
            <tr>
                <td>
                    <div>
                        <img style="border-radius: 50%" height="40" src="https://avatars3.githubusercontent.com/u/4215285?v=4">
                        <div>ФИО</div>
                        <div>Суперразработчик</div>
                    </div>
                </td>
                <td>88005553535</td>
            </tr>
        </tbody>
    </table>
<div>

После добавления белого фона, мы не сможем увидеть ФИО и категорию. Давайте исправим это:
- добавим свойство `color: #000` для класса `.username`,
- добавим свойство `color: #333` для класса `.category`.
- немного изменим стилистику блока с классом `.category`: сделаем текст **жирным** `font-weight: bold` и поставим более высокий размер шрифта `font-size: 20px`.

<div class="html reset">
    <table style="border-radius: 4px; background: #fff; padding: 10px;">
        <tbody>
            <tr>
                <td>
                    <div>
                        <img height="40" style="border-radius: 50%;" src="https://avatars3.githubusercontent.com/u/4215285?v=4">
                        <div style="color: #000;">ФИО</div>
                        <div style="color: #555; font-weight: bold; font-size: 12px;">Суперразработчик</div>
                    </div>
                </td>
                <td>88005553535</td>
            </tr>
        </tbody>
    </table>
</div>

Последний штрих: совсем не видно нашего номера телефона. Хм, но какой селекор нам использовать? Давайте добавим класс `.phone` к элементу `td`, в котором хранится телефон. 

После добавьте следующие свойства:
- `color: #000` - темный цвет текста,
- `background: #eee` - серый цвет фона,
- `border-radius: 4px` - сгругленные края (попробуйте изменить данное число, что получится?),
- `font-size: 20px` - новый размер текста.

<div class="html reset">
    <table style="border-radius: 4px; background: #fff; padding: 10px;">
        <tbody>
            <tr>
                <td>
                    <div>
                        <img height="40" style="border-radius: 50%;" src="https://avatars3.githubusercontent.com/u/4215285?v=4">
                        <div style="color: #000;">Влад Скуришин</div>
                        <div style="color: #555; font-weight: bold; font-size: 12px;">CSS-разработчик</div>
                    </div>
                </td>
                <td style="color: #000; background: #eee; border-radius: 4px; font-size: 20px;">88005553535</td>
            </tr>
        </tbody>
    </table>
</div>

Вот и готова наша карточка.
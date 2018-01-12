# [vectree](http://vectree.ru/)

[![license][license-badge]][LICENSE] [![Codacy Badge](https://api.codacy.com/project/badge/Grade/96071bdddd4548eba86b955593671ec4)](https://www.codacy.com/app/vectree/resources?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=vectree/resources&amp;utm_campaign=Badge_Grade)
[![Join the chat at https://gitter.im/vectree-chat/Lobby](https://badges.gitter.im/vectree-chat/Lobby.svg)](https://gitter.im/vectree-chat/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

![alt text](https://sun9-7.userapi.com/c841624/v841624284/28b96/aJT1-hf8yts.jpg)

Vectree — платформа для начинающих разработчиков, помогающая приобрести ключевые навыки для трудоустройства в IT.

Наша задача:
- предоставление образовательных материалов,
- проверка знаний, 
- менторская поддержка,
- консультация в карьерных вопросах,
- формирование команд для работы над реальными задачами,
- трудоустройство.

## Разделы
* [Задания](https://github.com/vectree/resources#%D0%97%D0%B0%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F)
* [Оформление Digest / Timeline](https://github.com/vectree/resources#%D0%9E%D1%84%D0%BE%D1%80%D0%BC%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-digest--timeline)
* [Оформление Quiz](https://github.com/vectree/resources#%D0%9E%D1%84%D0%BE%D1%80%D0%BC%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-quiz)

## Задания
#### Структура заданий
Каждое задание содержит *README.md* файл с введением и общим описанием. В папке *issues* могут содержаться последовательные шаги по решению задания. 
```
|-- 1 # Номер задания
    |-- README.md # Введение
    |-- issues
        |-- 00 Подготовка.md # Шаг 1
        |-- 01 Граббер.md # Шаг 2
        |-- 02 Цикл.md # Шаг 3
```

#### Список доступных заданий
- Java:
  * [Conway's Game of Life](tasks/0)
  * [Арбитражный бот](tasks/5)
- JUnit:
  * [Тестирование алгоритмов сортировки](tasks/6)
  * [Тестируем терминал продуктового магазина](tasks/7)
- Maven:
  * [Youtube Trends](tasks/8)
- Spring:
  * [Курс валют](tasks/9)
- Go:
  * [Go Grabber](tasks/1)
  * [Go Web App](tasks/2)
  * [Go Skimmer](tasks/3)
- Docker:
  * [Кластер на AWS](tasks/4)
## Оформление Digest / Timeline
- Блоки выравнивать
- В title пишем темы, которые рассматриваются в дереве
- В одном блоке стараемся хранить от 2-5 ссылок
- Формат creator для статей: 
  * С большой буквы
  * Не сайт, а название сайта (Например Stepik, а не stepic.com)
  * Статьи на хабру без автора (Habrahabr)
- В темах стараемся обобщать. Используем их в title
- Сокращаем текст => блоки компактнее + стараемся не делать широкие строки в creator
- Основные типы блоков: Видео, Онлайн-курсы, Интерактивные сервисы, Статьи, Задачники, Полезные ссылки, Книги. (Если нужны новые обсуждаем)
- В секциях пишем уроки, лекции, главы в которых встречается материал
- Если все темы присутствуют в материале, пишем: "Все необходимые темы"
- Орфография!!! 
- Сравнивайте свое дерево с другими деревьями

## Оформление Quiz
- Одна тема (topic) - одна квиза
- Каждое направления связанно с одной или несколькими квизами
 
Шаблон файла c квизой

- **quizId** - id теста. Нумерация по порядку от 0 и совпадет с названием файла, в котором лежит квиза
- **minPercent** - процент правильных ответов, для прохождения теста. (значения от 0 до 100)
- **topicName** - тема, к которой относится тест
- **limit** - количесто вопросов, которое будет показано при прохождении теста
- **questions** - массив объектов, каждый из которых содержит вопрос, варианты ответов и номер правильных ответов

[LICENSE]: ./LICENSE.md
[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg



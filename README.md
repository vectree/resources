# [vectree](http://vectree.ru/)

[![license][license-badge]][LICENSE] [![Codacy Badge](https://api.codacy.com/project/badge/Grade/96071bdddd4548eba86b955593671ec4)](https://www.codacy.com/app/vectree/resources?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=vectree/resources&amp;utm_campaign=Badge_Grade)
[![Join the chat at https://gitter.im/vectree-chat/Lobby](https://badges.gitter.im/vectree-chat/Lobby.svg)](https://gitter.im/vectree-chat/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

![alt text](https://sun9-7.userapi.com/c841624/v841624284/28b96/aJT1-hf8yts.jpg)

В данном репозитории представлены дорожные карты (roadmap), тесты, задания на различные темы из мира программирования. Кроме репозитория был создан сайт Vectree, на котором выставлены все материалы в более удобном виде.

Vectree — платформа для начинающих разработчиков, помогающая приобрести ключевые навыки для трудоустройства в IT.

Наша задача:
- предоставление образовательных материалов,
- проверка знаний, 
- менторская поддержка,
- консультация в карьерных вопросах,
- формирование команд для работы над реальными задачами,
- трудоустройство.

## Разделы
* [Задания](https://github.com/vectree/resources#Задания)
* [Тесты](https://github.com/vectree/resources#Тесты)
* [Карты](https://github.com/vectree/resources#Карты)

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
  * [Conway's Game of Life](https://vectree.ru/task/0)
  * [Арбитражный бот](https://vectree.ru/task/5)
- JUnit:
  * [Тестирование алгоритмов сортировки](https://vectree.ru/task/6)
  * [Тестируем терминал продуктового магазина](https://vectree.ru/task/7)
- Maven:
  * [Youtube Trends](https://vectree.ru/task/8)
- Spring:
  * [Курс валют](https://vectree.ru/task/9)
  * [Pomodoro](https://vectree.ru/task/10)
- Go:
  * [Go Grabber](https://vectree.ru/task/1)
  * [Go Web App](https://vectree.ru/task/2)
  * [Go Skimmer](https://vectree.ru/task/3)
- Docker:
  * [Кластер на AWS](https://vectree.ru/task/4)
- STM:
  * [Знакомство](https://vectree.ru/task/11)
  * [Работа с портами ввода / вывода](https://vectree.ru/task/12)
  * [Прерывания](https://vectree.ru/task/13)
  * [Таймеры](https://vectree.ru/task/14)
  * [FreeRTOS на STM32](https://vectree.ru/task/15)
- SSE:
  * [Векторные операции с SSE](https://vectree.ru/task/16)
- CUDA:
  * [Разработка на CUDA](https://vectree.ru/task/17)
  * [Преобразование Фурье](https://vectree.ru/task/18)
- HTML / CSS / Bootstrap:
  * [Резюме](https://vectree.ru/task/19)
- JavaScript:
  * [Создаем несколько игр и не только!](https://vectree.ru/task/19)
  * [Пинг-понг](https://vectree.ru/task/20)
    
#### Список доступных командных заданий
- Java:
  * [Биллинговая система](https://vectree.ru/practice/0)
- Go:
  * [Интерфейс управления Docker-контейнерами](https://vectree.ru/practice/1)

## Тесты
#### Оформление Quiz
- Одна тема (topic) - одна квиза
- Каждое направления связанно с одной или несколькими квизами
 
Шаблон файла c квизой

- **quizId** - id теста. Нумерация по порядку от 0 и совпадет с названием файла, в котором лежит квиза
- **minPercent** - процент правильных ответов, для прохождения теста. (значения от 0 до 100)
- **topicName** - тема, к которой относится тест
- **limit** - количесто вопросов, которое будет показано при прохождении теста
- **questions** - массив объектов, каждый из которых содержит вопрос, варианты ответов и номер правильных ответов

#### Список доступных тестов
- [Java](https://vectree.ru/quiz/1)
- [JUnit](https://vectree.ru/quiz/5)
- [Maven](https://vectree.ru/quiz/3)
- [Spring](https://vectree.ru/quiz/6)
- [J2EE](https://vectree.ru/quiz/7)
- [Go](https://vectree.ru/quiz/8)
- [Docker](https://vectree.ru/quiz/9)
- [PostgresSQL](https://vectree.ru/quiz/2)
- [STM](https://vectree.ru/quiz/11)
- [Git](https://vectree.ru/quiz/4)
- [FreeRTOS](https://vectree.ru/quiz/12)
- [CUDA](https://vectree.ru/quiz/14)
- [SSE](https://vectree.ru/quiz/13)
- [HTML / CSS / Bootstrap](https://vectree.ru/quiz/15)
- [JavaScript](https://vectree.ru/quiz/16)
- [MongoDB](https://vectree.ru/quiz/17)

## Карты

#### Оформление Digest / Timeline
- Блоки выравнивать
- В title пишем темы, которые рассматриваются на карте
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
- Сравнивайте свою картру с другими картами

#### Список доступных карт
- [Java](https://vectree.ru/timeline/1)
- [JUnit](https://vectree.ru/timeline/5)
- [Maven](https://vectree.ru/timeline/4)
- [Spring](https://vectree.ru/timeline/3)
- [J2EE](https://vectree.ru/timeline/2)
- [Go](https://vectree.ru/timeline/10)
- [Docker](https://vectree.ru/timeline/14)
- [PostgresSQL](https://vectree.ru/timeline/6)
- [STM](https://vectree.ru/timeline/13)
- [Git](https://vectree.ru/timeline/7)
- [FreeRTOS](https://vectree.ru/timeline/15)
- [CUDA](https://vectree.ru/timeline/9)
- [Начинающим](https://vectree.ru/timeline/17)
- [HTML / CSS / Bootstrap](https://vectree.ru/timeline/19)
- [JavaScript](https://vectree.ru/timeline/20)
- [MongoDB](https://vectree.ru/timeline/21)

#### Список отдельных дайджестов
- [Java Code Style](https://vectree.ru/digest/18)
- [Инструменты анализа кода Java](https://vectree.ru/digest/22)
- [Инструменты анализа кода Go](https://vectree.ru/digest/27)
- [Bash-терминал](https://vectree.ru/digest/19)
- [Travis CI](https://vectree.ru/digest/21)
- [Циклы разработки](https://vectree.ru/digest/23)
- [Gorilla Web Toolkit](https://vectree.ru/digest/29)
- [Rabbit MQ](https://vectree.ru/digest/34)
- [Микросервисы](https://vectree.ru/digest/35)
- [Английский](https://vectree.ru/digest/41)
- [Введение в программирование](https://vectree.ru/digest/41)

[LICENSE]: ./LICENSE.md
[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg



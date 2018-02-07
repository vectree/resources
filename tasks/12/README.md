# Работа с портами ввода вывода

Как вы уже могли заметить, плата STM32F3Discover имеет большое количество контактов, называемых пинами (рисунок 1).

![Alt text](https://pp.userapi.com/c840221/v840221705/778f4/qcO1pQ8fbeU.jpg)
Рисунок 1. STM32F3Discovery

Пины объедены в группы, называемые портами. Каждый порт в STM32 имеет 16 пинов. Всего STM32F3Discovery имеет 6 портов: A, B, C, D, E, F.
Схематичное устройства одного интерфейса ввода-вывод представлено на
рисунке 2.

![Alt text](https://pp.userapi.com/c840221/v840221705/778fd/Fdl3Kl4j7Ak.jpg)
Рисунок 2. Схема GPIO микроконтроллера STM32

Как следует из схемы, интерфейс ввода-вывода может работать в одном из
следующих режимов:
1. цифровой выход общего назначения. В данном случае на пин программно
можно выставлять логический 0 (0 В) или 1 (+3.3 В)
2. цифровой вход общего назначения. В данном случае мы можем получать
текущее состояния пина: 1 или 0, т.е. подается ли на него напряжения (+3.3 В)
или нет (0 В).
3. альтернативных режим. В этом случае пин подключается к некоторому
периферийному устройству (таймер, шины I2C, SPI и т.д.), и управляется им.
4. аналоговых вход. Пин будет подключен АЦП (аналого-цифровой
преобразователь)
5. аналоговых выход. Пин будет подключен к ЦАП (цифро-аналоговый
преобразователь)

В режимах 3-5 мы не можем управлять пинами, т.к. они будут заняты
соответствующим устройствами.

В данной работе нас будут интересовать только режимы цифрового входа и выхода общего назначения.
Для управления пинами используется одиннадцать 32-х битных регистра. Из них нам будут интересны следующие:
1. **IDR** (input data register) регистр – позволяет считывать состояния пинов в режиме входа;
2. **ODR**(outputdataregister) регистр–позволяетустанавливатьсостоянияпинов в режиме выхода;
3. **BSRR** (bit set/reset register) регистр – так же позволяет устанавливать состояния пинов в режиме выхода, но в отличии от ODR позволяет обращаться к отдельным пинам (используется для оптимизации работы с портом);
4. **BRR** (bit reset register) регистр – аналогично BSRR, но позволяет только сбрасывать пины

Регистры IDR и ODR имеют довольно простую структуру. Старшие 16 бит не
используются, а каждому n-му младшему биту соответствует n-й пин. Так, например, в таблице 1 приведен пример состояния ODR регистра, в котором 13, 12, 9, 8 и 4 пины установлены в логическую 1, а остальные в 0

![Alt text](https://pp.userapi.com/c840221/v840221705/77910/E2Eg2NMBdZc.jpg)
Таблица 1. Пример состояния регистра ODR

Однако несмотря на простоту, ODR регистр не позволяет оперировать отдельными битами, т.к. мы не можем записывать биты в память (с точки зрения программы все регистры устройств представляют из себя переменные в памяти с фиксированными адресами), поэту чтобы изменить состояния одного пина надо сначала считать регистр ODR, изменить нужный бит и обратно записать значения в ODR. Например, следующий код обнуляет 9-й пин и включает 11 не изменяя все остальные:

`GPIOE->ODR = (GPIOE->ODR & 0xFDFF) | 0x0800`

Регистр BSRR работает аналогично функции `HAL_GPIO_WritePin`. Установка в 1 битов старших 2-х байт сбрасывает соответсвующий пин, а младших включает. Приведем в качестве пример код, который делает то, что и предыдущий,
но с использованием BSRR регистра:

`GPIO-> BSRR = 0x02000800`

В случае если нужно только сбрасывать пины, то использовать BSRR не очень удобно, т.к. нужно будет не забывать сделать сдвиг на 16 битов в право. Чтобы этого не делать имеется BRR регистр, у которого младшие 16 бит используется для сброса пинов. Так следующий код сбрасывает 2 и 9-й пины с помощью данных регистров:

```c
GPIOE -> BSRR = 0x02020000
GPIOE -> BRR = 0x0202 // результат такой же, как и предыдущей строчке
```

#### Типы входов / выходов пинов

В зависимости от наличия резисторов между пином и землей или между пином и питанием выделяют 3 режима:
1. **pull-up** – с резистором подтягивающим к питанию;
2. **pull-down** – с резистором подтягивающим к земле;
3. **no-pull** – без подтягивающих резисторов;

![Alt text](https://pp.userapi.com/c840221/v840221705/77935/-bm7vjNcr2g.jpg)
Рисунок 3 Режимы подключения выходов пинов

В случае если пин работает в режиме выхода:
1. **pull-up** характеризуется тем что между пином и питанием стоит резистор
(рисунок 3 a). В случае если нужно получить на входе 1, то ключ между землей и пином размыкается, и резистор «подтягивает» напряжение. Для получения 0, ключ между землей и выходом пина просто замыкается.
2. **pull-down** – аналогично pull-up, но резистор стоит между пином и землей (рисунок 3 b).
3. **no-pull** – резисторов нет (рисунок 3 c). В случае если нужно получить 1, то пин просто подключается к питанию, если 0 – то к земле (соответственно ключи одновременно никогда не замыкаются).
В случае если пин работает в режиме входа:
1. **pull-up** – мы слушаем вход с пином подключенным к питанию (рисунок 3 d).
2. **pull-down** – мы слушаем вход с пином подключенным к земле (рисунок 3 e).
3. **no-pull** – мы слушаем вход соединенный только с пином (рисунок 3 а). 24
   
## Работа с портами ввода-вывода
В общем случае работа с портами ввода вывод сводится к следующим действиям:
1. подключить порт к тактовому генератору с помощью функций `__HAL_RCC_GPIO<x>_CLK_ENABLE`, где <x> - номер порта (A, B, C, D, E или F);
2. настроить нужные пины с помощью с помощью функции `HAL_GPIO_Init`;
3. начать работать с пинами, либо напрямую обращаясь к регистрам порта, либо
с помощью функций `HAL_GPIO_WritePin`, `HAL_GPIO_ReadPin`, `HAL_GPIO_TogglePin` (внутри данные функции так же обращаются к
регистрам);
4. отключить порт от тактового генератора с помощью функции
`__HAL_RCC_GPIO<x>_CLK_DISABLE` (данная возможно имеется, но обычно не требуется).

Рассмотрим далее работу с портами ввода-вывода на примере переключения светодиодов и чтения состояния кнопки.

## Пример использования портов ввода-вывода
Сначала сгенерируйте в CubeMX проект, как было показано в первой работе, но для упрощения кода на вкладке pinout выключите интерфейсы I2C (рисунок 4) и SPI (рисунок 5).

![Alt text](https://pp.userapi.com/c840221/v840221705/77956/BzNuM3RgT-E.jpg)
Рисунок 4. Отключение I2C интерфейса, включенного по умолчанию

![Alt text](https://pp.userapi.com/c840221/v840221705/7795f/UYH9kFR8xsM.jpg)
Рисунок 5. Отключение SPI интерфейса включенного по умолчанию

После чего можно сгенерировать заготовку кода проекта.
Далее достаточно будет изменить только файл main.c следующим образом:

```c
/**
 * File Name          : main.c
 * Description        : Main program body
 */
#include "main.h"
#include "stm32f3xx_hal.h"

/* Function prototypes */
void SystemClock_Config(void);
void Error_Handler(void);
static void MX_GPIO_Init(void);

int main(void)
{
    // Hal initialization
    HAL_Init();
    
    // Configuraton of the system clock
    SystemClock_Config();
    
    /* Initialize all configured peripherals */
    MX_GPIO_Init();
    
    // clear all leds
    GPIOE->ODR = 0;
    
    // simple animation
    uint8_t ledState = 0x03;
    uint16_t buttonState;
    
    while (1) {
        HAL_Delay(100);
        
        // depend on button state, we change moving direction
        buttonState = GPIOA->IDR & 0x0001;

        if (buttonState) {
            // button is pushed
            if (ledState & 0x01) {
                ledState = ledState >> 1;
                ledState = ledState | 0x80;
            } else {
                ledState = ledState >> 1;
            }
        } else {
            // buttion isn't pushed
            if (ledState & 0x80) {
                ledState = ledState << 1;
                ledState = ledState | 0x01;
            } else {
                ledState = ledState << 1;
            }
        }
        
        // switch leds
        // we should read ODR register to prevent modification of the bits 0-7
    } 
}

uint16_t tmp = GPIOE->ODR;
tmp = tmp & 0x00FF;
tmp = tmp | ( (uint16_t)ledState << 8);
GPIOE->ODR = tmp;

/**
 * GPIO configuration
 */
static void MX_GPIO_Init(void)
{
    // This structure stores port configuration for HAL_GPIO_Init function
    GPIO_InitTypeDef GPIO_InitStruct;
    
    // enable port clocks
    __HAL_RCC_GPIOE_CLK_ENABLE();
    __HAL_RCC_GPIOA_CLK_ENABLE();
    
    // configure board leds
    GPIO_InitStruct.Pin = 0xFF00; // board leds use pins PE8-PE15
    GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP; // simple output mode
    GPIO_InitStruct.Pull = GPIO_NOPULL; // no pull resistors
    GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW; // high frequency (it influences only on power consumption)
    HAL_GPIO_Init(GPIOE, &GPIO_InitStruct);
    
    // configure button
    GPIO_InitStruct.Pin = B1_Pin; // 0x0001 predefined constant generated by CubeMX
    GPIO_InitStruct.Mode = GPIO_MODE_INPUT; // simple input mode
    GPIO_InitStruct.Pull = GPIO_NOPULL; // float input
    HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);
}

/**
 * System Clock Configuration
 */
void SystemClock_Config(void)
{
    RCC_OscInitTypeDef RCC_OscInitStruct;
    RCC_ClkInitTypeDef RCC_ClkInitStruct;
    
    // Initializes the CPU, AHB and APB busses clocks
    RCC_OscInitStruct.OscillatorType = RCC_OSCILLATORTYPE_HSE;
    RCC_OscInitStruct.HSEState = RCC_HSE_BYPASS;
    RCC_OscInitStruct.HSEPredivValue = RCC_HSE_PREDIV_DIV1;
    RCC_OscInitStruct.HSIState = RCC_HSI_ON;
    RCC_OscInitStruct.PLL.PLLState = RCC_PLL_ON;
    RCC_OscInitStruct.PLL.PLLSource = RCC_PLLSOURCE_HSE;
    RCC_OscInitStruct.PLL.PLLMUL = RCC_PLL_MUL6;
    
    if (HAL_RCC_OscConfig(&RCC_OscInitStruct) != HAL_OK)
         {
            Error_Handler();
    }
    
    //Initializes the CPU, AHB and APB busses clocks
    RCC_ClkInitStruct.ClockType = RCC_CLOCKTYPE_HCLK|RCC_CLOCKTYPE_SYSCLK | RCC_CLOCKTYPE_PCLK1|RCC_CLOCKTYPE_PCLK2;
    RCC_ClkInitStruct.SYSCLKSource = RCC_SYSCLKSOURCE_PLLCLK;
    RCC_ClkInitStruct.AHBCLKDivider = RCC_SYSCLK_DIV1;
    RCC_ClkInitStruct.APB1CLKDivider = RCC_HCLK_DIV2;
    RCC_ClkInitStruct.APB2CLKDivider = RCC_HCLK_DIV1;
    
    if (HAL_RCC_ClockConfig(&RCC_ClkInitStruct, FLASH_LATENCY_1) != HAL_OK)
    {
        Error_Handler();
    }
    
    //Configure the Systick interrupt time
    HAL_SYSTICK_Config(HAL_RCC_GetHCLKFreq()/1000);
    
    //Configure the Systick
     HAL_SYSTICK_CLKSourceConfig(SYSTICK_CLKSOURCE_HCLK);
     
    /* SysTick_IRQn interrupt configuration */
    HAL_NVIC_SetPriority(SysTick_IRQn, 0, 0);
}

/**
  * This function is executed in case of error occurrence.
  */
void Error_Handler(void)
{
    while (1) {} 
}
```

Данный код заставляют мигать светодиоды по кругу. Нажатие кнопки изменяет направление вращения.

В коде можно выделить две основные функции: MX_GPIO_Init и main. В MX_GPIO_Init происходит инициализация портов ввода-вывода. В main в бесконечном цикле происходит переключение светодиодов и опрос состояния кнопки.

## Взаимодействие с регистрами устройств
С точки зрения программы все регистры периферии (порты ввода-вывода, таймеры и т.д.) представляют из себя обычные переменные с некоторыми фиксированными адресами. Обычно регистры, управляющие одним устройством, имеют соседние адреса. Поэтому для удобства работы с ними, библиотека HAL предоставляет набор и структур, поля которых представляют из себя регистры устройств. Так для работы с портами ввода вывода имеются следующие предопределенные структуры: GPIOA, GPIOB, GPIOC, GPIOD, GPIOE, GPIOF.

## Задание

Задачи:
* Часть 1: Изменяя и читая состояния портов ввода-вывода напрямую из регистров, напишите программу, аналогичную в приведенном примере, которая имеет 4 режима мигания светодиодов, переключаемых кнопкой;
* Часть 2: Добавьте режим с плавным миганием светодиодов (изученного функционала достаточно для реализации этого режима).

## Авторы
Задание взято с лабораторного практикума по изучению ARM микроконтроллеров серии STM32

Бабанов К.В., Ключарев А.А., Кочин К.А.

Спб ГУАП 2017

# LED

Продолжаем серию уроков по программированию микроконтроллеров ARM, сегодня продолжаем говорить про ОСРВ, то есть про FreeRTOS и ChibiOS. Снова для узания у нас STM32F429zi-DISCO. 

Речь сегодня пойдет об динамической изменении приоритетов задачи. Приоритет задачи — это важность задачи для планировщика, чем выше приоритет, тем планировщик быстрее ее начнет выполнять и тем меньше система потратить процессорного времени на выполнении задачи. Минимальный приоритет для задачи — 0, данный приоритет имеет задача бездействия. Дефолтная задача в наше программе будет иметь приоритет равный 1, а задача для обработки реакции от нажатия кнопки будет иметь приоритет равный 2. Соответственно при условии, что у нас вытесняющая многозадачность задачи с приоритетом равным 1 никогда не получат процессорного времени и не начнет своего выполнения. Для того что бы задача не висели в бездействии, мы с вами уровняем силы, и переопределим приоритеты задачи с приоритетами равными 1 на приоритеты равными 2. Что ж, приступим)

#### FreeRTOS + STM32F4

```c
UART_HandleTypeDef huart5;
void SystemClock_Config(void);
static void StartThread(void const * argument);
static void MX_GPIO_Init(void);
static void MX_UART5_Init(void);

xTaskHandle xTask1Handle;
xTaskHandle xTask2Handle;
xTaskHandle xButtonHandle;


volatile unsigned long global_temp = 0; 

typedef struct TaskParam_t{
	signed long int period;
} Task;

Task p1, p2;

void vTask1(void *pvParameters){
	unsigned portBASE_TYPE uxPriority2;															
	uxPriority2 = uxTaskPriorityGet(xTask2Handle);
	
	unsigned portBASE_TYPE uxPriority3;															
	uxPriority2 = uxTaskPriorityGet(xButtonHandle);
	
	Task *task_period;
	task_period = (Task *)pvParameters;
	HAL_GPIO_WritePin(GPIOG, GPIO_PIN_13, GPIO_PIN_SET);
	
	for(;;){
		
		HAL_GPIO_TogglePin(GPIOG, GPIO_PIN_13);
		HAL_Delay(task_period->period);
		HAL_GPIO_TogglePin(GPIOG, GPIO_PIN_13);
		HAL_Delay(task_period->period);	
	
	}
	vTaskDelete(NULL);
}

void vTask2(void *pvParameters){
	

	
	Task *period;
	period =  (Task *) pvParameters;
	HAL_GPIO_WritePin(GPIOG, GPIO_PIN_14, GPIO_PIN_SET);
	for(;;){
		HAL_GPIO_TogglePin(GPIOG, GPIO_PIN_14);
		HAL_Delay(period->period);
		HAL_GPIO_TogglePin(GPIOG, GPIO_PIN_14);
		HAL_Delay(period->period);
	}
	vTaskDelete(NULL);
}

void vButton(void *pvParameters){
	
	unsigned portBASE_TYPE uxPriority1;
	
	uxPriority1 = uxTaskPriorityGet(xTask1Handle);					
	unsigned portBASE_TYPE uxPriority2;
	
	uxPriority2 = uxTaskPriorityGet(xTask2Handle);			
	
	for(;;){
		if(HAL_GPIO_ReadPin(GPIOA, GPIO_PIN_0) == GPIO_PIN_SET){
			vTaskPrioritySet(xTask1Handle, uxPriority1 + 1);
			vTaskPrioritySet(xTask2Handle, uxPriority2 + 1);
		}
	}
	vTaskDelete(NULL);
}

void ApplicationIdleHook(void){

}


int main(void)
{
HAL_Init();
SystemClock_Config();
HAL_NVIC_SetPriorityGrouping(NVIC_PRIORITYGROUP_4);
  HAL_NVIC_SetPriority(SysTick_IRQn, 0, 0);
  MX_GPIO_Init();

  MX_UART5_Init();
	p1.period = 1000;
	p2.period = 1000;
	xTaskCreate(vTask1, (signed char *) "LED_GREEN", configMINIMAL_STACK_SIZE, (void *) &p1, 1, &xTask1Handle);
	xTaskCreate(vTask2, (signed char *) "LED_RED", configMINIMAL_STACK_SIZE, (void *) &p2, 1, &xTask2Handle); 
	xTaskCreate(vButton, (signed char *) "BUTTON", configMINIMAL_STACK_SIZE, NULL, 2, NULL);
	vTaskStartScheduler();
	
  while (1){
	
  }
```

У нас есть 3 хэндела `xTask1Handle`, `xTask2Handle` и хэндел для кнопки. С помощью функции `uxTaskPriorityGet` мы берем значение дефолтных приоритетов от `Task 1` и `Task2` и пере присваиваем их с помощью функции `vTaskPrioritySet` на 2.

Динамическое изменение приоритетов для задач ChibiOS, имеет небольшую особенность так там нет дескриптора на задачу, а приоритет можно изменять только той задачи в которой вы в данный момент находитесь, которая имеет процессорное время выполнение.

```c
#include "ch.h"
#include "hal.h"

static WORKING_AREA(waThread1, 128);
static WORKING_AREA(waThread2, 128);
static WORKING_AREA(waButton, 128);

static msg_t Thread1(void *arg);
static msg_t Thread2(void *arg);
static msg_t Thread3(void *arg);

typedef struct TaskParam_t{
	signed long int period;
} Task;

Task p1, p2;

int main(void){
	p1.period = 1000;
	p2.period = 500;
	halInit();
	chSysInit();
	chThdCreateStatic(waThread1, sizeof(waThread1), NORMALPRIO, Thread1, (void *)&p1);
	chThdCreateStatic(waThread2, sizeof(waThread2), NORMALPRIO, Thread2, (void *)&p2);
	chThdCreateStatic(waButton, sizeof(waButton), HIGHPRIO, Thread3, NULL);
	while(TRUE){		
	}
}

static msg_t Thread1(void *arg){
	Task *period;
	period =  (Task *) arg;
	palSetPad(GPIOG, GPIOG_LED4_RED );
	while(TRUE){
		palTogglePad(GPIOG, GPIOG_LED4_RED);
		chThdSleepMilliseconds(period->period);
	}
}

static msg_t Thread2(void *arg){
	Task *period;
	period =  (Task *) arg;
	palSetPad(GPIOG, GPIOG_LED3_GREEN);
	while(TRUE){
		palTogglePad(GPIOG, GPIOG_LED3_GREEN);
		chThdSleepMilliseconds(period->period);
	}
}

static msg_t Thread3(void *arg){
	volatile int inc = 0;
	while(TRUE){
		if(palReadPad(GPIOA, GPIOA_BUTTON) == PAL_HIGH){
			inc++;
			if(inc % 2){
				chThdSetPriority(HIGHPRIO);
			}
			else{
				chThdSetPriority(NORMALPRIO);
				inc = 0;
			}
		}
	}
}
```
В данном примере мы понижая и повышая приоритет задачи для обработки события нажатия кнопки, позволяем получить процессорное время задаче с более низким приоритетом.

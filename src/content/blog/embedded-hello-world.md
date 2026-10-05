---
title: 嵌入式第一课：让板子闪起来
description: 从点亮一颗 LED 开始学嵌入式。讲清 GPIO 在做什么、为什么要有延时、怎么用寄存器和库函数两种方式写同一段代码，以及调试工具链。
pubDate: 2026-09-21
authors: ['moyu', 'laplace']
track: hardware
stage: practice
prereq: ['dev-environment-from-zero']
tags: ['嵌入式', '硬件', 'C']
---

软件可以只靠一台电脑学，硬件不行——你得有一块板子。这篇从最简单的目标开始：
**让一颗 LED 按一秒一次的节奏闪烁**。目标小，但它会把整条工具链都走一遍。

## 准备什么

| 东西 | 说明 | 大概价格 |
| --- | --- | --- |
| 开发板 | STM32F103C8T6「最小系统板」或 Blue Pill | 20 元上下 |
| 下载器 | ST-Link V2，用来把程序写进芯片 | 15 元上下 |
| 面包板 + LED + 电阻 | 练手用，注意限流电阻 220Ω～1kΩ | 几块钱 |

不想买硬件的话，先用 [Wokwi](https://wokwi.com/) 之类的在线仿真跑完这篇也行，概念是一样的。

## GPIO 到底在做什么

一颗 LED 接在某个引脚上。你「点亮」它，本质是**把这个引脚的电平拉高或拉低**：

```text
        ┌─────────────┐
PA5 ────┤  限流电阻   ├──── LED ──── GND
        └─────────────┘
输出高电平 → 有电流流过 → 亮
输出低电平 → 没有电流   → 灭
```

所以需要三样配置：

1. **使能时钟**——外设不供电就不工作，这一步最容易被忘。
2. **设置引脚为输出模式**——推挽输出、速度随便选个中速。
3. **写电平**——置位或清零。

## 用库函数写（HAL）

```c
#include "stm32f1xx_hal.h"

int main(void)
{
    HAL_Init();

    __HAL_RCC_GPIOA_CLK_ENABLE();          /* 1. 开时钟 */

    GPIO_InitTypeDef led = {0};
    led.Pin   = GPIO_PIN_5;                /* 2. 配置 PA5 */
    led.Mode  = GPIO_MODE_OUTPUT_PP;       /*    推挽输出 */
    led.Pull  = GPIO_NOPULL;
    led.Speed = GPIO_SPEED_FREQ_LOW;
    HAL_GPIO_Init(GPIOA, &led);

    while (1) {
        HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5);   /* 3. 翻转电平 */
        HAL_Delay(500);                          /*    延时 500 ms */
    }
}
```

`HAL_Delay` 依赖 SysTick 中断，所以 `HAL_Init()` 必须先调用。

## 用寄存器写一遍

同一件事，直接操作寄存器是这样：

```c
#define RCC_APB2ENR  (*(volatile uint32_t *)0x40021018)
#define GPIOA_CRL    (*(volatile uint32_t *)0x40010800)
#define GPIOA_ODR    (*(volatile uint32_t *)0x4001080C)

int main(void)
{
    RCC_APB2ENR |= (1u << 2);          /* 使能 GPIOA 时钟 */

    GPIOA_CRL &= ~(0xFu << 20);        /* 清掉 PA5 的 4 个配置位 */
    GPIOA_CRL |=  (0x1u << 20);        /* 通用推挽输出，速度 10MHz */

    while (1) {
        GPIOA_ODR ^= (1u << 5);        /* 翻转 PA5 */

        for (volatile uint32_t i = 0; i < 200000; ++i) {
            /* 空转延时。注意：这个循环的时长会随编译优化变化 */
        }
    }
}
```

两种写法都值得跑一遍：

- 库函数版**可移植、可读性好**，是项目里的默认选择；
- 寄存器版让你知道库函数下面发生了什么，看 datasheet 时不再发懵。

## 关于延时的两个坑

### 空循环延时不可靠

上面那个 `for` 循环的时长取决于主频和编译优化等级，`-O2` 下甚至可能被优化掉。
生产代码要么用定时器中断，要么用 `HAL_Delay` 这类基于硬件的实现。

### 别用 `HAL_Delay` 做长逻辑

它是阻塞式的：延时期间 CPU 什么都不能做。要同时按键检测 + 闪烁，
就得换成「定时器中断 + 状态机」的写法：主循环不再睡在那里，而是由定时器按固定周期
推进一个状态机。这是这个方向贯通层的题目。

## 工具链怎么走通

```bash
# 1. 用 CMake + arm-none-eabi 编译（工程结构见仓库）
cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build

# 2. 烧写（ST-Link）
openocd -f interface/stlink.cfg -f target/stm32f1x.cfg \
        -c "program build/blink.elf verify reset exit"
```

更省事的方式是在 VS Code 里装 Cortex-Debug 插件，把烧写和调试都放进 IDE。

## 调试：比 printf 更有用的两件事

1. **看寄存器窗口**。程序跑起来后，观察 `GPIOA_ODR` 的第 5 位是不是真的在翻转。
   如果没变，说明前面某一步配置错了，而不是「板子坏了」。
2. **示波器/逻辑分析仪**。有的话直接用，波形比任何日志都直观。
   没有的话，用「接第二个 LED 做状态指示」这种土办法也能定位到哪一步卡住。

## 板子没反应时的排查顺序

| 现象 | 先查什么 |
| --- | --- |
| 完全没反应 | 供电、时钟使能、下载器接线 |
| LED 常亮不闪 | 延时被优化掉，或卡在某个 `while` 里出不来 |
| 下载失败 | ST-Link 驱动、复位引脚、目标电压 |
| 烧进去但行为不变 | 忘了 `verify reset exit`，或者跑的是旧固件 |

> 嵌入式调试有一条铁律：**先确认最小的东西是对的**。点亮一颗 LED，再去接传感器。

## 下一步

LED 之后，建议按这个顺序加东西：按键（输入）→ 串口打印（调试手段）→ 定时器中断（非阻塞）→
PWM（呼吸灯）。每一步都只加一个新概念，出问题时才好定位。

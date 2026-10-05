---
title: 数据结构第一课：把链表画出来
description: 链表不难，难的是脑子里没有图。这篇用 C 从零写一个单链表，配上指针图、边界情况和复杂度，把「为什么这么设计」讲清楚。
pubDate: 2026-05-06
authors: ['laplace']
track: cs
stage: concept
tags: ['数据结构', '算法', 'C']
---

数据结构课上最常见的场景是：老师讲完链表，代码也看懂了，但一到自己写就乱。
原因往往不是语法，而是**脑子里没有那张图**。这篇先把图立起来，再写代码。

## 先看图，再看代码

单链表由一个个节点组成，每个节点存数据和一个指向下一个节点的指针：

```text
head
 │
 ▼
┌───────────┐   ┌───────────┐   ┌───────────┐
│ val: 1    │   │ val: 2    │   │ val: 3    │
│ next: ────┼──▶│ next: ────┼──▶│ next: NULL│
└───────────┘   └───────────┘   └───────────┘
```

三个要点：

1. `head` 本身不是节点，它是**指向第一个节点的指针**。空链表就是 `head == NULL`。
2. 最后一个节点的 `next` 必须是 `NULL`，这是遍历的终止条件。
3. 「插入」的代价小，是因为只需要改两个指针；「随机访问」慢，是因为只能从头一个个走。

## 定义节点

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int value;
    struct Node *next;
} Node;
```

`struct Node *next` 里的 `struct` 不能省——此时 `Node` 这个别名还没生效。

## 两个必须写对的函数

```c
/* 在链表头部插入，返回新的头指针 */
Node *push_front(Node *head, int value)
{
    Node *node = malloc(sizeof(Node));
    if (node == NULL) {
        return head;           /* 分配失败就不改链表，调用方自己判断 */
    }
    node->value = value;
    node->next = head;         /* 新节点接上原来的头 */
    return node;               /* 它成为新的头 */
}

/* 释放整条链表，并把头指针置空 */
void free_list(Node **head_ref)
{
    Node *cur = *head_ref;
    while (cur != NULL) {
        Node *next = cur->next;   /* 先存下一个，再释放当前 */
        free(cur);
        cur = next;
    }
    *head_ref = NULL;
}
```

`free_list` 里 `Node *next = cur->next;` 这一行是重点：
如果不先存下来，`free(cur)` 之后就没法再访问 `cur->next` 了——这是初学时最常犯的错。

## 画着写：删除一个节点

删除最容易写错，因为它有**两种不同情况**，区别就在于「要不要改 head」。

```text
删中间节点：让前一个跳过它
   prev        cur
    │           │
    ▼           ▼
┌───────┐   ┌───────┐   ┌───────┐
│  1    │   │  2    │   │  3    │
│ next ─┼─X▶│ next ─┼──▶│ next ─┼──▶ NULL
└───────┘   └───────┘   └───────┘
             prev->next = cur->next

删头节点：head 要往后挪
   head
    │
    ▼
┌───────┐   ┌───────┐
│  1    │   │  2    │
│ next ─┼──▶│ next ─┼──▶ NULL
└───────┘   └───────┘
   head = head->next
```

```c
/* 删除第一个值为 value 的节点，返回新的头指针 */
Node *remove_value(Node *head, int value)
{
    Node *cur = head;
    Node *prev = NULL;

    while (cur != NULL && cur->value != value) {
        prev = cur;
        cur = cur->next;
    }

    if (cur == NULL) {
        return head;              /* 没找到，原样返回 */
    }

    if (prev == NULL) {
        head = cur->next;         /* 删的是头节点 */
    } else {
        prev->next = cur->next;   /* 删的是中间/尾部节点 */
    }

    free(cur);
    return head;
}
```

> 为什么返回值还是 head？因为删除可能改变头指针。
> 想让函数签名统一，可以引入「哑节点（dummy node）」，代价是多一次分配。

## 复杂度：什么时候用，什么时候别用

| 操作 | 数组 | 单链表 |
| --- | --- | --- |
| 按下标访问 | O(1) | O(n) |
| 头部插入 | O(n) | O(1) |
| 已知位置插入 | O(n) | O(1) |
| 额外内存 | 无 | 每节点一个指针 |

一句话结论：**你要频繁随机访问就用数组（动态数组），要频繁在已知位置增删就用链表。**

## 写完之后的三道自测题

1. 空链表调用 `remove_value(head, 1)` 会发生什么？请对照代码逐行走一遍。
2. 删掉唯一一个节点后，`head` 应该是什么？`free_list` 能正确处理吗？
3. 用 `valgrind` 或 `-fsanitize=address` 跑一遍，确认没有内存泄漏。

```bash
gcc -Wall -Wextra -g -fsanitize=address list.c -o list && ./list
```

第三题别跳过。指针代码「看起来对」但漏内存，是最常见的隐性 bug。

## 下一步

把单链表改成双向链表，再想想「怎么判断链表有没有环」——那道题会逼你真正理解指针。
再往下就是这个方向的实践层：在真实代码里怎么选结构、代价出在哪里。

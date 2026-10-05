---
title: 终端、shell 与 PATH：命令为什么找不到
description: 敲下去的字符串是怎么变成程序的。这一篇把终端、shell、PATH、退出码这几件事讲清，之后所有「command not found」和「脚本为什么不生效」都能自己查。
pubDate: 2026-10-05
authors: ['moyu']
track: env
stage: concept
tags: ['命令行', '工具链']
featured: true
---

大部分人学命令行是从背命令开始的，于是遇到 `command not found` 只能复制报错去搜。
但只要知道「我敲的这一行字符串，中间经过了什么」，这类问题就不再需要搜。

## 终端不是 shell

这两样东西你每天都在同一个窗口里用，所以很容易混在一起，但它们是分开的：

- **终端（terminal）**：负责显示字符、接收键盘输入的那个程序。它不理解 `ls` 是什么。
- **shell**：真正读你那行字、解释它、然后去执行的程序，比如 `bash`、`zsh`、`fish`。

终端把一行文本交给 shell，shell 把结果吐回终端显示。所以：

- 换个终端（iTerm、Windows Terminal、VS Code 内置终端）不会改变行为；
- 换个 shell（`chsh -s /bin/zsh`）会，因为解释规则的人换了。

```bash
# 我现在用的是哪个 shell
echo $SHELL
# 当前进程树里，shell 上面那一层通常就是终端
ps -o comm= -p $PPID
```

## 你敲的一行，被拆成三段

以这行为例：

```bash
git commit -m "修正拼写"
```

shell 做的事按顺序是：

1. **分词**：按空格切开，引号里的算一段。得到 `git`、`commit`、`-m`、`修正拼写`。
2. **展开**：把 `$VAR`、`~`、`*`、`$(...)` 这些替换掉。这一步最容易出意外——
   文件名里有空格时 `rm *` 出事故，就是因为展开发生在执行之前。
3. **查命令**：第一个词 `git` 不是内置命令，于是去 `PATH` 里逐个目录找。

想看清 shell 到底看到了什么，用 `echo` 顶掉第二步的执行：

```bash
echo ~/code/*.md
echo "a b" c
```

## PATH 就是一张目录清单

`PATH` 是一个用冒号分隔的目录列表。shell 找命令时**从左到右**遍历，用第一个命中的。

```bash
# 拆开看，一行一个
echo $PATH | tr ':' '\n'
# 这个名字最终落在哪个文件上
type -a python3
```

于是 `command not found` 只有两种可能：

1. 程序装了，但它所在的目录不在 `PATH` 里（最常见：`~/.local/bin`、`~/.cargo/bin`）。
2. 程序根本没装。

`type -a` 能区分这两种情况：只要它什么都不输出，就是没装或没在 PATH 里。

> 为什么刚装完就要「重启终端」？因为 `PATH` 是进程启动时读来的环境变量，
> 已经开着的 shell 不会自动重新读配置文件。

## 谁在改 PATH

`PATH` 不是凭空来的，它由一串配置文件依次拼接：

| 文件 | 谁读它 |
| --- | --- |
| `/etc/profile` | 登录 shell 读，系统级 |
| `~/.bashrc` / `~/.zshrc` | 交互式 shell 每次启动读，你平时改的就是这个 |
| `~/.profile` | 图形界面登录时读 |

典型写法：

```bash
# 追加到 PATH 末尾
export PATH="$PATH:$HOME/.local/bin"

# 放到最前面，优先级最高（小心：会盖掉系统命令）
export PATH="$HOME/.local/bin:$PATH"
```

改完让当前窗口立刻生效：

```bash
source ~/.bashrc
```

## 退出码：命令也会「回答」你

每个命令结束时都会返回一个 0–255 的整数，0 表示成功。它就是 `&&` 和 `if` 的依据。

```bash
ls /tmp > /dev/null
echo $?          # 0
ls /nope 2> /dev/null
echo $?          # 非 0
```

这在脚本里决定了流程是否继续，也是 CI 判定失败的方式：

```bash
npm run build && echo "构建通过" || echo "构建失败"
```

`set -e` 会让脚本在任意命令返回非 0 时立刻停下，写部署脚本时几乎总该加上。

## 把它用起来：一次典型的排查

假设 `pip3 install --user` 之后 `pip3` 找不到：

```bash
# 1. 它装到哪了
python3 -m pip show --files pip | head

# 2. 那个目录在 PATH 里吗
echo $PATH | tr ':' '\n' | grep -F "$HOME/.local/bin"

# 3. 不在就加上，然后验证
export PATH="$HOME/.local/bin:$PATH"
type -a pip3
```

三步走完，问题从「玄学」变成了一个可以检查的事实。

## 下一步

模型有了，去 [环境搭建：从一台新电脑到能写代码](/blog/dev-environment-from-zero/) 里把它用一遍——
那篇是手把手，这一篇是为什么。之后再遇到任何「装了但用不了」，都可以套上面那个三步排查。

---
title: 包管理器与版本管理：把「装了什么」也管起来
description: 系统级包管理器管工具，语言级版本管理器管 Node 和 Python 的版本，项目里再用 .nvmrc、.python-version 和锁文件把版本钉住。读完能说清每样东西装在哪、为什么终端找得到它。
pubDate: 2026-10-06
authors: ['whale']
track: env
stage: practice
prereq: ['terminal-shell-and-path', 'dev-environment-from-zero']
tags: ['命令行', '工具链', '新手向']
---

装过几个工具之后，常见的情况是：同一个 `node` 或 `python` 装了好几份，终端用的却不是你以为的那份。
这篇把安装分成两层：系统级包管理器负责工具本身，版本管理器负责语言运行时的版本。
做完之后，你能说清每个命令来自哪个目录，并让一个项目在别人电脑上装出同样的版本。

## 适用对象与前置

适合已经能打开终端、敲过几条命令，准备在自己电脑上跑一个小项目的人。
需要先读 [终端、shell 与 PATH](/blog/terminal-shell-and-path/)，知道 shell 怎么沿 `PATH` 找命令。
还没装好基础环境的话，先走一遍 [环境搭建](/blog/dev-environment-from-zero/)。

系统以 Ubuntu 24.04（含 WSL2）和 macOS 为准，工具版本为 nvm v0.40.8、uv 0.12。

## 你会得到什么

- 用 `apt` 或 `brew` 装一个工具，并用 `command -v` 找到它装在哪
- 用 nvm 装 Node 22、用 uv 装 Python 3.12，并能在不同版本之间切换
- 一个带 `.nvmrc`、`.python-version` 和锁文件的项目目录，别人拉下来能装出同样的版本

## 两层分工

系统级包管理器装的是「整台机器共用」的工具，例如 `git`、`curl`、`ripgrep`：

| 系统 | 包管理器 | 默认安装位置 |
| --- | --- | --- |
| Ubuntu / WSL2 | `apt` | `/usr/bin` |
| macOS（Apple 芯片） | `brew` | `/opt/homebrew/bin` |
| macOS（Intel） | `brew` | `/usr/local/bin` |
| Windows 原生 | `winget` 或 `scoop` | 各软件自己的目录；scoop 统一放在 `~\scoop\shims` |

这一层的版本由发行版决定。Ubuntu 24.04 的 `apt install nodejs` 给的是仓库里那个固定版本，
项目要求更新的 Node 时它帮不上忙。语言运行时因此交给第二层：版本管理器把多个版本装进你的用户目录，
再通过改 `PATH` 决定当前用哪一个。

## 用系统包管理器装工具

```bash
# Ubuntu / WSL2：先刷新软件源索引，再装
sudo apt update
sudo apt install -y git curl ripgrep

# macOS
brew install git ripgrep

# 装完看它在哪
command -v rg
```

Windows 原生环境可以用 `winget install --id Git.Git -e`。本站其余笔记默认在 WSL2 里操作，下文不再写 Windows 命令。

## 用 nvm 管 Node

```bash
# 安装 nvm（脚本会把加载语句写进 ~/.bashrc 或 ~/.zshrc）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh | bash

# 让当前 shell 读到新配置，或者直接关掉终端重开
source ~/.bashrc

nvm install 22        # 装 Node 22 的最新小版本
nvm alias default 22  # 新开的终端默认用它
node -v
```

nvm 把每个版本放在 `~/.nvm/versions/node/<版本>/bin`，切换版本就是把这个目录换到 `PATH` 最前面。
想要更快的替代品可以用 [fnm](https://github.com/Schniz/fnm)，它同样读 `.nvmrc`。

## 用 uv 管 Python

```bash
# 安装 uv，可执行文件放在 ~/.local/bin
curl -LsSf https://astral.sh/uv/install.sh | sh
source ~/.bashrc

# 新建项目并指定 Python 版本，uv 会自动下载这个版本
uv init --python 3.12 demo
cd demo
uv add requests              # 写进 pyproject.toml，并生成 uv.lock
uv run python --version
```

uv 装的 Python 只给项目用，不碰系统自带的 `/usr/bin/python3`。
习惯了 pyenv 也可以继续用它管版本，它读的是同一个 `.python-version` 文件。

## 在项目里钉住版本

每个项目根目录放两类文件：

- **运行时版本**：`.nvmrc`（内容如 `22`）、`.python-version`（`uv init` 已经写好，内容如 `3.12`）
- **依赖锁文件**：`package-lock.json`（npm 生成）、`uv.lock`（uv 生成）

```bash
echo 22 > .nvmrc
nvm use          # 读 .nvmrc，切到 Node 22
npm ci           # 严格按 package-lock.json 安装
uv sync          # 严格按 uv.lock 安装
```

这几个文件都要提交进 Git。别人克隆后跑 `nvm use`、`npm ci`、`uv sync`，拿到的版本和你的一致。
本站仓库也是这样做的：部署流水线固定用 Node 22，并按 `package-lock.json` 安装依赖。

## 验证

`type -a` 会按 `PATH` 顺序列出同名命令的所有位置，第一行就是实际被执行的那个：

```bash
type -a node
```

在 WSL2 上用 nvm 切到 22 之后，预期输出类似：

```text
node is /home/<你>/.nvm/versions/node/v22.23.3/bin/node
node is /usr/bin/node
```

第一行在 `~/.nvm` 下，说明版本管理器生效了；第二行是 `apt` 装的那份，只是排在后面。
对 Python 项目，在项目目录里跑 `uv run python --version`，输出应是 `.python-version` 里写的版本。

## 常见报错

| 报错原文 | 原因 | 处理 |
| --- | --- | --- |
| `bash: rg: command not found` | 没装，或者装的目录不在 `PATH` 里 | 先 `command -v rg`；没有结果就装，装了还找不到就按 PATH 那篇检查目录 |
| `E: Unable to locate package ripgrep` | 软件源索引没刷新，或者包名写错 | 先 `sudo apt update`，再用 `apt search` 确认包名 |
| `nvm: command not found` | 安装脚本改了 `~/.bashrc`，当前 shell 还没读到 | `source ~/.bashrc` 或重开终端；用 zsh 的话检查 `~/.zshrc` |
| `error: externally-managed-environment` | Ubuntu 23.04 起禁止用 `pip` 往系统 Python 里装包 | 用 `uv add` 装进项目环境，命令行工具用 `uv tool install` |
| `node -v` 显示的版本不对 | `PATH` 里另一份 node 排在前面 | `type -a node` 看顺序，再 `nvm use` 或检查 shell 配置文件 |

## 延伸

装了什么现在有了记录，下一步把配置也放进版本控制：[dotfiles 第一版](/blog/dotfiles-in-git/)。
uv 的完整用法见 [官方文档](https://docs.astral.sh/uv/)。

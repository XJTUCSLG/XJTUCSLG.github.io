---
title: 环境搭建：从一台新电脑到能写代码
description: 装系统、配终端、装运行时、挑编辑器，按顺序走一遍。写完这篇的目标很简单：你打开电脑就知道从哪敲第一行命令。
pubDate: 2025-10-12
authors: ['lychee']
track: env
stage: practice
tags: ['命令行', '工具链', '新手向']
featured: true
---

第一次写代码常卡在环境：该装什么、装完在哪、终端为何说「命令不存在」。
这篇按顺序从裸机走到能跑第一个程序，约 40 分钟，建议对照做。

## 先说结论：你需要四样东西

1. **一个类 Unix 的命令行环境**（Linux / macOS，或 Windows 上的 WSL2）
2. **一个包管理器**，用来装别的东西
3. **目标语言的运行时**（我们先用 Python，其他语言同理）
4. **一个自己顺手的编辑器**

顺序很重要：包管理器在前，其他都靠它装。

## 第一步：决定在哪写代码

| 你的机器 | 建议 | 一句话理由 |
| --- | --- | --- |
| Windows | 装 WSL2，日常都在 WSL 里干活 | 服务器几乎都是 Linux，趁早熟悉 |
| macOS | 直接用系统终端 | 本身就是 Unix，命令基本通用 |
| Linux | 保持现状，别折腾发行版 | 折腾桌面环境的时间不如拿去写代码 |

Windows 上装 WSL2 现在只有一条命令，在**管理员** PowerShell 里执行：

```powershell
wsl --install -d Ubuntu
```

装完重启，第一次进 Ubuntu 会让你设用户名和密码。之后所有命令都在这个窗口里敲。

```bash
# 确认一下自己在哪、什么版本
pwd
uname -a
```

> 别急着美化终端。做完了能跑就行，主题和字体以后有的是时间折腾。

## 第二步：装包管理器

包管理器是「命令行里的应用商店」。装东西前，先更新一次索引：

```bash
# Ubuntu / Debian（WSL 里也是这套）
sudo apt update && sudo apt upgrade -y
```

macOS 用 Homebrew，装之前需要 Xcode 命令行工具：

```bash
xcode-select --install
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Windows 如果不想进 WSL，用系统自带的 `winget`：

```powershell
winget install --id Git.Git -e
```

## 第三步：装运行时

Python 用系统包管理器装就行，简单可靠：

```bash
# Ubuntu
sudo apt install -y python3 python3-pip python3-venv

# macOS
brew install python
```

Node.js 建议用版本管理器，方便在多个项目间切换：

```bash
# 任选其一
curl -fsSL https://fnm.vercel.app/install | bash   # fnm
brew install fnm                                    # 或 macOS
```

装完记得验证，并且**养成习惯**：新装的东西都跑一次 `--version`。

```bash
python3 --version
pip3 --version
node --version
```

如果提示 `command not found`，九成是 PATH 问题，参考下面的「常见的三个坑」。

## 第四步：编辑器

VS Code 是默认答案，不是因为它最好，而是因为它插件生态最全、遇到问题最好搜。

- 官网下载安装，Windows 上建议装在 WSL 里用的那套（`code .` 会自动走 WSL Remote）
- 必备插件：中文语言包、Python、GitLens（看代码历史）
- 先把自动保存打开：`文件 → 自动保存`

WSL 里可以用一条命令确认 VS Code 能连通：

```bash
mkdir -p ~/code/hello && cd ~/code/hello
code .
```

## 第五步：写第一个程序

```python
# hello.py
def main() -> None:
    print("环境搭好了，开始吧")

if __name__ == "__main__":
    main()
```

```bash
python3 hello.py
```

看到中文正确输出（没有乱码）就说明环境没问题了。

## 常见的三个坑

### 命令找不到（command not found）

说明这个程序的目录不在 `PATH` 里。查一下：

```bash
echo $PATH | tr ':' '\n'
which python3
```

要么重启终端让新配置生效，要么手动把目录加进 `~/.bashrc` 或 `~/.zshrc`：

```bash
export PATH="$HOME/.local/bin:$PATH"
```

这里为什么会这样、PATH 到底怎么起作用，在同一个方向的概念层里讲：
[终端、shell 与 PATH](/blog/terminal-shell-and-path/)。

### 中文乱码

Windows 上的老问题是默认编码不是 UTF-8。在 WSL 里通常不会遇到；
如果碰到了，优先检查终端和文件的编码设置，别急着改代码。

### 下载慢 / 连不上

先判断是「网络本身慢」还是「源在国外」。装 Python 包可以换国内镜像：

```bash
pip3 config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
```

npm 同理：

```bash
npm config set registry https://registry.npmmirror.com
```

## 一个可以照抄的验证清单

| 检查项 | 命令 | 期望结果 |
| --- | --- | --- |
| 终端可用 | `echo $SHELL` | 显示 bash 或 zsh |
| 包管理器 | `apt --version` / `brew --version` | 有版本号输出 |
| Python | `python3 --version` | 3.10 以上 |
| Git | `git --version` | 有版本号 |
| 编辑器 | `code --version` | 有版本号 |

五行都能过，环境就算搭完了。

## 下一步

环境这种东西，搭一次是远远不够的——你会重装很多次，每次都会更快。
真正值得花时间的是下一步：把代码管起来。

- 接着读：[Git 与 GitHub：把版本管理讲成人话](/blog/git-github-workflow/)
- 卡在某一步：去 [issue 区](https://github.com/XJTUCSLG/XJTUCSLG.github.io/issues) 说清你敲了什么、报了什么错，我们补进这篇。

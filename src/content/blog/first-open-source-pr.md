---
title: 第一个开源 PR：从 issue 到 merged
description: 不用等「准备好了」再参与开源。这篇用我们自己的仓库做例子，走一遍从找问题、改代码、被 review 到合并的完整流程，含常见卡点。
pubDate: 2026-03-15
authors: ['lychee']
track: github
stage: practice
prereq: ['git-github-workflow']
tags: ['开源', '协作']
---

第一次给别人的项目提 PR，最大的障碍不是技术，是不确定「我这样做对不对」。
这篇按真实顺序拆一遍，你可以照着走完全程。全程大概两小时，含等待时间。

## 从哪里找活干

新手最容易被劝退的一句话是「去修 good first issue」——然后发现那些 issue 早被抢了，
或者需要你没见过的知识。更现实的三条路：

1. **改文档**：错别字、过时命令、没说清的步骤。门槛最低，价值真实。
2. **复现 bug**：在 issue 里补一句「我在 X 环境复现了，报错如下」——这是贡献，不是打扰。
3. **补测试**：别人懒得写的边界情况，通常真的缺。

别一上来就改核心逻辑。**先让项目认识你**，再动结构。

## 准备环境

```bash
# 1. 网页上点 Fork，然后克隆自己那份
git clone git@github.com:<你的用户名>/XJTUCSLG.github.io.git
cd XJTUCSLG.github.io

# 2. 把上游仓库加上，方便同步最新代码
git remote add upstream https://github.com/XJTUCSLG/XJTUCSLG.github.io.git

# 3. 装依赖并跑起来
npm install
npm run dev
```

浏览器打开终端里给出的地址，看到站点就是成功了。

> 卡在 `npm install` 的，先看 [环境搭建](/blog/dev-environment-from-zero/) 那篇的网络部分。

## 开一个分支，别在主分支上干活

```bash
git switch -c docs/fix-typo-in-git-post
```

分支名建议带类型前缀：`docs/`、`fix/`、`feat/`。评审的人一眼就知道你在做什么。

## 改，然后验证

改完别急着提交，先确认没把事情弄坏：

```bash
npm run build      # 能不能构建
npm run check      # 类型检查（如果项目配了）
```

如果是纯文档改动，至少要在本地 `npm run dev` 里把那一页打开看一遍——
Markdown 的链接错误、代码块没闭合，都是这样发现出来的。

```bash
git status         # 我到底改了什么
git diff           # 具体每一行的改动
git add -p         # 挑着暂存，避免顺手带上无关文件
git commit -m "修正 Git 笔记中的拼写错误"
```

## 推送并开 PR

```bash
git push -u origin docs/fix-typo-in-git-post
```

推送后 GitHub 会提示创建 Pull Request。写 PR 描述时，用这个四行结构就够了：

```markdown
## 做了什么
修正第 3 节里的拼写错误，并把过时的 `git checkout` 换成 `git switch`。

## 为什么
`checkout` 承担两种语义，官方已拆分为 `switch` 和 `restore`。

## 怎么验证的
本地 `npm run build` 通过，预览页正常。

## 关联
Closes #12
```

`Closes #12` 会在 PR 合并后自动关掉那个 issue——评审者喜欢这种自觉。

## 被 review 了怎么办

会有人给你提意见，这里的心态比技术重要：

- **意见不是否定。** 大多数 reviewer 只是在维护项目的统一性。
- **不同意就说，但给理由。** 「我这样写是因为 X」比「好吧我改」好得多。
- **改完不需要重新开 PR。** 在同一个分支上继续提交、推送，PR 会自动更新。
- **别 force push 到已经有人在看的分支上**，那会让 review 评论失去位置。

```bash
# 上游更新了，同步到自己的分支（保持历史干净）
git fetch upstream
git rebase upstream/main
git push --force-with-lease    # 只有自己的分支才这么做
```

## 合并之后

```bash
git switch main
git pull --rebase upstream main
git push origin main
git branch -d docs/fix-typo-in-git-post
```

然后去找下一个。开源参与是滚雪球：第一个 PR 最慢，第五个开始你就熟悉节奏了。

## 新手常见的五个卡点

| 现象 | 原因 | 怎么办 |
| --- | --- | --- |
| 推送被拒绝（403） | 往上游仓库推了 | 推到 `origin`（你自己的 fork） |
| PR 里出现了别人的提交 | 从 `main` 拉的分支被基了 | 从最新的 `upstream/main` 重新开分支 |
| CI 报格式错误 | 项目有 lint / format | 跑一遍项目里的 `npm run check` 或 prettier |
| review 一直没人理 | 忘了 @ 维护者 | 在 PR 里礼貌 ping 一次，别刷屏 |
| 不敢提 | 怕问蠢问题 | issue 里问清楚再动手，没人会怪你 |

## 下一步

想练手的话，这个站本身就是最好的练习场：文档、代码、样式都欢迎改。
从 [issue 列表](https://github.com/XJTUCSLG/XJTUCSLG.github.io/issues) 挑一个，
按上面的流程走一遍，我们保证认真回。

下一步也可以看看[方向索引](/tracks/)里那些灰色题目——它们是被明确标出来的空缺。

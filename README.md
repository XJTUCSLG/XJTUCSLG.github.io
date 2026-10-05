# XJTUCSLG 101

西安交通大学学生开源社区（非官方）的**工程笔记 + 随笔**。
课上讲原理，也讲给考试听；这个站写另一部分——命令行、版本控制、后端、前端、数据库、部署、
Agent 工具链这些写项目每天都在用、却没人开课的东西。工程之外另有随笔栏目，放求学建议、
大学生活、心态这类不要求「能复现」的内容。

站点：<https://xjtucslg.github.io>

## 内容模型

站上有两个集合，互不干扰。

### 一、工程笔记：方向 × 三层（`src/tracks.ts`）

- **方向（track）**：13 个，分两组——「工程开发」（环境与命令行、Git、GitHub 与协作、编辑器与 Vim、
  后端、前端、数据库、部署与运维、测试与调试、Agent 与 LLM 工具链）与「基础与学习」
  （计算机基础、硬件与嵌入式、学习方法）。
- **层（stage）**：每个方向固定三层，`concept`（概念）→ `practice`（实践）→ `integration`（贯通）。
  顺序是真的，所以页面上用编号 `1.1` / `2.1` / `3.1`。
- **一格可以放任意多篇**：编号由 `src/lib/posts.ts` 按 `pubDate` 自动算（先写的先读），
  想插队就写 `order`。写一篇发一篇，不用凑齐一层。
- 还没写的题目写在 `src/tracks.ts` 的 `plan` 里，会以灰色虚线出现在首页速览、方向页和 `/tracks/`。

### 二、随笔（`src/content/essays/`）

- 按 `topic` 栏目分组：求学 / 生活 / 心态 / 杂谈（见 `src/consts.ts` 的 `ESSAY_TOPICS`）。
- 不参与方向 × 三层，编号也不适用；列表页按栏目分组，详情页只有栏目和作者。
- 写作宽容度更高：不要求能复现，但要求有一句自己的判断。模板见 `src/content/_essay-template.md`。

选题依据见 [`research/reference-101-sites.md`](research/reference-101-sites.md)（对标 MIT Missing Semester、
中科大 Linux 101、csdiy、OSSU、roadmap.sh、opensource.guide 等 18 个站点）与
[`research/design-notes.md`](research/design-notes.md)（设计方向与取舍）。

## 技术栈

- [Astro](https://astro.build/) v7（静态输出，零客户端框架）
- Astro Content Collections 管理两份内容（frontmatter 用 Zod 校验）
- Shiki 自定义主题 `xjtucslg-ink`（`src/lib/shiki-theme.mjs`）+ 客户端 mermaid 渲染
- 手写 CSS 设计令牌，无 UI 框架、无预处理器、无外部字体
- 部署：GitHub Pages（`main` 分支推送后自动构建）

## 本地开发

```bash
npm install      # 首次
npm run dev      # 本地预览 http://localhost:4321
npm run build    # 产出 dist/
npm run preview  # 预览构建结果
npm run check    # 类型检查（astro check）
```

> 如果 `npm install` 因为 postinstall 脚本被系统权限拦下，可以退一步：
> `npm install --ignore-scripts`，esbuild 会直接使用平台可选依赖里的二进制。
>
> 已知问题（与本站内容无关）：某些 `astro@7.3.5 + vite@8.3.2 + pnpm 目录结构` 的组合下，
> `astro sync`（`build` / `check` 的前置步骤）会在加载 glob loader 的 CJS 依赖 `picomatch` 时报
> `require is not defined`。`npm run dev` 不受影响（dev 会预打包依赖）。
>
> 最小复现在 `.probe-ssr-cjs.mjs`、`.probe-ssr-cjs-2.mjs`、`.probe-external.mjs`、
> `.repro-cjs-import.mjs` 与 `.tmp-vercheck/`，用 `node <file>` 直接跑。
> 排查期的 vite 调试日志 `sync-debug.log` **不在仓库里**：它会把整个进程环境变量写进文件，
> 含 API key 与 token，已在 `.gitignore` 中排除。

## 项目结构

```text
src/
├─ tracks.ts               # 方向 × 三层的内容模型与「想写」题目（改选题先看这里）
├─ consts.ts               # 站点信息、导航、页脚、随笔栏目（改文案看这里）
├─ content.config.ts       # 两个集合的 schema（blog / essays）
├─ content/blog/           # 工程笔记（Markdown）
├─ content/essays/         # 随笔（Markdown）
├─ content/_template.md         # 工程笔记模板（在集合目录之外，不会被收录）
├─ content/_essay-template.md   # 随笔模板
├─ layouts/BaseLayout.astro     # 含 mermaid 的按需渲染脚本
├─ components/             # Seo / SiteHeader / SiteFooter / NoteRow / EssayRow / TrackIndex / StageCells
├─ lib/
│  ├─ format.ts            # 日期、阅读时长、排序
│  ├─ posts.ts             # 工程笔记：查表、编号、上下篇、相关推荐
│  ├─ essays.ts            # 随笔：查询、按栏目分组
│  └─ shiki-theme.mjs      # 代码高亮主题
├─ pages/
│  ├─ index.astro          # 首页：刊头 + 起步路线 + 方向速览 + 最近写的 + 随笔
│  ├─ tracks/index.astro   # 方向总览（每个方向的三层状态）
│  ├─ tracks/[track].astro # 单方向：逐层列出已写与待写
│  ├─ blog/index.astro     # 工程笔记列表（按方向分组，层 / 方向筛选 + ?stage= 深链）
│  ├─ blog/[...id].astro   # 工程笔记详情（信息表、目录、上一篇/下一篇）
│  ├─ essays/index.astro   # 随笔列表（按栏目分组）
│  ├─ essays/[...id].astro # 随笔详情
│  ├─ roadmap.astro        # 怎么读这个站
│  ├─ about.astro          # 关于 / 加入 / 写作规范
│  ├─ 404.astro
│  └─ rss.xml.ts           # RSS（工程笔记 + 随笔，用分类区分）
└─ styles/                 # global.css（令牌与基础排版）· components.css · pages.css
```

## 写一篇新的

1. 决定写哪种：
   - **工程笔记**：看 `/tracks/` 里哪一格还空着，想写哪个方向、哪一层。
   - **随笔**：随便，选题从「求学 / 生活 / 心态 / 杂谈」里挑一个。
2. 复制对应模板：`src/content/_template.md` → `src/content/blog/`，
   或 `src/content/_essay-template.md` → `src/content/essays/`。
   文件名会变成 URL，用有意义的 slug。
3. 填 frontmatter，写错会在 `npm run dev` 时直接报错：

   **工程笔记**

   | 字段 | 必填 | 说明 |
   | --- | --- | --- |
   | `title` / `description` | 是 | 标题与一两句说明 |
   | `pubDate` | 是 | `2026-01-01` 这样写即可 |
   | `track` | 是 | 方向 slug，取值见 `src/tracks.ts` |
   | `stage` | 是 | `concept` / `practice` / `integration` |
   | `order` | 否 | 同一格内的顺序；不写就按日期从早到晚 |
   | `prereq` | 否 | 前置笔记 id 数组，显示在文章开头 |
   | `tags` | 否 | 跨方向标签，别重复方向名 |
   | `authors` / `minutes` / `featured` / `draft` / `updatedDate` | 否 | 同上 |

   **随笔**

   | 字段 | 必填 | 说明 |
   | --- | --- | --- |
   | `title` / `description` | 是 | 标题与一两句说明 |
   | `pubDate` | 是 | 发布日期 |
   | `topic` | 是 | `求学` / `生活` / `心态` / `杂谈` |
   | `tags` | 否 | 自由标签，显示在文章开头 |
   | `authors` / `minutes` / `featured` / `draft` / `updatedDate` | 否 | 同上 |

4. 正文写完在本地看一遍：目录是否正常、代码块有没有横向溢出、mermaid 图有没有渲染出来。
5. 提 PR。写作规范见站内「关于 → 一起写笔记」。

> 工程笔记的编号（1.1、1.2）由 `src/lib/posts.ts` 自动算，不用手写。

## 写正文时能用的东西

- **代码块**：标语言，用站点主题染色的语言都可以（`bash` / `c` / `python` / `ini` / `text`…）。
  用不存在的语言标识会在 dev 日志里出现 fallback 警告。
- **图表**：直接写 ```` ```mermaid ```` 代码块。渲染时机、主题变量都在 `BaseLayout.astro`
  的脚本里；颜色从 `:root` 的 CSS 变量读，改令牌时图和页面一起变。
  标签里可以写 `<br/>` 换行；渲染失败时源码会留在原地并标出来。
- **表格**：适合写「对比」和「排查顺序」。正文表格会自动横向滚动，不用担心窄屏。

## 设计系统

身份是一本工程手册：冷调纸面、单一强调色、细线与编号组织内容，不用阴影、圆角卡片和渐变。
密度对齐常见开源文档站：界面字号 14–15px，区块间距 1.5–2.25rem。

| 令牌 | 值 | 用途 |
| --- | --- | --- |
| `--ink` | `#16181a` | 正文与标题 |
| `--paper` | `#f0f1f2` | 页面底色（冷灰，刻意避开暖米色） |
| `--sheet` | `#ffffff` | 纸面：索引表与列表所在的平面 |
| `--rule` / `--rule-strong` | `#d3d6d8` / `#b9bec1` | 分隔线 |
| `--accent` | `#0e5b43` | 唯一的彩色：链接、当前态、强调 |
| `--code-bg` | `#1b2024` | 代码块底色 |

排版：界面与标题用中文黑体栈，正文用宋体栈（中文讲义的老规矩，16px / 行长约 36 字），等宽只留给代码。
不加载任何外部字体（jsDelivr 在浏览器端不可靠、Google Fonts 国内不稳）。所有令牌定义在
`src/styles/global.css` 的 `:root` 里。

## 部署

`.github/workflows/deploy.yml` 在推送到 `main` 后自动构建并发布到 GitHub Pages，
需要在仓库 `Settings → Pages` 把 Source 设为 **GitHub Actions**。

## 授权

- 文字内容：CC BY-SA 4.0
- 站点代码：MIT

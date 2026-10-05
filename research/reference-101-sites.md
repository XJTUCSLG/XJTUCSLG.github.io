# 学生开源社区 "101" 工程材料参考站点调研

- **日期**：2026-10-05（所有取值均以该日抓取结果为准）
- **方法**：先用 `web_search` 找候选站点/仓库，再逐个**实际抓取**页面或 GitHub API 校验；只用抓到的内容作为事实依据，不依赖记忆或二手描述。引用每处最多一行原文，并附上抓取 URL。
- **置信度约定**（全文一致使用）：
  - **Verified**：本次直接抓取到了该事实（页面正文、`sitemap.xml`、仓库 API/README/mkdocs nav 等）。
  - **Inferred**：事实由两个以上间接证据推出，未直接看到原文（会写明推理链）。
  - **Unverified**：只在搜索结果或第三方列表里出现，本次**未能**抓取成功；**不能**当依据使用。
- **本次网络限制（影响标注）**：`raw.githubusercontent.com`、`cdn.statically.io`、`raw.githack.com` 不可用；`github.com` HTML、`api.github.com`（`Accept: application/vnd.github.raw` 可拿到真实文件字节）、`web_search` 可用。因此中文高校社团官网里凡是纯前端 SPA 渲染的，本次只能确认「站点存在 + 标题」，内容无法核实。

---

## 1. MIT — The Missing Semester of Your CS Education

- **是什么**：MIT 的 1 月短期课程（IAP），讲「CS 课程里没人教、但天天要用的工具」。主页副标题：`Master powerful tools that will make you a more productive computer scientist and programmer.`
- **谁在办**：Anish Athalye、Jon Gjengset、Jose Gomez 授课；SIPB（MIT 学生信息处理委员会）作为 SIPB IAP 2026 活动支持；源码仓库 `github.com/missing-semester/missing-semester`，CC BY-NC-SA。
- **URL**：https://missing.csail.mit.edu/ （抓取成功）
- **顶层主题（2026 syllabus，9 讲）**：
  1. Course Overview + Introduction to the Shell
  2. Command-line Environment
  3. Development Environment and Tools
  4. Debugging and Profiling
  5. Version Control and Git
  6. Packaging and Shipping Code
  7. Agentic Coding
  8. Beyond the Code
  9. Code Quality
- **难度排序方式**：**不按难度，按开课日期排**（列表项形如 `**1/12/26**: <a href="/2026/course-shell/">Course Overview + Introduction to the Shell</a>`）。没有 level 标签、没有前置条件字段。
- **信息架构要点**：
  - 首页 = 本年课程表 + 通用信息 + 翻译列表 + "Beyond MIT" 讨论串列表；导航只有 `lectures / past / about` 三项。
  - `/past/` 页给出 2026 / 2020 / 2019 三个**完整自包含**版本：`Each year's lectures are fully self-contained. We recommend starting with the most recent version of the material.` → 旧版不删、作为「专题补充」存在。
  - 历年增设的专题（往年有、2026 没有）：Data Wrangling、Security and Cryptography、Potpourri、Q&A（2020）；Backups、Automation、Machine Introspection、OS Customization、Web and Browsers、Security and Privacy（2019）。
  - **AI 不作为独立一门课**：`Since AI is a cross-functional enabling technology, there is not a standalone AI lecture; we've instead folded the use of the latest applicable AI tools and techniques into each lecture directly.`（这是本次调研里最值得抄的一条信息架构决策。）
  - 20 种社区翻译从首页直接列出（含简繁中文），并声明「未审核」。
  - 被 OSSU 收纳为 "CS Tools" 模块的唯一课程（见 §16）。

## 2. 北大 CS 自学指南（csdiy / PKUFlyingPig/cs-self-learning）

- **是什么/谁办的**：个人开源项目（作者 PKUFlyingPig），仓库描述即 `计算机自学指南`，站点 `https://csdiy.wiki`。抓取时 `stargazers_count = 76021`、`forks_count = 8005`、MIT License、`has_discussions = true`、`open_issues_count = 165`。
- **URL**：https://api.github.com/repos/PKUFlyingPig/cs-self-learning （元数据）；目录：https://api.github.com/repos/PKUFlyingPig/cs-self-learning/contents/docs
- **顶层主题（`docs/` 一级目录，Verified）**：Web开发、人工智能、体系结构、编程入门、编程语言设计与分析、并行与分布式系统、必学工具、操作系统、数学基础、数学进阶、数据库系统、数据科学、数据结构与算法、机器学习、机器学习系统、机器学习进阶、深度学习、深度生成模型、电子基础、系统安全、编译原理、计算机图形学、计算机系统基础、计算机网络、软件工程；另有 `CS学习规划.md`、`使用指南.md`、`好书推荐.md`、`后记.md`（均含 `.en.md` 英译）。
- **`必学工具` 子主题（Verified，逐文件）**：CMake、Docker、Emacs、GNU Make、Git、GitHub、LaTeX、Scoop、Vim、thesis（论文写作）、tools、workflow、信息检索、翻墙。
- **难度排序方式**：靠「目录名」暗示阶段（编程入门 → 体系结构/操作系统 → 机器学习进阶 → 深度生成模型），没有显式 level 字段；真正的顺序信息集中在 `CS学习规划.md` 这一篇长文里。
- **信息架构要点**：
  - **每篇不是自编教程，而是「课程/书单」推荐**（单篇文件 0.8–14 KB），读者最终跳到 Coursera/edX/官方课。→ 这是「自学指南」形态，不是「工程实践指导」形态。
  - `必学工具` 是所有目录里唯一带「工具链」性质的入口，但只把 Vim/Emacs/Git 等做**清单式**处理，没有三级递进（没写「从入门到写插件」的路径）。
  - `CS学习规划.md`（≈38 KB，抓取时 size=37997）+ `使用指南.md` + `好书推荐.md` 构成「如何用本站」的元层，属于少数把「学习者入口」单独成页的站点之一。

## 3. 中科大 LUG — Linux 101

- **是什么/谁办的**：LUG@USTC 的公开课程讲义，`site_description: "Linux 101 课程讲义"`，CC BY-SA 4.0，用 MkDocs Material 构建。
- **URL**：https://101.lug.ustc.edu.cn/ ；nav 原文：https://api.github.com/repos/ustclug/Linux101-docs/contents/mkdocs.yml ；页面清单：https://101.ustclug.org/sitemap.xml
- **顶层主题（nav 原文，9 章 + 附录，Verified）**：
  - 负一：计划规格（章节编写指导 `Spec/writing.md`、演示文稿规格 `Spec/slide.md`）
  - 零：欢迎（index、记号约定、功劳簿）
  - 一：初识 Linux
  - 二：个性化配置与建站体验
  - 三：软件安装与文件操作
  - 四：进程、前后台、服务与例行性任务
  - 五：用户与用户组、文件权限、文件系统层次结构
  - 六：网络、文本处理工具与 Shell 脚本
  - 七：Linux 上的编程
  - 八：Docker
  - 九：Shell 高级文本处理与正则表达式
  - 附录：Markdown 教程 / man 文档示例 / 其他发行版技术差异 / 使用 WSL 安装 Linux
- **难度排序方式**：**章节编号即顺序，且语义上是「由浅入深」**（初识 → 配置建站 → 安装与文件 → 进程服务 → 权限 → 网络+脚本 → 编程 → Docker → 正则进阶）。`sitemap.xml` 显示每章都切出 `/ChXX/`、`/ChXX/supplement/`、`/ChXX/solution/` 三条 URL，即「正文 / 拓展阅读 / 思考题解答」三件套（Ch07–Ch09 在抓取时只有 `supplement`，`solution` 尚未补齐——说明这是「边写边发」的在建材料）。
- **信息架构要点**：
  - **给作者看的部分被公开**：`Spec/writing.md`（章节编写指导）作为 nav 第一项，把「怎么写一章」变成公开规约 → 这是学生社区能长期多人协作的关键机制。
  - 章节命名用**知识域**（「进程、前后台、服务与例行性任务」）而非工具名（不是 "systemd 教程"），更耐时间。
  - 「思考题 + 解答」独立成页 = 概念层与实践层物理分离，便于验收。
  - 没有前置条件字段，也没有 level 标签（顺序隐含在编号里）。

## 4. 上海交大 SJTUG（SJTU \*NIX User Group）

- **是什么/谁办的**：上海交通大学 \*NIX 用户组，Hugo 站点，副标题 `A Joyful Techie User Group`。
- **URL**：https://sjtug.org/ （已抓取）
- **顶层结构**：导航只有 `About / Archive / Mirrors / Contacts`；首页是**倒序文章流**（抓到的首条是 `SJTU x Xflops Linux 入门 × Agent 实操 Workshop`，日期 Sep 11 / 2026）。
- **难度排序方式**：**没有**。没有课程目录、没有 level、没有前置条件。
- **信息架构要点 / 可观察结论**：
  - 社团的技术产出以「活动 + 分享会」形式存在（抓到的历史条目：`Build system, lazy evaluation and incremental computation`、`任务型对话概览`、`C++中的运行期与编译期多态`、`Rust 中的内存安全`、`合作训练`、`暑期课堂预告`），**活动结束即沉淀为归档文章**，缺少可预期的学习入口。
  - 值钱的信号：2026 年的工作坊把 "Linux 入门" 与 "Agent 实操" 放在同一场 → 与 §1 的「AI 不单列」是同一趋势的独立证据（**Inferred**：两边都没写为什么，只观察到并列）。

## 5. 清华 TUNA 协会

- **是什么/谁办的**：`清华大学 TUNA 协会原名清华大学学生网管会，注册名清华大学学生网络与开源软件协会，是由清华大学网络技术和开源软件爱好者、技术宅组成的团体。`
- **URL**：https://tuna.moe/ （已抓取，页面为前端渲染 + 部分静态 HTML）
- **顶层结构（Verified）**：导航 `HOME / EVENTS / BLOG / RSS / PODCAST / MIRRORS`；首页「线上服务」四块 = 开源镜像站、DNS666、网络授时、鱼屋。
- **难度排序方式**：无课程体系。
- **信息架构要点**：教学属性留在**服务文档**里（`/help/dns/`、`/help/ntp/` 这类「服务使用说明」），没有教学目录；镜像站是主力公共资产。→ 说明「高校开源社团」实际上有两种产物：公共基础设施（镜像/DNS/NTP）与一次性活动记录，两者都**不构成 101 课程**。

## 6. 浙江大学计算机学院学生会（ZJUCSSU）

- **是什么/谁办的**：`浙江大学计算机科学与技术学院学生会` 的学生服务站点（注意：是**学院学生会**，不是「开源社团」）。MkDocs Material。
- **URL**：https://zju-cssu-dev.github.io/home/ （已抓取；nav 源 https://api.github.com/repos/ZJU-CSSU-Dev/home/contents/mkdocs.yml ）
- **顶层主题（tabs，Verified）**：主页 / 通知中心 / 知识共享 / 答疑解惑 / 关于我们
  - 通知中心：教学事务、评优评先和资助、形策二课、学业科研、就业发展
  - 知识共享：培养方案（计算机科学与技术 / 软件工程 / 信息安全 / 工业设计 / 人工智能）、个人笔记（课程学习笔记）、个人项目
  - 答疑解惑：常见问题
- **难度排序方式**：无（按行政事务分类）。
- **信息架构要点**：
  - 站点自我定位是 `我们提供重要的高频通知、学习资源的收集与分享、以及同学们和学院之间的一线沟通渠道` → **工程内容几乎为零**，价值在「培养方案 + 事务通知」。
  - 值得借的机制：`个人笔记` / `个人项目` 用占位模板收集同学投稿；`培养方案` 按专业分站点 → 用「专业维度」而不是「技术维度」组织。
  - 技术栈与 §3 高度一致（MkDocs Material + tabs + tags），是中文高校学生站的**事实标准模板**。

## 7. 电子科技大学 LUG（uestclug.org）

- **是什么/谁办的**：电子科技大学 Linux 用户组官网（页面 title：`电子科技大学 Linux 用户组`）。
- **URL**：https://uestclug.org/ （已抓取，但内容不可得）
- **可确认事实**：抓到的 HTML 只有一个空 `<div id="app"></div>` + `<noscript>We're sorry but uestc-lug-official-frontend doesn't work properly without JavaScript enabled. 您需要启用 JavaScript 才能正常访问我们的官网 :)</noscript>`。
- **结论**：**Verified** 的是「站点存在 + 是 Vue SPA + 无 SSR 内容」；其主题目录、文章、难度体系 **Unverified**（本次无法获取）。
- **信息架构要点（抗模式）**：纯 SPA 导致内容无法被搜索引擎、RSS、`curl`、以及任何「想引用/想 diff」的人读到 → 学生社团站不适合做成纯 SPA。

## 8. China GNU/Linux User Group wiki — 中国高校开源社区列表

- **是什么/谁办的**：`lug.org.cn`（DokuWiki，站点名 China GNU/Linux User Group）维护的国内高校开源社区索引，页面标题带 `(Deprecated)` 并注明 `Moved to 中国高校开源社区列表`。
- **URL**：https://lug.org.cn/doku.php?id=univercity-lugs （已抓取；页面元信息：最后更改 2021/03/03，由 nonabyte 修改）
- **内容（Verified，链接列表）**：中科大 Linux 用户协会、清华 TUNA 协会、上海交大 Linux 用户组、哈工大计算学部 Linux 开源学生科创俱乐部、电子科大 Linux 用户组、北邮互联网与开源社区（byrio）、西电开源社区、上科大 GeekPie、兰大开源社区、西南大学开源社区、北大（学生 Linux 俱乐部，原文为删除线）。
- **难度排序方式 / IA**：无。纯外链清单，且**已过期**（页面自身标注 deprecated、6 年未改）。
- **对本次任务的作用**：这是一份「哪些学校有实体社团」的可核对名单；同时证明**其中大部分社团只做基础设施与活动，没有 101 课程体系**（**Inferred**：TUNA/SJTUG 抓取结果与之一致，其余站点本次未逐个抓取，标 Unverified）。同业站点还互相链了学生开源年会（sosconf.org）、开源工场（openingsource.org）等社区活动组织。

## 9. 交大学生社团自建教培 wiki（sjtu-src.github.io）

- **是什么/谁办的**：`SJTU-SRC Wiki`，`site_description: Robocup Small Size League 教培系统`，`author: SYLG`，MkDocs Material。
- **URL**：https://sjtu-src.github.io/Wiki/chapter_preface/ （已抓取）
- **可确认事实**：站点是**某个学生团队（SRC）给新成员写的从零教培 wiki**，内容域是 RoboCup Small Size League（机器人足球），第一章为 "SJTU_SRC"，第二章 `what_is_ssl/`，全站带招新公告（`2026夏季招新! QQ招新群号1104115503`）。
- **未确认**：该团队是否即「上海交通大学学生开源社团」这一实体 —— **Unverified**（本次没抓到任何能证实两者同一的页面）。
- **信息架构要点**：这是**「社团自建教培系统」这一形态的真实样本**：`chapter_preface → what_is_ssl → ...` 用「先把新人不知道的前提讲清楚」开篇（what is SSL 作为第 2 页），并把招新公告放在全站横幅。→ 启发是「入口页先回答『这是什么领域』」，而不是先讲工具。

## 10. roadmap.sh / developer-roadmap

- **是什么/谁办的**：社区驱动的路线图站点。**Verified 的变化**：`https://api.github.com/repos/kamranahmedse/developer-roadmap` 返回的 `full_name` 已是 `nilbuild/developer-roadmap`；仓库描述 `Interactive roadmaps, guides and other educational content to help developers grow in their careers.`
- **URL**：https://api.github.com/repos/nilbuild/developer-roadmap/readme （已抓取，逐条路线清单）；仓库结构说明：`roadmaps/<roadmap-slug>/content/<topic-slug>@<node-id>.md`
- **顶层主题（readme 原文列举，约 100 条，节选与本站强相关的）**：
  - 通用/工具：`Git and GitHub`、`Git and GitHub Beginner`、`Linux`、`Bash/Shell`、`Docker`、`Kubernetes`、`Terraform`、`Computer Science`、`Data Structures and Algorithms`、`Leetcode`、`System Design`、`Software Design and Architecture`、`Software Architect`、`QA`
  - 前后端：`Frontend / Frontend Beginner`、`Backend / Backend Beginner`、`Full Stack`、`HTML`、`CSS`、`JavaScript`、`TypeScript`、`React`、`Next.js`、`Vue`、`Angular`、`Node.js`、`API Design`、`GraphQL`、`Django`、`Spring Boot`
  - 数据：`SQL`、`PostgreSQL`、`MongoDB`、`Redis`、`Elasticsearch`、`Data Engineer`、`Machine Learning`、`MLOps`、`AI and Data Scientist`
  - 运维/安全：`DevOps / DevOps Beginner`、`DevSecOps`、`AWS`、`Cloudflare`、`Network Engineer`、`Cyber Security`、`AI Red Teaming`
  - AI 工程（2026 新增档位）：`AI Engineer`、`AI Agents`、`AI Product Builder`、`Prompt Engineering`、`Claude Code`、`Vibe Coding`、`Forward Deployed Engineer`
  - best practices（5 条）：`Backend Performance`、`Frontend Performance`、`Code Review`、`API Security`、`AWS`
  - questions：`JavaScript`、`Node.js`、`React`、`Backend`、`Frontend`
- **难度排序方式**：**每条路线内节点用连线表达前置关系**（DAG），另给 "beginner" 变体（如 `https://roadmap.sh/git-github?r=git-github-beginner`），并有独立 `get started` 推荐页。→ 「同一主题、两档密度」是它表达难度的方式，而不是给节点打 level。
- **信息架构要点**：
  - **节点即文章**：`roadmaps/<slug>/content/<topic>@<node>.md`，一个节点一篇短文，可被外部直接链接，也让「路线图」本身可 diff、可 PR。
  - 路线粒度极细（100 条），没有统一的一级主题表 → 检索优于导航；但也没有「该按什么顺序学几条路线」的总纲。
  - best practices / questions 是**与路线解耦的两条平行序列** → 可以直接对应本项目的 "concept vs practice" 双轨。

## 11. The System Design Primer（donnemartin）

- **是什么/谁办的**：个人维护的开源长文 + 面经集，CC BY 4.0；动机写得很直白：`Learn how to design large-scale systems.` / `Prep for the system design interview.`
- **URL**：https://api.github.com/repos/donnemartin/system-design-primer/readme （已抓取全文）
- **顶层主题（"Index of system design topics" 原文）**：Performance vs scalability、Latency vs throughput、Availability vs consistency（CAP：CP / AP）、Consistency patterns（weak / eventual / strong）、Availability patterns（fail-over / replication）、Domain name system、Content delivery network、Load balancer（active-passive、active-active、L4/L7、horizontal scaling）、Reverse proxy、Application layer（microservices、service discovery）、Database（RDBMS、master-slave / master-master replication、federation、sharding、denormalization、SQL tuning；NoSQL：key-value / document / wide column / graph；SQL or NoSQL）、Cache（client / CDN / web server / database / application、cache-aside / write-through / write-behind / refresh-ahead）、Asynchronism（message queues、task queues、back pressure）、Communication（TCP、UDP、RPC、REST）、Security、Appendix（powers of two、latency numbers、real world architectures、company architectures、company engineering blogs）。
- **难度/进度表达方式（很有参考价值）**：**按可投入时间给三档策略**：`Short timeline` 求 breadth、`Medium timeline` 兼顾 breadth 与部分 depth、`Long timeline` 更广更深；再加 Anki 记忆卡组与「带参考答案的面试题」。
- **信息架构要点**：单一超长 README + 目录锚点；**「核心概念 → 对比权衡 → 真实系统架构 → 面试题」**的四段式，几乎每个小节都配 "Source(s) and further reading"。有 `Under development` 区公开承认未完成部分（MapReduce、consistent hashing、scatter gather）。

## 12. Learn Vim (the Smart Way)

- **是什么/谁的**：Igor Irianto 的开源 Vim 书（CC BY-NC-SA），自我定位填在 vimtutor 和 `:help` 之间的空档：`the average user needs something more than vimtutor and less than the help manual`.
- **URL**：https://api.github.com/repos/iggredible/Learn-Vim/readme （已抓取目录）
- **顶层主题（三部分，Verified）**：
  - Part 1 Learn Vim the Smart Way（Ch1–Ch21）：Starting Vim、Buffers/Windows/Tabs、Opening and Searching Files、Vim Grammar、Moving in a File、Insert Mode、The Dot command、Registers、Macros、Undo、Visual Mode、Search and Substitute、The Global Command、External Commands、Command-line Mode、Tags、Fold、Git、Compile、Views/Sessions/Viminfo、Multiple File Operations
  - Part 2 Customize Vim the Smart Way（Ch22–Ch24）：Vimrc、Vim Packages、Vim Runtime
  - Part 3 Learn Vimscript the Smart Way（Ch25–Ch29）：Basic Data Types、Conditionals and Loops、Variable Scopes、Functions、Plugin Example: Writing a Titlecase Plugin
- **难度排序方式**：**显式三段式**：会用 → 能配置 → 能写插件（Ch29 以「写一个真插件」收束）。声明 `It starts out with broad and simple concepts and ends with specific and advanced concepts.`
- **信息架构要点**：每章 ≤1 个动作/概念（"The Dot command" 单独成章），章内必有可复现的按键序列；附带 Docker 本地阅读方式与官方中文翻译链接。→ 这是本次调研中**最干净的「概念→实操→跨方向扩展」三级样本**（用/配/写插件）。

## 13. Vim Adventures（只备注）

- **是什么**：商业付费在线游戏网站（`VIM Adventures is an online game based on VIM's keyboard shortcuts. It's the "Zelda meets text editing" game.`）。
- **URL**：https://vim-adventures.com/ （已抓取）
- **处理**：**不作为参考站点**（闭源、付费、无可复用的分类法）；仅在「编辑器学习资源」里作为外部趣味入口备查。

## 14. GitHub — Open Source Guides (opensource.guide)

- **是什么/谁办的**：GitHub 官方运营的开源实践指南站（Jekyll），仓库 `github/opensource.guide`；站点标语 `Learn how to launch and grow your project.`
- **URL**：https://opensource.guide/ 、文章清单：https://opensource.guide/sitemap.xml 、仓库：https://api.github.com/repos/github/opensource.guide/contents/_articles
- **顶层主题（13 篇英文文章，从 sitemap 提取的 slug，Verified）**：`starting-a-project`、`how-to-contribute`、`best-practices`、`building-community`、`finding-users`、`getting-paid`、`leadership-and-governance`、`legal`、`metrics`、`code-of-conduct`、`maintaining-balance-for-open-source-maintainers`、`security-best-practices-for-your-project`、`accessibility-best-practices-for-your-project`
- **难度排序方式**：无显式 level；但**文章本身即「角色阶段」**（刚起项目 → 参与别人项目 → 维护/治理 → 安全/无障碍等横切质量标准）。
- **信息架构要点**：
  - 多语言用 `/<lang>/` 路径（含 `zh-hans`、`zh-hant`），sitemap 里每篇 × 每语言一条 URL → 翻译是「同一 slug 的副本」，不改变主题树。
  - 这 13 篇正好构成「开源协作」这条主题的**完整主题树**，可直接映射到本站的协作 / 开源流程主题。

## 15. OSPO 101 Training Modules

- **是什么/谁办的**：面向「组织如何管理开源」的模块化课程材料（`OSPO 101 is a course on everything you need to know about open source program office management.`），页面来自 `digital-sustainability.github.io/module-eoss-ospo101`，作者侧关联 Linux Foundation（页内指向 `training.linuxfoundation.org/training/open-source-management-and-strategy/`）。搜索侧另有 TODO Group 的 `todogroup.org/resources/training/`（**Unverified**，本次未抓取）。
- **URL**：https://digital-sustainability.github.io/module-eoss-ospo101/ （已抓取）
- **顶层主题（7 个模块，Verified）**：
  1. Open Source Introduction
  2. Open Source Business Strategy
  3. Effective Open Source Program (OSPO) Management
  4. Open Source Development Practices
  5. Open Source Compliance Programs
  6. Collaborating Effectively with Open Source Projects
  7. Creating Open Source Projects
- **难度排序方式**：模块 1→7 = 从「认识开源」到「治理与合规」的组织成熟度递进；声明可拆分复用：`It is intended to be modularized so the content is reusable in a piecemeal fashion`
- **信息架构要点**：**每模块自带小节锚点**（`module1/#section-introducing-open-source`），一个 module 页 = 一节可单独引用的课；课程大纲与模块页同源（index 页重复列出 module + section 两级）。→ 启发：一个主题页内部再切「可被外链的小节」，比「长文」更好被引用。

## 16. OSSU — Open Source Society University (computer-science)

- **是什么/谁办的**：社区维护的「免费自学 CS 本科」课程表，`Path to a free self-taught education in Computer Science!`；课程选择标准写死为「开放注册 + 定期开课 + 教学质量 + 符合 CS2013 大纲」。
- **URL**：https://api.github.com/repos/ossu/computer-science/readme （已抓取全文）
- **顶层主题（Verified）**：
  - Intro CS
  - Core CS（全部必修）：Core programming、Core math、**CS Tools**、Core systems、Core theory、Core security、Core applications、Core ethics
  - Advanced CS（选修）：Advanced programming、Advanced systems、Advanced theory、Advanced Information Security、Advanced math
  - Final project
- **难度排序方式（本次调研里最完整的一种）**：
  - 明确的阶段划分与前置说明：`Intro CS` 试水 → `Core CS` 对应前三年必修 → `Advanced CS` 对应最后一年选修 → `Final project` 做作品并同行评审。
  - 每门课**逐行给 Duration / Effort / Prerequisites / Discussion**（例：Systematic Program Design | 13 weeks | 8-10 hours/week | none）。
  - 给「投入时间」做算术：`It is possible to finish within about 2 years if you plan carefully and devote roughly 20 hours/week`，并配 Google Sheet 估完工日期。
- **信息架构要点**：
  - **"CS Tools" 是一个独立必修模块**，其 `Topics covered` 原文是 `terminals and shell scripting / vim / command line environments / version control / and more`，模块下唯一课程就是 §1 的 Missing Semester。→ 这是「工具链」作为独立一级主题被录取的权威证据。
  - 每门课挂一个 Discord 频道（课程级社群），并把「进度看板」外包给 GitHub：`Fork the GitHub repo … and put ✅ next to the stuff you've completed`。
  - 专设 `extras/courses.md` / `extras/readings.md` 收纳「好但不进主线」的材料 → 与 §1 的 `/past/` 是同一手法：**主线收敛，课外另设容器**。

## 17. LangChain — LangGraph 101

- **是什么/谁办的**：LangChain 官方教程仓库（`langchain-ai/langgraph-101`），自我介绍为 `a condensed version of LangChain Academy`，用于工程师现场带教。
- **URL**：https://api.github.com/repos/langchain-ai/langgraph-101/contents/README.md （已抓取）
- **顶层主题（两轨 + agents 目录，Verified）**：
  - **101 — Fundamentals**（`notebooks/101/`）：`101_langchain_langgraph.ipynb`（models / tools / memory / streaming 建第一个 agent）、`102_middleware.ipynb`（middleware、human-in-the-loop、guardrails）
  - **201 — Production Patterns**（`notebooks/201/`）：`email_agent`（有状态邮件分诊）、`multi_agent`（supervisor + 子 agent）、`research_agent`（并行子研究员）、`deepagents`（AGENTS.md、skills、backends、长期记忆、HITL）
  - `agents/`：可直接 `langgraph dev` 起的独立 agent
- **难度排序方式**：**数字分级（101 / 201）**，且每级内部是「单个 notebook = 一个单元」；201 全部是「真实工作流」（分诊、并行研究、多 agent 协作）。
- **信息架构要点**：
  - **Pre-work 先于任何概念**：`git clone` → `.env.example` → `pip install uv` → `uv sync` → `langgraph dev`，并给「跑起来会看到 localhost 端口 + Studio UI」的预期 → 实践门槛被写进入口。
  - 概念层（notebook）与可运行层（`agents/`）分成目录，两边同一主题各一份实现，便于对照。
  - 明确承认工程难点：`In practice though, it is incredibly difficult to build systems that reliably execute on these tasks.`

## 18. The Odin Project — curriculum 仓库

- **是什么/谁办的**：全栈 Web 自学项目（The Odin Project）的课程内容仓库。
- **URL**：仓库顶层 tree：https://api.github.com/repos/TheOdinProject/curriculum/git/trees/main ；站点 `/paths` 页 title = `All Paths | The Odin Project`（抓取时正文由 JS 注入，未取到内容）
- **顶层主题（顶层目录，Verified）**：`foundations`、`intermediate_html_css`、`advanced_html_css`、`javascript`、`databases`、`git`、`nodeJS`、`react`、`ruby`、`ruby_on_rails`、`getting_hired`、`shared`、`templates`、`archive`
- **难度排序方式**：目录名直接编码难度前缀（`foundations` → `intermediate_*` → `advanced_*`），另外有 `archive`（归档旧内容，不删）。
- **信息架构要点**：`shared`、`templates`、`getting_hired` 与课程模块同级 → 「可复用片段」「模板」「求职」被当成一等公民目录；`git` 与 `databases` 独立成模块而不是塞进某个语言课（与 §16 的 "CS Tools" 同构）。

---

## 19. 综合：合并去重后的主题表（供本站 taxonomy 使用）

标注说明：**C** = 概念讲解层（beginner concept），**P** = 动手实践层（hands-on guide），**X** = 进阶/横切整合层（cross-cutting）。「覆盖来源」只列本次 **Verified** 的来源。

### A. 工具与工作流（工欲善其事）

| # | 主题 | 层次 | 覆盖来源 |
|---|---|---|---|
| A1 | Shell / 命令行环境 | C+P | MIT missing-semester（Command-line Environment）、USTC Linux 101（Ch1/Ch6/Ch9）、OSSU CS Tools（terminals and shell scripting）、roadmap.sh（shell-bash、linux）、csdiy（必学工具/workflow）、Odin（foundations） |
| A2 | 开发环境配置（含 WSL/包管理器） | C+P | MIT missing-semester（Development Environment and Tools）、USTC Linux 101（Ch2、附录 WSL）、csdiy（Scoop、tools）、roadmap.sh（linux） |
| A3 | 编辑器精通（Vim/Emacs/IDE） | C+P+X | Learn Vim the Smart Way（三部分：用→配→写插件）、csdiy（Vim、Emacs）、OSSU CS Tools（vim）、MIT missing-semester |
| A4 | 版本控制 Git | C+P | MIT missing-semester（Version Control and Git）、csdiy（Git）、roadmap.sh（git-github + beginner 变体）、Odin（git） |
| A5 | 构建系统与打包发布 | P+X | MIT missing-semester（Packaging and Shipping Code）、csdiy（CMake、GNU Make、Docker）、USTC Linux 101（Ch8 Docker）、roadmap.sh（docker） |
| A6 | 文本处理与正则 / 数据整理 | P | USTC Linux 101（Ch6、Ch9）、MIT missing-semester（2020 Data Wrangling） |
| A7 | 学术写作与信息检索（LaTeX / 论文 / 检索） | C+P | csdiy（LaTeX、thesis、信息检索）、opensource.guide（legal） |

### B. 语言与运行时

| # | 主题 | 层次 | 覆盖来源 |
|---|---|---|---|
| B1 | 编程入门与语言范式 | C | csdiy（编程入门、编程语言设计与分析）、OSSU（Intro CS、Core programming：functional/OO/static vs dynamic typing）、Odin（javascript、ruby） |
| B2 | 语言生态专项（语言/框架选型） | P | roadmap.sh（Python/Go/Rust/Java/JS/TS/Kotlin/Scala/PHP/Ruby 等）、Odin（react、nodeJS、ruby_on_rails）、csdiy（Web开发） |
| B3 | 依赖与环境隔离 | P | LangGraph 101（uv + .env + langgraph.json 工作流）、csdiy（Scoop）、USTC Linux 101（Ch8） |

### C. 系统与基础设施

| # | 主题 | 层次 | 覆盖来源 |
|---|---|---|---|
| C1 | 数据结构与算法 | C+P | csdiy（数据结构与算法）、OSSU（Core theory）、roadmap.sh（datastructures-and-algorithms、leetcode） |
| C2 | 计算机系统 / OS / 体系结构 / 编译 | C | csdiy（计算机系统基础、操作系统、体系结构、编译原理）、OSSU（Core systems、Advanced systems） |
| C3 | 计算机网络 | C+P | csdiy（计算机网络）、OSSU（Core systems: network protocols）、USTC Linux 101（Ch6）、roadmap.sh（network-engineer） |
| C4 | 数据库（SQL/NoSQL/缓存理论） | C+P | csdiy（数据库系统）、OSSU（Core applications: Databases ×3）、roadmap.sh（sql/postgresql/mongodb/redis/elasticsearch）、Odin（databases）、system-design-primer（Database、Cache 两章） |
| C5 | 后端与服务端 | P+X | roadmap.sh（backend、backend-beginner、api-design、graphql、django、spring-boot）、system-design-primer（Application layer、microservices）、Odin（nodeJS、ruby_on_rails）、OSSU（Core applications: REST） |
| C6 | 前端与 Web | P+X | Odin（foundations、intermediate_html_css、advanced_html_css、javascript、react）、roadmap.sh（frontend、html、css、react、nextjs、vue、angular）、csdiy（Web开发） |
| C7 | 部署、运维与云 | P+X | roadmap.sh（devops、devops-beginner、kubernetes、terraform、aws、cloudflare、linux）、USTC Linux 101（Ch4 服务与例行性任务、Ch8）、MIT missing-semester（Packaging and Shipping Code） |
| C8 | 测试与代码质量 | P | MIT missing-semester（Code Quality）、OSSU（Core programming: design for testing / unit testing）、roadmap.sh（qa、best-practices/code-review） |
| C9 | 调试与性能剖析 | P+X | MIT missing-semester（Debugging and Profiling）、OSSU（Advanced programming: Software Debugging）、roadmap.sh（best-practices/backend-performance、frontend-performance）、system-design-primer（Performance vs scalability、Latency vs throughput） |
| C10 | 安全（含 AI 安全） | X | csdiy（系统安全）、OSSU（Core security、Advanced Information Security）、roadmap.sh（cyber-security、devsecops、ai-red-teaming、best-practices/api-security）、opensource.guide（security-best-practices-for-your-project） |
| C11 | 系统设计与架构 | X | system-design-primer（全站）、roadmap.sh（system-design、software-architect、software-design-architecture）、OSSU（Advanced programming: large-scale software architecture） |
| C12 | 分布式与并行 | C+X | csdiy（并行与分布式系统、机器学习系统）、OSSU（Advanced theory: distributed shared memory / consensus / state machine replication） |
| C13 | 数据科学 / 机器学习 | C+P+X | csdiy（数据科学、机器学习、机器学习进阶、深度学习、深度生成模型）、OSSU（Core applications: ML/neural nets）、roadmap.sh（ai-data-scientist、machine-learning、mlops、data-engineer） |
| C14 | LLM Agent 与 AI 工具链 | P+X | MIT missing-semester 2026（Agentic Coding，且 AI 融入每讲）、roadmap.sh（ai-agents、ai-engineer、ai-product-builder、prompt-engineering、claude-code、vibe-coding）、LangGraph 101（101/201）、SJTUG 2026-09 workshop（Linux × Agent） |

### D. 协作、流程与「软件之外」

| # | 主题 | 层次 | 覆盖来源 |
|---|---|---|---|
| D1 | 开源协作流程（issue/PR/评审） | C+P | opensource.guide（how-to-contribute、best-practices、code-of-conduct）、OSPO 101（module4、module6）、csdiy（GitHub） |
| D2 | 开源项目从 0 到 1 与治理 | X | opensource.guide（starting-a-project、leadership-and-governance、building-community、metrics、finding-users、maintaining-balance）、OSPO 101（module3/5/7） |
| D3 | 读代码 / 读文档 / 读报错 | P | USTC Linux 101（附录 man 文档示例；每章「思考题解答」）、Learn Vim（External Commands、Tags）（本主题在已抓站点里普遍缺失，属需要本站自己补的项） |
| D4 | 许可、合规与知识产权 | C | opensource.guide（legal）、OSPO 101（module5）、OSSU（Core ethics: Intellectual Property、Privacy and Civil Liberties） |
| D5 | 工程伦理与职业素养 | X | MIT missing-semester（Beyond the Code）、OSSU（Core ethics）、opensource.guide（getting-paid） |
| D6 | 备份 / 自动化 / 机器自省 | P | MIT missing-semester 2019（Backups、Automation、Machine Introspection、OS Customization、Web and Browsers） |
| D7 | 学习路径与自我管理（元层） | X | OSSU（阶段 + 时长 + Sheet 估算 + fork 打勾看板）、csdiy（CS学习规划、使用指南）、roadmap.sh（get started）、system-design-primer（short/medium/long timeline 策略） |

**合并结论（一句话）**：三级结构（概念 / 实践 / 横切整合）在**单一站点里几乎不存在**；最接近的三个样本是 Learn Vim（用→配→写插件）、LangGraph 101（101→201→agents/）、OSSU（Intro→Core→Advanced→Final project），以及 MIT missing-semester 的「每年重排 + 旧版留档」机制。本站若真按「每方向三级」落库，属于**比现有参考站点更严格的结构**，需要自己发明表达方式（建议借鉴：Linux 101 的 正文/拓展/思考题 三件套 + roadmap.sh 的节点级 markdown + OSPO 101 的模块内锚点）。

---

## 20. 学生 101 站点里被过度使用的模式（避免清单）

以下每条都对应本次实际观察，不引二手评论：

1. **「链接清单化」替代内容生产**。csdiy 的每个主题页本质是课程/书单推荐（单文件 0.8–14 KB，正文多为外链），OSSU 每个主题下是课程表，roadmap.sh 一个节点是一段短文 —— 三者的价值都在**筛选与排序**而非讲解。若本站也要「内容 + 可运行实践」，不要只在每页堆外链。
2. **只有两个层次，没有第三层**。所有站点里，「概念解释」和「动手做」往往混在一页；能明确再上一层「跨主题整合 / 写插件 / 上生产」的只有 Learn Vim（Ch29 写 titlecase 插件）、LangGraph 101（201 = multi-agent/deep agent）、OSSU（Final project 要同行评审）。其余站点一到「做完一个 demo」就结束了。
3. **没有前置条件表达**。MIT missing-semester 用**日期**排序，Linux 101 用**章节编号**排序，csdiy 用目录名暗示；只有 OSSU 给每门课一行 `Prerequisites`。学生站点普遍默认「读者知道该从哪进」。
4. **入口页缺失或退化为目录**。csdiy 顶层 24 个目录平铺、无推荐顺序；ZJU-CSSU 与 TUNA 的入口是通知/服务；SJTUG 入口是文章流。明确写「学习者从哪开始」的只有 OSSU、roadmap.sh（`get started`）、system-design-primer（短/中/长三档策略）。
5. **活动产出不留存为可检索内容**。SJTUG、TUNA 的技术分享以活动/归档文章形式存在（抓到的历史条目跨度 2018–2026），没有可预期的课程目录；lug.org.cn 的高校社团列表页面**自身已标注 deprecated、最后修改 2021-03-03**。→ 站点若以「活动/公告」为主，半年后就不可用。
6. **纯前端 SPA 毁掉可引用性**。uestclug.org 的服务端 HTML 只有一个空 `<div id="app">`，`noscript` 明确写着要开 JS 才能看。→ 学生站必须 SSR/静态输出。
7. **版本堆积造成「该看哪一版」问题**。MIT missing-semester 保留 2019/2020/2026 三版并要求读者自己选最新；Odin 用 `archive/` 目录装旧内容；csdiy 每篇都是 `.md` + `.en.md` 双份。→ 版本化要有「主线只有一条 + 旧版明确标记为历史」的规则。
8. **用「面试准备」当唯一动机**。system-design-primer 明写 `Prep for the system design interview.`，developer-roadmap 有 `Leetcode Roadmap`、best practices 也偏面试。对一个「课堂教学不够用」的本科生社区站点，这是错位动机。
9. **AI 被当成新的一级目录或干脆缺席**。两个最成熟的站点走向相反：MIT 明确 `there is not a standalone AI lecture`，把 AI 折叠进每一讲；roadmap.sh 则一口气开了 6 条 AI 路线（ai-agents / ai-engineer / ai-product-builder / prompt-engineering / claude-code / vibe-coding），互相重叠。→ 本站需要显式决策「agent 是一级主题还是横切能力」，并避免开出 6 个重叠主题。
10. **中英双语靠整篇复制**。csdiy 用 `X.md` + `X.en.md` 同目录并列；opensource.guide 用 `/<lang>/` 副本；missing-semester 直接列 20 个外部翻译站并声明 `We have not vetted them`。→ 双语必然带来「内容漂移」，需要一条规则。

### 本站据此做的决定

- **agent 列为一级方向，但只有一格**（概念 / 实践 / 贯通各一条），不做成六条重叠路线；同时对其他方向保持「AI 是横切能力」的态度（见 §1 的做法）。
- **三层是真序列，所以用编号**（1.1 / 2.1 / 3.1…），并且每篇笔记显式声明所在方向与层——正面回应上面第 2、3 条。
- **入口页就是索引表**，不是目录平铺：每格要么是链接，要么是一条「想写」的题目——正面回应第 4 条。
- **不做活动公告流**：所有内容都必须落进某个方向的某一格，否则不进站——正面回应第 5 条。
- **静态输出**（Astro，`output` 默认 static）：正面回应第 6 条。
- **动机写「课上没讲的那一半」，不写面试**：正面回应第 8 条。

---

## 21. 附录：检索轨迹（可复现）

### 21.1 `web_search` 查询

1. `MIT The Missing Semester of Your CS Education`
2. `上海交通大学学生开源社团 社团 开源`
3. `浙江大学 学生开源社团 ZJU-CSSU`
4. `OSPO 101 open source program office university course material syllabus`
5. `LLM agent engineering guide github "agents 101" curriculum tool calling`

### 21.2 实际抓取成功的 URL（Verified 的事实来源）

**MIT / 课程类**
- `https://missing.csail.mit.edu/`（2026 syllabus、AI 折叠声明、翻译列表）
- `https://missing.csail.mit.edu/past/`（2026/2020/2019 三版 "self-contained" 说明）
- `https://api.github.com/repos/ossu/computer-science/readme`（OSSU 全文）

**中文高校/社团**
- `https://api.github.com/repos/PKUFlyingPig/cs-self-learning`（csdiy 元数据：76021 stars / 8005 forks / homepage csdiy.wiki）
- `https://api.github.com/repos/PKUFlyingPig/cs-self-learning/contents/docs`（25 个顶层主题目录）
- `https://api.github.com/repos/PKUFlyingPig/cs-self-learning/contents/docs/必学工具`（14 个工具主题、25 个文件）
- `https://101.lug.ustc.edu.cn/`、`https://101.ustclug.org/sitemap.xml`、`https://api.github.com/repos/ustclug/Linux101-docs/contents/docs`、`.../contents/mkdocs.yml`
- `https://sjtug.org/`（导航 + 2026-09-11 Linux × Agent workshop）
- `https://tuna.moe/`（TUNA 定位、服务列表、导航）
- `https://zju-cssu-dev.github.io/home/`、`https://api.github.com/repos/ZJU-CSSU-Dev/home/contents/mkdocs.yml`
- `https://lug.org.cn/doku.php?id=univercity-lugs`（高校开源社区列表，deprecated + 最后修改时间）
- `https://sjtu-src.github.io/Wiki/chapter_preface/`（SJTU-SRC RoboCup SSL 教培 wiki）
- `https://uestclug.org/`（确认 SPA / noscript 文案）

**社区工程路线与专题**
- `https://api.github.com/repos/kamranahmedse/developer-roadmap`（返回 `full_name = nilbuild/developer-roadmap`）
- `https://api.github.com/repos/nilbuild/developer-roadmap/contents/readme.md`（约 100 条路线清单 + 仓库结构约定）
- `https://api.github.com/repos/donnemartin/system-design-primer/readme`
- `https://api.github.com/repos/iggredible/Learn-Vim/readme`（Ch0–Ch29 目录）
- `https://vim-adventures.com/`（确认商业性质）
- `https://opensource.guide/`、`https://opensource.guide/sitemap.xml`（13 篇英文文章 slug + 30 余语言前缀）
- `https://api.github.com/repos/github/opensource.guide/contents/_articles`
- `https://digital-sustainability.github.io/module-eoss-ospo101/`（7 模块 + 小节锚点）
- `https://api.github.com/repos/langchain-ai/langgraph-101/contents/README.md`（101/201 双轨、agents/、pre-work 流程）
- `https://api.github.com/repos/TheOdinProject/curriculum/git/trees/main`、`https://www.theodinproject.com/paths`

### 21.3 尝试但失败 / 未核实的项

- **网络不可用**：`raw.githubusercontent.com`（多个候选文件的 `download_url` 都指向它）、`cdn.statically.io`、`raw.githack.com`；`Invoke-WebRequest` 在沙箱内 SSL 失败，因此所有抓取都走 `http_get` / `api.github.com`。
- **Unverified（不得当依据）**：
  - `todogroup.org/resources/training/`（TODO Group 培训目录）：只在搜索结果里出现，未抓取。
  - `https://sjtu-src.github.io` 团队与「上海交通大学学生开源社团」是否为同一实体：未核。
  - lug.org.cn 列表里的**哈工大 Linux 开源学生科创俱乐部、北邮 byrio、西电开源社区、上科大 GeekPie、兰大开源社区、西南大学开源社区**：本次均未单独抓取。
  - 浙江大学学生开源社团与「浙江大学计算机学院学生会」的关系：未核。
- **抓取到但内容不可用**：`https://www.theodinproject.com/paths`（JS 注入正文）、`https://uestclug.org/`（SPA）、`https://tuna.moe/`（首页为 Vue 组件渲染，仅取到静态导航与部分服务区块）。

---

## 22. 对本站 taxonomy 的落地结果

调研结论落到 `src/tracks.ts`：13 个方向分两组，每方向三层，未写的题目标成 `plan`。对应关系：

| 本站方向 | 主要来源（§19 编号） |
|---|---|
| 环境与命令行 | A1、A2 |
| Git | A4 |
| GitHub 与协作 | D1、A4 |
| 编辑器与 Vim | A3 |
| 后端 | C5 |
| 前端 | C6 |
| 数据库 | C4 |
| 部署与运维 | C7、A5 |
| 测试与调试 | C8、C9 |
| Agent 与 LLM 工具链 | C14（刻意收敛为一条方向，见 §20.9） |
| 计算机基础 | C1、C2、C3 |
| 硬件与嵌入式 | 本次调研未覆盖（参考站点的空白区），按同样的三层写 |
| 学习方法 | D7 |

`plan` 里每一条「想写」的题目，都能在上述来源里找到对应主题；本站**不写**的：C11 系统设计（偏面试，见 §20.8）、C12 分布式并行、C13 机器学习（课程覆盖，且与「工程开发那一半」的定位不符）。

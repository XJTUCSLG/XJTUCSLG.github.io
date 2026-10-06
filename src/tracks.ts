/**
 * 站点的两根轴：方向（track）× 层次（stage）。
 *
 * 这里只有数据，不依赖 Astro —— content.config.ts 的 schema、页面、RSS 都从这里取，
 * 想加一个方向或改一句说明，改这一个文件即可。
 */

/** 三层：概念 → 实践 → 贯通。顺序就是学习的顺序，页面上的编号是真的。 */
export const STAGE_IDS = ['concept', 'practice', 'integration'] as const;

export type Stage = (typeof STAGE_IDS)[number];

/** 每层在计划表里都必须有键，哪怕是空数组：索引表会按层取值 */
export type Plan = Record<Stage, PlanItem[]>;

export interface StageMeta {
  name: string;
  /** 这一层回答什么问题，列表页和方向页都会显示 */
  blurb: string;
}

export const STAGES: Record<Stage, StageMeta> = {
  concept: {
    name: '概念',
    blurb: '先讲清它在解决什么问题。命令、API、术语都放在这之后。',
  },
  practice: {
    name: '实践',
    blurb: '照着做能跑起来：步骤、命令、报错、版本写全，不省略关键的一步。',
  },
  integration: {
    name: '贯通',
    blurb: '和其他方向连起来用，接近一个真实项目里的样子，包括取舍。',
  },
};

/** 层次在页面上的位置（1 / 2 / 3），用于编号与排序 */
export function stageOrder(stage: Stage): number {
  return STAGE_IDS.indexOf(stage) + 1;
}

/** 分组：工程这一侧是我们真正想写的；基础那一侧是课程会讲、但用法要补的。 */
export const GROUPS = {
  engineering: {
    name: '工程开发',
    blurb: '课堂基本不讲，但写项目每天都在用。',
  },
  foundation: {
    name: '基础与学习',
    blurb: '课程会讲原理，这里补的是它在真实代码里的用法和代价。',
  },
} as const;

export type GroupId = keyof typeof GROUPS;

/** 计划中但还没写的条目 */
export interface PlanItem {
  title: string;
  /** 可选的一句说明：这篇打算写成什么样 */
  note?: string;
}

export interface Track {
  slug: string;
  /** 显示名，尽量用大家平时怎么念就怎么写 */
  name: string;
  group: GroupId;
  /** 一句话：这个方向是什么 */
  blurb: string;
  /** 课上讲到哪、这里补什么（首页与方向页都用得到） */
  why: string;
  plan: Plan;
}

export const TRACKS: Track[] = [
  {
    slug: 'env',
    name: '环境与命令行',
    group: 'engineering',
    blurb: '系统、终端、包管理器、编辑器。所有方向的前置。',
    why: '课上直接给虚拟机或机房机器。自己那台电脑上「命令找不到」「装在哪」这些事，没人讲过。',
    plan: {
      concept: [],
      // 实践层已经有两篇（环境搭建、dotfiles 第一版），还能继续往下写
      practice: [
        {
          title: '包管理器与版本管理：把「装了什么」也管起来',
          note: 'brew bundle / apt-mark showmanual，让重装机器变成一条命令。',
        },
      ],
      integration: [
        {
          title: '一台新机器，半小时恢复到能干活',
          note: '把 dotfiles、包清单、编辑器配置放进版本控制。',
        },
      ],
    },
  },
  {
    slug: 'git',
    name: 'Git',
    group: 'engineering',
    blurb: '提交是快照，分支是指针。先把心智模型立对，命令才查得动。',
    why: '课上讲完 commit 和 push 就考试了。rebase 做错、想撤销一次合并，这些要自己踩。',
    plan: {
      concept: [],
      practice: [
        {
          title: 'rebase、cherry-pick 与各种后悔药',
          note: '按「我现在想干什么」查，不按命令字母表排。',
        },
      ],
      integration: [
        {
          title: '团队里什么时候该开分支',
          note: '分支模型由 review 与发布节奏决定。',
        },
      ],
    },
  },
  {
    slug: 'github',
    name: 'GitHub 与协作',
    group: 'engineering',
    blurb: 'issue、PR 和 CI，一个项目公开协作时用到的全部环节。',
    why: '课设是一个人交代码。真实项目里，代码要先被讨论、被 review、被流水线检查。',
    plan: {
      concept: [
        {
          title: 'issue、PR、CI 各自解决什么问题',
          note: '三者各自对应一种具体的协作失败。',
        },
      ],
      practice: [],
      integration: [
        {
          title: '给一个不认识的项目提 PR',
          note: '从读 CONTRIBUTING 开始，到 CI 红了怎么自己查。',
        },
      ],
    },
  },
  {
    slug: 'editor',
    name: '编辑器与 Vim',
    group: 'engineering',
    blurb: '文本编辑是最高频的动作，值得单独优化。',
    why: '课上用老师指定的 IDE。换一台机器、进一个容器、连一台服务器，就得回到键盘本身。',
    plan: {
      concept: [
        {
          title: 'Vim 的语法：动词加范围',
          note: 'd2w、ci" 这类组合是可推导的，背命令表是走错了路。',
        },
      ],
      practice: [
        {
          title: '把编辑器配成自己的',
          note: '补全、格式化、跳转、调试，一样一样加上去，并知道各自在花什么代价。',
        },
      ],
      integration: [
        {
          title: '远程机器上没有 IDE 时怎么干活',
          note: 'ssh、tmux、容器里的编辑器，以及什么时候该放弃本地图形界面。',
        },
      ],
    },
  },
  {
    slug: 'backend',
    name: '后端',
    group: 'engineering',
    blurb: '请求进来、数据出去，中间那些不那么光鲜的部分。',
    why: '课上有 Web 开发，但通常停在「框架能跑」。配置、日志、错误处理、并发，都是工作里才补的。',
    plan: {
      concept: [
        { title: '一次 HTTP 请求经过了什么', note: '从 DNS 到 handler，中间每一步都可能出问题。' },
      ],
      practice: [
        {
          title: '写一个小服务：路由、配置、日志、错误处理',
          note: '功能只有两个接口，但四件工程上的事都要做对。',
        },
      ],
      integration: [
        { title: '数据库、缓存、部署串成一条线', note: '把前面几个方向的结果拼起来，看瓶颈出现在哪。' },
      ],
    },
  },
  {
    slug: 'frontend',
    name: '前端',
    group: 'engineering',
    blurb: '浏览器里发生的事：渲染、状态、交互。',
    why: '课上教框架语法，但真正的难点是状态放哪、请求失败了显示什么、键盘能不能用。',
    plan: {
      concept: [
        { title: '浏览器在渲染什么：DOM、样式、事件', note: '先有模型，再谈框架解决的那部分问题。' },
      ],
      practice: [
        { title: '不用框架先写一个表单', note: '校验、提交中、失败重试、重复提交，这些框架不会替你决定。' },
      ],
      integration: [
        { title: '组件边界、请求状态与可访问性', note: '把「能跑」推到「别人能用」。' },
      ],
    },
  },
  {
    slug: 'database',
    name: '数据库',
    group: 'engineering',
    blurb: '表结构、查询和索引。数据是项目里活得最久的部分。',
    why: '课上有数据库原理和 SQL 练习。真项目里没人给你现成的表结构，改起来还要考虑迁移。',
    plan: {
      concept: [
        { title: '关系模型与 SQL 到底在做什么', note: '把「写 SQL」和「数据库在执行什么」对上。' },
      ],
      practice: [
        { title: '给一个小项目设计表结构并写迁移', note: '包含一次真实的字段变更，以及怎么不弄丢数据。' },
      ],
      integration: [{ title: '慢查询定位与索引取舍', note: '从日志到执行计划，索引不是越多越好。' }],
    },
  },
  {
    slug: 'deploy',
    name: '部署与运维',
    group: 'engineering',
    blurb: '让代码在别人的机器上一直跑着。',
    why: '课程作业跑在自己电脑上就算完成。上线之后的进程、域名、证书和备份，全在课外。',
    plan: {
      concept: [
        { title: '服务器上跑起来需要哪些东西', note: '进程、端口、环境变量、反向代理，一次讲清。' },
      ],
      practice: [{ title: '从 push 到线上：一条 CI/CD 流水线', note: '用本站自己的部署做例子。' }],
      integration: [{ title: '日志、监控与一次故障复盘', note: '出事时该看什么，事后该留下什么。' }],
    },
  },
  {
    slug: 'test',
    name: '测试与调试',
    group: 'engineering',
    blurb: '相信自己的代码之前，得先有一套办法验证它。',
    why: '课上靠评测机判对错。自己写项目时没有评测机，只能自己造证据。',
    plan: {
      concept: [{ title: '测试在防什么：回归、契约与信心', note: '避免为了覆盖率写测试。' }],
      practice: [
        { title: '单元测试与断点调试的日常用法', note: '从一次真实的报错开始，两条路各走一遍。' },
      ],
      integration: [
        { title: '复现一个线上 bug：日志、二分与最小复现', note: '把「复现不了」变成能复现。' },
      ],
    },
  },
  {
    slug: 'agent',
    name: 'Agent 与 LLM 工具链',
    group: 'engineering',
    blurb: '把模型接进工程流程，不止停在聊天框里。',
    why: '这门课还没有教材。但它是这两年新出现的、最像「工程问题」的一类问题：不确定性、成本、权限。',
    plan: {
      concept: [
        { title: 'LLM 应用里哪些部分还不靠谱', note: '先把概率性组件放进系统里会发生什么讲清楚。' },
      ],
      practice: [
        { title: '写一个会调工具的 agent', note: '提示、重试、超时、成本，一个都不能省。' },
      ],
      integration: [
        { title: '把 agent 放进工程流：评测、权限与审计', note: '怎么知道它变好了，怎么知道它没乱来。' },
      ],
    },
  },
  {
    slug: 'cs',
    name: '计算机基础',
    group: 'foundation',
    blurb: '数据结构、复杂度和内存。课程会讲原理，这里讲它们在项目里的用法。',
    why: '原理课给的是分析工具。真写代码时，它是「这么存合不合适」的判断依据。',
    plan: {
      concept: [],
      practice: [{ title: '数据结构怎么选：几个真实场景', note: '从需求倒推结构，而不是从课本倒推。' }],
      integration: [{ title: '内存、缓存与一次真实的性能优化', note: '先测量，再动手。' }],
    },
  },
  {
    slug: 'learning',
    name: '学习方法',
    group: 'foundation',
    blurb: '没人再帮你排进度之后，怎么自己安排。',
    why: '大学和高中最大的差别在这里。它不考试，但决定其余的效率。',
    plan: {
      concept: [],
      practice: [{ title: '给自己排一条学习路线并验收', note: '排完之后怎么知道自己真的学到了。' }],
      integration: [{ title: '用项目驱动学习', note: '做一个会被别人用的东西，是最快的反馈来源。' }],
    },
  },
];

/** schema 用：把方向 slug 收成字面量元组，frontmatter 写错会在 dev / build 时报错 */
export const TRACK_SLUGS = [
  'env',
  'git',
  'github',
  'editor',
  'backend',
  'frontend',
  'database',
  'deploy',
  'test',
  'agent',
  'cs',
  'learning',
] as const;

const TRACK_BY_SLUG = new Map(TRACKS.map((track) => [track.slug, track]));

export function findTrack(slug: string): Track {
  const track = TRACK_BY_SLUG.get(slug);
  if (!track) throw new Error(`未知方向：${slug}`);
  return track;
}

/** 按分组排列的方向，首页与方向索引页共用 */
export function tracksByGroup(): { id: GroupId; name: string; blurb: string; tracks: Track[] }[] {
  return (Object.keys(GROUPS) as GroupId[]).map((id) => ({
    id,
    ...GROUPS[id],
    tracks: TRACKS.filter((track) => track.group === id),
  }));
}

/** 计划中的条目总数，用于首页的一句话统计 */
export function plannedCount(): number {
  return TRACKS.reduce(
    (sum, track) => sum + STAGE_IDS.reduce((n, stage) => n + track.plan[stage].length, 0),
    0,
  );
}

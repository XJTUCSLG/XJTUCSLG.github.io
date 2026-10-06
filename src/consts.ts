/**
 * 站点信息与全局常量。
 * 链接、栏目都收在这里，改文案不用翻页面。
 */

export const SITE = {
  /** 站点名，出现在 <title>、页头、RSS */
  name: 'XJTUCSLG 101',
  /** 一句话说明，用于 SEO 与分享卡片 */
  description:
    '西交大学生开源社区（非官方）写的工程笔记：命令行、Git、后端、前端、部署这些课上少讲、写项目却天天用的东西。',
  url: 'https://xjtucslg.github.io',
  lang: 'zh-CN',
  /** 版权行旁边的说明 */
  tagline: '由社区同学维护，非官方组织。',
} as const;

/** 随笔的栏目。列表页按它分组，顺序就是这里的顺序。 */
export const ESSAY_TOPICS = ['求学', '生活', '心态', '杂谈'] as const;

export const LINKS = {
  github: 'https://github.com/XJTUCSLG',
  repo: 'https://github.com/XJTUCSLG/XJTUCSLG.github.io',
  issues: 'https://github.com/XJTUCSLG/XJTUCSLG.github.io/issues',
  newIssue: 'https://github.com/XJTUCSLG/XJTUCSLG.github.io/issues/new',
  rss: '/rss.xml',
} as const;

/** 页头导航 */
export const NAV = [
  { href: '/tracks/', label: '方向' },
  { href: '/blog/', label: '笔记' },
  { href: '/essays/', label: '随笔' },
  { href: '/roadmap/', label: '怎么读' },
  { href: '/about/', label: '关于' },
] as const;

/** 页脚栏目 */
export const FOOTER_GROUPS = [
  {
    title: '方向',
    links: [
      { href: '/tracks/env/', label: '环境与命令行', external: false },
      { href: '/tracks/git/', label: 'Git', external: false },
      { href: '/tracks/backend/', label: '后端', external: false },
      { href: '/tracks/agent/', label: 'Agent 与 LLM 工具链', external: false },
      { href: '/tracks/', label: '全部方向', external: false },
    ],
  },
  {
    title: '读点什么',
    links: [
      { href: '/roadmap/', label: '怎么读这个站', external: false },
      { href: '/blog/', label: '全部笔记', external: false },
      { href: '/essays/', label: '随笔', external: false },
      { href: LINKS.rss, label: 'RSS 订阅', external: false },
    ],
  },
  {
    title: '参与',
    links: [
      { href: LINKS.github, label: 'GitHub 组织', external: true },
      { href: LINKS.issues, label: '未完成的题目', external: true },
      { href: LINKS.newIssue, label: '认领一个方向', external: true },
      { href: '/about/#write', label: '写作规范', external: false },
    ],
  },
] as const;

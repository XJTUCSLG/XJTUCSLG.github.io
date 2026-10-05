import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { STAGE_IDS, TRACK_SLUGS } from './tracks';
import { ESSAY_TOPICS } from './consts';

/**
 * 工程笔记集合。
 * frontmatter 由这里的 schema 校验，字段写错会在 dev / build 时直接报错。
 *
 * 两根轴：track（方向）+ stage（层）。方向必须在 src/tracks.ts 里登记过，
 * 这样「方向 × 三层」的目录不会出现孤儿条目。
 *
 * 一格（track + stage）里可以放任意多篇：编号 1.1 / 1.2 由 src/lib/posts.ts 自动算，
 * 默认按日期排，需要插队时用 order。
 */
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /** 发布日期，写成 '2026-03-01' 也会被转成 Date */
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    /** 作者，可以多个 */
    authors: z.array(z.string()).default([]),
    /** 方向：取值见 src/tracks.ts */
    track: z.enum(TRACK_SLUGS),
    /** 层：概念 → 实践 → 贯通 */
    stage: z.enum(STAGE_IDS),
    /**
     * 同一格内的阅读顺序。不写就按 pubDate 排（早的在前，也就是先写的先读）。
     * 想把新写的一篇放到前面，给它一个比同格其它篇更小的 order。
     */
    order: z.number().optional(),
    /** 前置笔记的 id，例如 ['git-github-workflow']，会显示在文章开头 */
    prereq: z.array(z.string()).default([]),
    /** 跨方向的标签，用于相关推荐；方向与层不算标签 */
    tags: z.array(z.string()).default([]),
    /** 预计阅读时长（分钟），不写就按正文字数估算 */
    minutes: z.number().int().positive().optional(),
    /** 草稿：dev 可见，生产构建剔除 */
    draft: z.boolean().default(false),
    /** 「怎么读这个站」里推荐先读的几篇 */
    featured: z.boolean().default(false),
  }),
});

/**
 * 随笔：工程之外的那部分自由空间。
 * 不参与「方向 × 三层」的目录，按 topic（栏目）分组展示。
 */
const essays = defineCollection({
  loader: glob({ base: './src/content/essays', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    authors: z.array(z.string()).default([]),
    /** 栏目：列表页按它分组，取值见 src/consts.ts */
    topic: z.enum(ESSAY_TOPICS),
    /** 自由标签，例如 ['选课', '保研'] */
    tags: z.array(z.string()).default([]),
    minutes: z.number().int().positive().optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog, essays };

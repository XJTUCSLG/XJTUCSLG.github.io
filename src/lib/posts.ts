import { getCollection, type CollectionEntry } from 'astro:content';
import { byNewest, bySeriesOrder, readingMinutes } from './format';
import {
  findTrack,
  STAGE_IDS,
  stageOrder,
  TRACKS,
  type Stage,
  type Track,
} from '../tracks';

export type Post = CollectionEntry<'blog'>;

/** 页面渲染一篇笔记需要的派生信息 */
export interface PostView {
  post: Post;
  href: string;
  minutes: number;
  track: Track;
  stage: Stage;
  /** 方向内的编号，如 '1.1'：层序号 . 同层内序号 */
  code: string;
  /** 跨方向标签 */
  topics: string[];
}

/**
 * 取笔记列表（新的在前）。
 * 生产构建丢掉 draft；dev 保留，方便边写边看。
 */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) =>
    import.meta.env.PROD ? data.draft !== true : true,
  );
  return posts.sort(byNewest);
}

/**
 * 给每篇算编号。
 *
 * 一格（方向 + 层）里可以放很多篇，编号是 层序号 . 本格内序号。
 * 同格内的顺序：先看 order（手写的插队号），没写的按 pubDate 从早到晚——
 * 也就是「先写的先读」，新加的一篇自然接在末尾。
 */
function assignCodes(posts: Post[]): Map<string, string> {
  const counters = new Map<string, number>();
  const codes = new Map<string, string>();

  for (const post of [...posts].sort(bySeriesOrder)) {
    const key = `${post.data.track}:${post.data.stage}`;
    const index = (counters.get(key) ?? 0) + 1;
    counters.set(key, index);
    codes.set(post.id, `${stageOrder(post.data.stage)}.${index}`);
  }

  return codes;
}

/** 把 collection entry 包成页面好用的视图对象 */
export function toView(post: Post, code = ''): PostView {
  return {
    post,
    href: `/blog/${post.id}/`,
    minutes: post.data.minutes ?? readingMinutes(post.body),
    track: findTrack(post.data.track),
    stage: post.data.stage,
    code,
    topics: post.data.tags,
  };
}

export async function getPostViews(): Promise<PostView[]> {
  const posts = await getPosts();
  const codes = assignCodes(posts);
  return posts.map((post) => toView(post, codes.get(post.id) ?? ''));
}

/** 一个方向的三层：每格里已有的笔记，加上计划中还没写的条目 */
export interface TrackCoverage {
  track: Track;
  cells: Record<Stage, PostView[]>;
  written: number;
  planned: number;
}

export function emptyCells(): Record<Stage, PostView[]> {
  return { concept: [], practice: [], integration: [] };
}

export function coverageOf(track: Track, views: PostView[]): TrackCoverage {
  const cells = emptyCells();
  for (const view of views) {
    if (view.post.data.track === track.slug) cells[view.stage].push(view);
  }
  for (const stage of STAGE_IDS) cells[stage].sort((a, b) => a.code.localeCompare(b.code));

  const planned = STAGE_IDS.reduce((n, stage) => n + track.plan[stage].length, 0);

  return {
    track,
    cells,
    written: cells.concept.length + cells.practice.length + cells.integration.length,
    planned,
  };
}

/** 全部方向，按 src/tracks.ts 里登记的顺序 */
export function coverageAll(views: PostView[]): TrackCoverage[] {
  return TRACKS.map((track) => coverageOf(track, views));
}

/** 一个方向内按阅读顺序排好的笔记：先概念、再实践、最后贯通，格内按编号 */
export function sequenceInTrack(track: Track, views: PostView[]): PostView[] {
  return views
    .filter((view) => view.post.data.track === track.slug)
    .sort((a, b) => a.code.localeCompare(b.code));
}

/** 上一篇 / 下一篇（同一个方向内，跨层连续） */
export function neighbours(
  view: PostView,
  views: PostView[],
): { prev?: PostView; next?: PostView } {
  const sequence = sequenceInTrack(view.track, views);
  const index = sequence.findIndex((item) => item.post.id === view.post.id);
  if (index < 0) return {};
  return { prev: sequence[index - 1], next: sequence[index + 1] };
}

/** 前置笔记：写成 id 数组，页面里换成链接 */
export function prereqsOf(view: PostView, views: PostView[]): PostView[] {
  return view.post.data.prereq
    .map((id) => views.find((item) => item.post.id === id))
    .filter((item): item is PostView => Boolean(item));
}

/** 相关推荐：先看共同标签数量，跨方向的排在前面（那是「贯通」的意思） */
export function relatedPosts(view: PostView, views: PostView[], limit = 3): PostView[] {
  const topics = new Set(view.topics);
  return views
    .filter((item) => item.post.id !== view.post.id)
    .map((item) => ({
      item,
      shared: item.topics.filter((tag) => topics.has(tag)).length,
      sameTrack: item.post.data.track === view.post.data.track ? 1 : 0,
    }))
    .sort(
      (a, b) =>
        b.shared - a.shared ||
        a.sameTrack - b.sameTrack ||
        byNewest(a.item.post, b.item.post),
    )
    .slice(0, limit)
    .map((entry) => entry.item);
}

/** 跨方向标签统计，列表页筛选用 */
export function collectTopics(views: PostView[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const view of views) {
    for (const tag of view.topics) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'zh-CN'));
}

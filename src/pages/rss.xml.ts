import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '../consts';
import { getPostViews } from '../lib/posts';
import { getEssayViews } from '../lib/essays';
import { STAGES } from '../tracks';

/** 一个订阅源里同时收工程笔记和随笔，各自带一个栏目分类，订阅端能看出来。 */
export async function GET(context: APIContext) {
  const posts = await getPostViews();
  const essays = await getEssayViews();

  const items = [
    ...posts.map((view) => ({
      title: view.post.data.title,
      description: view.post.data.description,
      pubDate: view.post.data.pubDate,
      link: view.href,
      // 分类里带上方向与层次，订阅端也能看出这篇在讲什么、讲到哪一层
      categories: [view.track.name, STAGES[view.stage].name, ...view.post.data.tags],
      author: view.post.data.authors.join('、') || undefined,
    })),
    ...essays.map((view) => ({
      title: view.essay.data.title,
      description: view.essay.data.description,
      pubDate: view.essay.data.pubDate,
      link: view.href,
      categories: ['随笔', view.essay.data.topic, ...view.essay.data.tags],
      author: view.essay.data.authors.join('、') || undefined,
    })),
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: SITE.name,
    description: SITE.description,
    // rss 需要一个不带末尾斜杠的站点地址
    site: context.site ?? SITE.url,
    items,
    customData: `<language>${SITE.lang}</language>`,
  });
}

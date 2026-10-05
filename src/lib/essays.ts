import { getCollection, type CollectionEntry } from 'astro:content';
import { byNewest, readingMinutes } from './format';

export type Essay = CollectionEntry<'essays'>;

export interface EssayView {
  essay: Essay;
  href: string;
  minutes: number;
}

export async function getEssays(): Promise<Essay[]> {
  const essays = await getCollection('essays', ({ data }) =>
    import.meta.env.PROD ? data.draft !== true : true,
  );
  return essays.sort(byNewest);
}

export async function getEssayViews(): Promise<EssayView[]> {
  return (await getEssays()).map((essay) => ({
    essay,
    href: `/essays/${essay.id}/`,
    minutes: essay.data.minutes ?? readingMinutes(essay.body),
  }));
}

/** 按栏目分组；空栏目不出现。顺序跟着 content.config.ts 里的 ESSAY_TOPICS */
export function groupByTopic(
  views: EssayView[],
  topics: readonly string[],
): { topic: string; views: EssayView[] }[] {
  return topics
    .map((topic) => ({ topic, views: views.filter((view) => view.essay.data.topic === topic) }))
    .filter((group) => group.views.length > 0);
}

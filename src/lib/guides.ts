import { getCollection, type CollectionEntry } from 'astro:content';

export type Guide = CollectionEntry<'guides'>;

/** 独立查询：不进入工程笔记的编号、相关推荐或 RSS。 */
export async function getGuides(): Promise<Guide[]> {
  return getCollection('guides', ({ data }) =>
    import.meta.env.PROD ? data.draft !== true : true,
  );
}

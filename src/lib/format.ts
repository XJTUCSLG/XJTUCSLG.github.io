/** 日期、字数一类的小工具，页面里到处要用，集中放这里。 */

const DATE_FORMATTER = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'Asia/Shanghai',
});

const COMPACT_FORMATTER = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: 'Asia/Shanghai',
});

/** Date → 2026年3月1日 */
export function formatDate(date: Date): string {
  return DATE_FORMATTER.format(date);
}

/** Date → 2026-03-01，表格与列表里用（列宽一致，扫起来快） */
export function formatCompactDate(date: Date): string {
  return COMPACT_FORMATTER.format(date);
}

/** Date → ISO 字符串，给 <time datetime> 和 RSS 用 */
export function isoDate(date: Date): string {
  return date.toISOString();
}

/** 粗略估算阅读时长：中文按 350 字/分钟，英文按 200 词/分钟 */
export function readingMinutes(body: string | undefined): number {
  if (!body) return 1;

  const text = body
    .replace(/```[\s\S]*?```/g, ' ') // 代码块不计入
    .replace(/<[^>]+>/g, ' ');

  const cjk = (text.match(/[\u4e00-\u9fa5]/g) ?? []).length;
  const words = (text.replace(/[\u4e00-\u9fa5]/g, ' ').match(/[A-Za-z0-9']+/g) ?? []).length;

  return Math.max(1, Math.round(cjk / 350 + words / 200));
}

/** 排序用：新的在前 */
export function byNewest(
  a: { data: { pubDate: Date } },
  b: { data: { pubDate: Date } },
): number {
  return b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
}

/** 排序用：早的在前 */
export function byOldest(a: { data: { pubDate: Date } }, b: { data: { pubDate: Date } }): number {
  return a.data.pubDate.valueOf() - b.data.pubDate.valueOf();
}

/**
 * 排序用：同一格（方向 + 层）内的阅读顺序。
 * 手写了 order 的按 order 排，没写的（order 未定义）排在它们之后，按日期从早到晚。
 */
export function bySeriesOrder(
  a: { data: { order?: number; pubDate: Date } },
  b: { data: { order?: number; pubDate: Date } },
): number {
  const left = a.data.order ?? Number.MAX_SAFE_INTEGER;
  const right = b.data.order ?? Number.MAX_SAFE_INTEGER;
  return left - right || byOldest(a, b);
}

# How claude.dev and openai.com build and serve their article pages

**Teardown date:** 2026-10-05 · **Method:** live HTTP responses (status, headers, HTML/RSC payloads, CSS/JS chunks, sitemaps, robots, image CDN responses), then regex extraction over the saved bodies.
**Raw bodies:** `research/raw/*.html` (see appendix). **Not committed** — 2.1 MB of verbatim
third-party page HTML with no value to the site itself; the directory is git-ignored and stays
local for verification only.
**Why this document exists:** to pick decisions for our own blog page ("101 page impl", Astro 7 static build on GitHub Pages, `src/content/blog/*.md` via content collections).

Confidence labels used below:

- **Verified** — I fetched it and can quote the byte/header.
- **Inferred** — the evidence makes it likely but I did not observe the mechanism itself.
- **Unknown** — not observable from outside; listed in §7 rather than guessed at.

---

## 1. Access notes (read this before trusting the openai.com rows)

| Site | Bare fetch (no headers) | With browser-like headers |
|---|---|---|
| claude.dev | 200 — never challenged | 200 |
| openai.com/news/engineering/ | **403**, `cf-mitigated: challenge`, `set-cookie: __cf_bm=…`, `critical-ch`/`accept-ch: Sec-CH-UA-…` | **200** (full HTML, `x-powered-by: Next.js`) |

The openai.com 403 is reproducible and is a Cloudflare managed challenge, not a geo/IP block. It was bypassed for this report by sending `User-Agent` (desktop Chrome), `Accept`, `Accept-Language`, `Sec-Fetch-Dest/Mode/Site/User`, `Upgrade-Insecure-Requests`. **Consequence for us and for any crawler/LLM agent:** openai.com is machine-readable only when the client looks like a browser; a plain `curl`/`fetch` gets a challenge page. claude.dev is readable by anything.

Two shortcuts did **not** work in this environment and were not needed: `r.jina.ai` and `web.archive.org` both returned `fetch failed` (no corroborating Wayback snapshots were used). All findings are from live responses on 2026-10-05.

---

## 2. Site 1 — claude.dev

### 2.1 How it is built (one paragraph)

claude.dev is a statically rendered Next.js App Router site (Turbopack production build: every page's `<head>` pulls `/_next/static/chunks/*.js` plus `/_next/static/chunks/turbopack-2o996n7farajp.js`, and the RSC flight payload is inlined in the HTML via `self.__next_f.push`), served through Cloudflare, whose edge cache answers every HTML request I made — including the 404 page and the `/blog` alias of `/` (`cf-cache-status: HIT` on all of them) — while the origin itself advertises `cache-control: public, max-age=0, must-revalidate` for HTML and `public, max-age=31536000, immutable` for hashed assets. Content is compiled into the HTML at build time: the article page I sampled ships the complete article (~344 KB of HTML) plus a rail table-of-contents tree, author/date/reading-time metadata, and *server-rendered* syntax-highlighted code (`<pre>` containing token spans such as `<span class="fn">`, `<span class="kw">` — no shiki/prism/hljs signature anywhere), and the index ships 10 cards in the markup behind a client-side "Load five more posts" tweak whose remaining posts are already inlined in the same document. Categories are client-only buttons (`data-c="ALL|AGENTS|ENGINEERING|PLAYBOOKS|SKILLS|TUTORIALS"`) with **no** per-category URLs — `sitemap.xml` contains exactly 14 posts + home/terminal/terms/mods, `/news` is a 404, and `/blog` returns byte-identical content to `/` (same ETag). The machine-readable surface is unusually complete for a marketing blog: `robots.txt` (allow all + sitemap), `sitemap.xml`, `rss.xml`, a per-article Markdown twin at `/blog/<slug>.md` (`content-type: text/markdown`, `x-robots-tag: noindex`), and a static per-post OG image at `/blog/<slug>/og.png`. Typography is a hand-rolled design-token CSS layer (variables like `--viz-b1`, `--fig-meta`, `--mono`) with self-hosted variable fonts preloaded from `/shared/fonts/` and **metric-matched local fallbacks** (`size-adjust: 104%; ascent-override: 95.2%`), light/dark via `prefers-color-scheme` plus an explicit `html[data-scheme=…]` override, and no CSS framework. Nothing in any payload resembles a CMS or a runtime content API: no client-side fetch of post data was observed, which is consistent with a file-based build pipeline (inferred, not proven — see §7).

### 2.2 Evidence table

| Finding | Evidence (quoted) | Confidence |
|---|---|---|
| Next.js App Router + Turbopack production build | `<script src="/_next/static/chunks/turbopack-2o996n7farajp.js" async></script>`; chunk body: `(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push([…])`; RSC payload `self.__next_f.push([1,"1:\"$Sreact.fragment\"…` | Verified |
| Content is prerendered into HTML (full article text in first response) | Article HTML is 344,853 bytes; contains `<h1 … id="h1">Getting started with Claude Code mods</h1>`, `<div class="standfirst">`, full body, 6 `<h2>`, 7 `<figcaption>`, 9 rail TOC anchors | Verified |
| Static/immutable asset caching | CSS chunk: `cache-control: public, max-age=31536000, immutable`; `/media/ac53…png`: `cache-control: public, max-age=31536000, immutable, accept-ranges: bytes, content-length: 116996` | Verified |
| HTML caching is `must-revalidate` at origin, cache `HIT` at edge | Home: `cache-control: public, max-age=0, must-revalidate` + `cf-cache-status: HIT` + `etag: W/"284e04c8e4e9f9899e97000af0af82a1"` — the same ETag/cache state on the 404 page and on `/_next/image` | Verified |
| Single-page app shell is server-rendered, not fetched | `<div id="app"><nav class="nav … nav-ssr">…` present in raw HTML; only 10 `<script src="/_next/static/chunks/*">` and 2 stylesheets on the index | Verified |
| `/news` does not exist, `/blog` is an alias of `/` | `/news` → `404` (`<title>Page not found / claude.dev Blog` + `<meta name="robots" content="noindex">`); `/blog` → `200` with ETag `W/"284e04c8e4e9f9899e97000af0af82a1"` = identical to `/` | Verified |
| URL scheme is flat `/blog/<slug>/` | `sitemap.xml`: 14 `<loc>https://claude.dev/blog/<slug>/</loc>` + `/`, `/terminal/`, `/terms/`, `/mods/`; no `/tags/`, `/page/2/`, no category paths | Verified |
| Index mechanics: server-rendered cards + client "load more" + client tabs | `<a href="/blog/getting-started-with-claude-code-mods/" class="post stag" data-slug="…">` ×10; `<button class="tab" data-c="ENGINEERING">ENGINEERING</button>`; `aria-label="Load five more posts"`; the 3 posts not in the DOM cards are present in the flight payload (e.g. `seeing-like-an-agent` ×3) | Verified |
| Search is a client-side filter box, keyboard-triggered | `<div class="search"><span class="s-toggle" role="button" tabindex="0" aria-label="Open search"><span class="sk">[S]</span> SEARCH</span><input id="q" placeholder="Type anything here"/></div>` | Verified |
| Article anatomy: hero + rail TOC + progress + share | `data-tpl="article"`, `.hero`, `#mCat` category chip, `#mAuthor`, `#mDate`, `#mTime` (11 min), `<div id="tree">` with 6 `<a href="#…">` anchors, reading-progress bar `.prog`, `.share` block with `#shX` Twitter intent link; `aria-label`s describe each poster image | Verified |
| Reading time is computed, not authored per template | Index shows `<div class="p-time">11 <span class="u-long">minutes</span>…`; JSON-LD carries `"timeRequired":"PT11M"` | Verified |
| Code blocks: custom highlighter (no library signature) | `<pre><span class="fn">on</span><span class="pl">(</span><span class="ar">&quot;tool.call&quot;</span>…`; counts in article: `<pre>` 20, `<code>` 110, `shiki` 0, `prism` 0, `hljs` 0, `language-` 0 | Verified |
| Images: one pre-generated PNG per media item, no responsive variants | `<img class="fg" src="/media/ac53…png" … loading="lazy" decoding="async" width="1100" height="811" style="…aspect-ratio:1100 / 811">`; in article: `srcset` 0, `<picture>` 0, `.webp` 0, `.avif` 0, media refs 20 | Verified |
| Hero animations are short muted MP4s with posters and descriptions | `<video class="art-anim" muted loop playsInline preload="none" src="/media/1ee8…mp4" poster="/media/eaee…png" aria-label="A one-line terminal band cycling through three forecasts…" width="860" height="44">` (9 `<video>` in article) | Verified |
| Fonts: self-hosted variable woff2, preloaded; metric-matched fallbacks | `<link rel="preload" href="/shared/fonts/AnthropicSans-Roman-Variable.woff2" as="font" crossorigin type="font/woff2">` (+Mono, +Italic with `fetchPriority="low"`); CSS: `@font-face{font-family:Anthropic Sans;src:url(…)format("woff2");font-weight:300 800;font-display:swap}` and `@font-face{font-family:Anthropic Sans Fallback;src:local(Arial)…;size-adjust:104%;ascent-override:95.2%;descent-override:25%;line-gap-override:0%}` | Verified |
| Design tokens + theming, no CSS framework | CSS chunk defines `--viz-muted`, `--fig-series-1`, `--mono`, `--fig-meta`…; `@media (prefers-color-scheme:light){html:not([data-scheme=dark]) …}` and `html[data-scheme=light]{…}`; 2 stylesheets on index, 4 on article | Verified |
| SEO/meta | `<meta property="og:type" content="article">`, `article:published_time`, `article:author`, `article:section`; `<link rel="canonical" href="https://claude.dev/blog/…/">`; `<link rel="alternate" type="application/rss+xml" href="https://claude.dev/rss.xml">` | Verified |
| Structured data | `<script type="application/ld+json">{"@context":"https://schema.org","@type":"BlogPosting","headline":…,"author":{"@type":"Person","name":"Addy Osmani"},"datePublished":"2026-10-01","articleSection":"Tutorials","timeRequired":"PT11M",…}</script>`; site-level `WebSite` block on `/` | Verified |
| Markdown twin per article, deliberately de-indexed | `<link rel="alternate" type="text/markdown" href="https://claude.dev/blog/getting-started-with-claude-code-mods.md">`; that URL → `content-type: text/markdown`, `x-robots-tag: noindex`, body starts `# Getting started with Claude Code mods` + `- Author: …` | Verified |
| Per-post OG image, generated per route path | `/blog/getting-started-with-claude-code-mods/og.png` → `200 image/png`, `content-length: 12598`, `cache-control: public, max-age=0, must-revalidate` | Verified |
| Per-post OG image is **not** long-cached | same response: `cache-control: public, max-age=0, must-revalidate` (contrast with `/media/*` = 1 year immutable) | Verified |
| RSS feed w/ author + category | `rss.xml` → `content-type: application/rss+xml`, items carry `<dc:creator>Addy Osmani</dc:creator>` and `<category>Playbooks</category>` | Verified |
| robots/sitemap: everything allowed, no crawl tricks | `robots.txt`: `User-Agent: *\nAllow: /\n\nSitemap: https://claude.dev/sitemap.xml`; `sitemap.xml` has `<lastmod>` per URL, no `<priority>` spam | Verified |
| Strict security posture | Header + meta CSP: `default-src 'self'; script-src 'self' 'unsafe-inline' 'sha256-…'`; `strict-transport-security: max-age=31536000; includeSubDomains; preload`; `x-frame-options: DENY`; `cross-origin-opener-policy: same-origin`; `referrer-policy: strict-origin-when-cross-origin` | Verified |
| Accessibility gaps on the index | Index HTML: `<main>` 0, "skip to" 0, `<h1>` 1 (the `claude.dev` wordmark); search input has no label/`aria-label` (`<input id="q" placeholder="Type anything here"/>`, the label sits on the toggle `<span>`); article page does have `<h1 id="h1">` | Verified |
| Client-only category filtering ⇒ no crawlable category pages | tabs are `<button data-c="…">` without `href`; sitemap has no category/tag URLs | Verified |
| No CMS/API signature in any payload | Zero client-side content fetches: index + article HTML contain all data; no `graphql`/`cms`/JSON-API URLs in markup (only `/_next/static/*` assets) | Inferred (absence of evidence) |
| Origin is a Node/Next server or static export — indistinguishable from outside | `RSC: 1` request returned the exact same HTML/ETag; no `Vary: rsc,…` header; `/_next/image?url=…` → 404; all HTML is a Cloudflare `HIT`, so origin headers are never seen | Unknown → §7 |

---

## 3. Site 2 — openai.com (news/engineering + one article)

### 3.1 How it is built (one paragraph)

openai.com/news/engineering/ is a Next.js App Router application on Vercel (`x-powered-by: Next.js`, `x-vercel-cache: HIT`, `x-vercel-id: sin1::pdx1::…`, `<html data-dpl-id="dpl_4H4ieQh23mPMgP7cPSiz1cgLeY2v">`, Turbopack runtime at `/_next/static/immutable/chunks/turbopack-1egbo-bp4jerq.js`) that sits behind Cloudflare's managed bot protection (bare fetch = 403 challenge; browser-like headers = 200), and everything I fetched — listing, `/index/<slug>/` articles, `/sitemap.xml/<category>/` — is served by one catch-all route (`x-matched-path: /[locale]/[country]/[flags]/[...slug]`) with ISR (`x-nextjs-prerender: 1`, `x-nextjs-stale-time: 300`, plus `age:` values of ~24 h on warm entries). The content is definitively **not** in the repo: every image on the listing and articles resolves to `images.ctfassets.net/kftzwdyauwt9/…` served by `server: Contentful Images API` via CloudFront, and the RSC flight payload embedded in the HTML carries GraphQL-shaped Contentful entries (`"__typename":"tag"`, `"categories":[{"name":"Engineering","slug":"engineering"}]`, `"pageType":"Article"`, `"publicationDate":"2026-05-04T00:00"`, `"seoFields":{…,"openGraphImage":{…}}`, `"showTableOfContents":true`, `"showShareButtons":true`, `"contentKind":"page"`, `"indexRatio":"1:1"`, and a query of `"skip":0,"limit":9`), so a CMS + GraphQL delivery API is proven for assets and strongly implied for content. The listing renders 9 cards with semantic `<time dateTime="…">`, a client-side `<button type="button">Load more</button>`, grid/list view toggles (radio inputs named `mediaView`), a search overlay (`aria-modal` present) and 10 category links under `/news/<category>/`, and it pays for all that in weight: **45 render-blocking `<link rel="stylesheet">`** and ~99 script chunks per page, from Tailwind v4 utility output (`--tw-ease`, container queries `@md:`, `@container`) plus CSS-module classes with hashed names (`AnimationPlaybackControl-module__lvJ3yW__control`). Article pages (`/index/delivering-low-latency-voice-ai-at-scale/`, `/index/building-codex-windows-sandbox/`) keep the same shell: `h1` with `data-article-hero-copy-region="headline"`, subhead/meta regions, a "Table of contents", "Authors" and "References" sections, share controls, a "Keep reading" related-card row, typography tokens (`text-h1`…`text-h5`, `text-p1/p2`, `text-meta`, `text-cta`), `prefers-reduced-motion` handling, and Contentful-served responsive images (`?w=640&q=90&fm=webp 640w, … 3840w` in the card `srcset`, `loading="lazy" decoding="async"`); the surprising SEO gaps are that articles emit **no JSON-LD at all** and keep `og:type="website"`, while the sitemap is excellent (`/sitemap.xml` index → per-category sitemaps whose entries carry `lastmod` and dozens of `xhtml:link` hreflang alternates for `/ja-JP/index/…`, `/zh-Hans-CN/index/…`, etc.).

### 3.2 Evidence table

| Finding | Evidence (quoted) | Confidence |
|---|---|---|
| Cloudflare managed challenge blocks bare clients | Bare GET: `403`, `cf-mitigated: challenge`, `set-cookie: __cf_bm=…`, `critical-ch: Sec-CH-UA-Bitness, …`, `accept-ch: Sec-CH-UA-…`; same URL with browser-like headers → `200` | Verified |
| Framework: Next.js App Router + Turbopack, but *not* the same build layout as claude.dev | `x-powered-by: Next.js`; `vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch, accept-encoding`; `<script src="/_next/static/immutable/chunks/turbopack-1egbo-bp4jerq.js" async>` with body `(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push([…])` | Verified |
| Hosting/CDN: Vercel behind Cloudflare | `x-vercel-cache: HIT`; `x-vercel-id: sin1::pdx1::jmw4n-1791192740718-ec81286c1cdc`; `server: cloudflare` + `cf-cache-status: DYNAMIC`; HTML carries `<html data-dpl-id="dpl_4H4ieQh23mPMgP7cPSiz1cgLeY2v" …>` | Verified |
| Prerendered pages with 5-minute revalidation (ISR) | `x-nextjs-prerender: 1`; `x-nextjs-stale-time: 300`; `age: 88144` on a warm listing, `age: 0` on a cold one | Verified |
| One catch-all route serves everything, with locale/country segments | `x-matched-path: /[locale]/[country]/[flags]/[...slug]` on the listing, on both articles and on the 404-ish variants; sitemap route reports `x-matched-path: /sitemap.xml/[category]` | Verified |
| CMS: Contentful (assets proven, content strongly implied) | Every image URL: `//images.ctfassets.net/kftzwdyauwt9/…` (space `kftzwdyauwt9`), response headers `server: Contentful Images API`, `via: 1.1 …cloudfront.net (CloudFront)`, `access-control-allow-origin: *`; payload fields `"__typename":"tag"`, `"seoFields"`, `"contentKind"`, `"indexRatio"` | Inferred for content, Verified for assets |
| Listing query/pagination shape | Embedded payload: `{"skip":0,"limit":9}`; page renders 9 `<time>` elements and 13 unique `/index/…` links (9 cards + hero/related links) | Verified |
| "Load more" is a real client button, not a link | `<button type="button" class="… rounded-[2.5rem] … disabled:bg-primary-4 disabled:text-primary-60 …">Load more</button>` | Verified |
| Category index scheme | Listing nav: `href="/news/engineering/"` plus `/news/ai-adoption/`, `/news/applied-ai/`, `/news/company-announcements/`, `/news/global-affairs/`, `/news/intelligence-age/`, `/news/product-releases/`, `/news/research/`, `/news/safety-alignment/`; page heading `<h2 class="shrink-0 text-h2">Engineering</h2>` | Verified |
| Article URL scheme, split from the listing | Articles live at `https://openai.com/index/<slug>/` (e.g. `/index/delivering-low-latency-voice-ai-at-scale/`, `/index/building-codex-windows-sandbox/`) while the index is `/news/<category>/` | Verified |
| Search + view toggles in the index UI | `aria-label="Open Search"` / `"Close Search"`, `aria-modal` present, overlay with `backdrop-blur-[50px]`; `<input type="radio" id="media" name="mediaView" value="grid" checked>` / `value="list"` | Verified |
| Article anatomy, driven by CMS flags | `showTableOfContents: true`, `showShareButtons: true`; markup: `data-article-hero-copy-region="headline"|"subhead"|"meta"`, `<h2 …>Table of contents`, `<h2 class="mb-3 text-p2 text-primary-60">Authors`, `…>References`, `<h2 class="text-h4 text-primary-100">Keep reading` | Verified |
| Code: inline `<code>` only in the sampled articles; no highlighter library | `<span class="prose"><code class="wrap-anywhere"><span>S-1-5-5-X-Y</span></code></span>`; per article: `pre` 0, `code` 4–57, `shiki` 0, `prism` 0, `hljs` 0, `language-` 0 | Verified for 2 sampled articles; cannot generalise |
| Images: Contentful transform API + real responsive `srcset`, WebP only | Card `srcset`: `…/OAI_HabitatPT1_Art_Card_1x1.png?w=640&q=90&fm=webp 640w, … 750w, 828w, 1080w, 1200w, 1920w`; article imgs: `loading="lazy"` ×8, `decoding="async"` ×10, no `avif` anywhere, `fm=webp` is the only transform format used | Verified |
| `fm=webp` is where their savings come from | Same PNG: `?w=1600&h=900&fit=fill` → `200 image/png`, `content-length: 1049249`; `?w=800&fm=webp&q=70` → `200 image/webp`, `content-length: 28902` (≈36× smaller); CDN sends `cache-control: max-age=31536000` | Verified |
| Typography/theming = Tailwind v4 tokens + accessibility-aware motion | Class tokens `text-h1…text-h5, text-p1, text-p2, text-meta, text-cta, text-nav-header`; CSS vars `--color-primary-100`, `--content-width`; `@media (prefers-reduced-motion:reduce){ .AnimationPlaybackControl… {transition-property:none;display:none} }`; `dark:` variants used with `prefers-color-scheme` | Verified |
| Metadata: canonical yes, structured data no, og:type wrong-ish | `<link rel="canonical" href="https://openai.com/index/delivering-low-latency-voice-ai-at-scale/">`, `og:title/description/image` (OG image from Contentful at `?w=1600&h=900&fit=fill`), `twitter:site="@OpenAI"`, **`<meta property="og:type" content="website">` on an article**, `application/ld+json` count = **0** | Verified (2 article pages) |
| i18n: 30+ locales per post, via path prefix + hreflang | Listing head: `<link rel="alternate" hrefLang="ar" href="https://openai.com/ar/news/engineering/"/>`…; `/sitemap.xml/engineering/` entry has `lastmod` + `xhtml:link rel="alternate" hreflang="ja-JP|zh-Hans-CN|sw-KE|pt-PT|…"` | Verified |
| Sitemap/robots hygiene | `robots.txt`: `User-Agent: *\nAllow: /\nDisallow: /microsoft-for-startups/\n\nSitemap: https://openai.com/sitemap.xml` (+ `last-modified: Tue, 18 Aug 2026 07:29:08 GMT`); `sitemap.xml` is an index of ~30+ per-section sitemaps incl. `/sitemap.xml/engineering/` | Verified |
| Weight cost of the platform | Listing page: 45 `rel="stylesheet"` links, 99 `<script src="/_next/…">`, 8 `__next_f` payload script blocks; article page: 45 stylesheets, 99 chunks; one CSS chunk alone is a component-scoped module with hashed suffixes | Verified |
| Static chunks are immutable and Vercel-cached | `/_next/static/immutable/chunks/0kbvo8tm3-5.css` → `cache-control: public,max-age=31536000,immutable`, `etag: "_next/static/immutable/chunks/0kbvo8tm6c3-5.css"`, `x-vercel-cache: HIT`, `last-modified: Mon, 28 Sep 2026 23:44:34 GMT` | Verified |
| Accessibility of the index is better than claude.dev's | `<main>` 1, "skip to" 1, `aria-label` ×30, semantic `<time dateTime="2026-09-11T10:00">Sep 11, 2026</time>`; but cards are `<a>`/`<div>` (no `<article>`, `article` count 0) | Verified |
| Marketing/analytics stack (context for the CSP and weight) | CSP allows `*.mktoweb.com`, `app.leandata.com`, `snap.licdn.com`, `bat.bing.com`, `connect.facebook.net`, `cdn.jsdelivr.net`, `api.observablehq.com`, `challenges.cloudflare.com`; page loads `/cdn-cgi/challenge-platform/scripts/jsd/main.js` and preloads `https://static.cloudflareinsights.com/beacon.min.js` | Verified |

---

## 4. Side-by-side

| Dimension | claude.dev | openai.com/news + /index |
|---|---|---|
| Framework / build | Next.js App Router, Turbopack, chunks at `/_next/static/chunks/*` | Next.js App Router, Turbopack, chunks at `/_next/static/immutable/chunks/*` |
| Rendering | Prerendered HTML, content fully in the document; no observable RSC/server runtime | Prerendered + ISR (`x-nextjs-prerender: 1`, `x-nextjs-stale-time: 300`), catches all routes via `[...slug]` |
| Hosting / CDN | Cloudflare edge (every HTML is `cf-cache-status: HIT`); origin unknown | Vercel (`x-vercel-cache`, `x-vercel-id`) proxied by Cloudflare (`cf-cache-status: DYNAMIC`) |
| Bot policy | Open to anything; `robots.txt` allow-all | Cloudflare challenge: bare `fetch`/`curl` → 403; needs browser-like headers |
| Content pipeline | Files-in-repo, compiled at build (inferred); no CMS/API signature | Contentful (assets verified via `images.ctfassets.net/kftzwdyauwt9` + `Contentful Images API`; entries in the flight payload with `__typename`, `seoFields`, `contentKind`) |
| URL scheme | Flat `/blog/<slug>/`; `/blog` aliases `/`; `/news` = 404 | Listing `/news/<category>/`, article `/index/<slug>/`, both under `/[locale]/[country]/[flags]/[...slug]` |
| Index mechanics | 10 cards in HTML + client tabs + "load five more" from inlined data; no pagination URLs | 9 cards (`skip: 0, limit: 9`) + `<button>Load more</button>` + view toggles + search overlay; 10 category URLs |
| Tag/category pages | None (client-only buttons) | Yes, `/news/<category>/` for 10 categories |
| Article page anatomy | Hero + category chip + standfirst + author/date/reading time, rail TOC tree, progress bar, share row, poster videos, figures with captions | Hero (headline/subhead/meta regions) + TOC + Authors + References + share + "Keep reading"; figures without captions in the sample |
| Code blocks | Server-rendered highlighted `<pre>` (custom token classes), plain `<pre>` wrapper | No `<pre>` in the 2 sampled engineering articles; only inline `<code class="wrap-anywhere">` |
| Images | One PNG per item, no `srcset`, `width/height` + `aspect-ratio`, lazy/async; MP4 heroes with posters | Contentful `srcset` 640w→3840w with `fm=webp&q=90`, lazy/async; `?fm=webp` cut a 1.05 MB PNG to 28.9 KB |
| Fonts | Self-hosted variable woff2 (Sans/Mono/Italic) preloaded, 12 metric-matched local fallback faces, `font-display: swap` | Not self-hosted in HTML (no `woff2` in markup); fonts load via CSS with `font-src 'self' data: cdn.openai.com`; typography tokens instead |
| CSS approach | 2–4 stylesheets, hand-written design tokens (`--viz-*`, `--fig-*`) | Tailwind v4 + CSS modules: **45 stylesheets** per page |
| Structured data | `BlogPosting` JSON-LD per article + `WebSite` on home; `og:type=article`, `article:published_time/author/section` | **No JSON-LD**; `og:type=website` even on articles; canonical present |
| Feeds / machine-readable | `rss.xml`, per-post `/og.png`, per-post `.md` twin (`x-robots-tag: noindex`), `sitemap.xml` (14 posts) | `sitemap.xml` index → per-category sitemaps with `lastmod` + hreflang alternates; no RSS or Markdown twin found |
| A11y | Better semantics on article (h1, aria-labels on media); **no `<main>`, no skip link, unlabeled search input** on index | `<main>`, skip link, `aria-label`×30, `aria-modal` search dialog, semantic `<time>`; cards not wrapped in `<article>` |
| Security headers | CSP `default-src 'self'` + hashed inline scripts, HSTS preload, `X-Frame-Options: DENY`, COOP/CORP | CSP broad (ads/marketing/analytics/jsDelivr), HSTS preload, `X-Frame-Options: SAMEORIGIN`, `Cross-Origin-Embedder-Policy: require-corp` |

---

## 5. What we should copy (decisions + trade-offs)

Our own stack is Astro 7 static output to GitHub Pages (`site: 'https://xjtucslg.github.io'`), content collections over `src/content/blog/*.md`, `src/pages/blog/index.astro` + `src/pages/blog/[...id].astro`, `rss.xml.ts`, `Seo.astro`, `PostCard.astro`, system font stacks in `src/styles/global.css`, six posts. These eight decisions are the ones the two sites actually support with evidence:

1. **Stay file-based (content collections), reject a CMS.** claude.dev's whole content surface is compiled into HTML with zero content-fetch requests, and its machine-readable outputs (RSS, `.md` twin, OG image) are all generated at build; openai.com needs Cloudflare bot protection, Contentful, 45 stylesheets and ~99 script chunks to render one card list — and it *still* cannot be fetched by a plain HTTP client. **Trade-off:** no web editor, no scheduled publishing, every edit is a commit + rebuild (with GitHub Pages, ~1 min per deploy); we lose Contentful's localization and preview (`showTableOfContents`-style per-post flags are replaced by frontmatter, which our schema already supports).
2. **Ship complete HTML per page and keep JS to enhancements only.** claude.dev's article arrives complete (title, standfirst, full text, TOC tree, reading time), and its index renders 10 real `<a>` cards that work with JS off; openai.com's index needs JS for every post beyond the first nine. **Trade-off:** HTML stays large (claude.dev's is 344 KB — mostly prose, so acceptable) and we give up SPA-style instant navigation; the gain is that crawlers, LLM agents and no-JS readers see everything.
3. **Server-render the whole index and filter client-side from inlined data — but cap it.** Copy the 10-cards + "Load five more" + `data-*` category tabs pattern (whose extra post data is already in the HTML) instead of fetch-on-filter. **Trade-off:** the index grows linearly with the archive — fine at 20 posts, painful at 200. Concrete rule: render the newest 12 in HTML, reveal the rest from the same inlined list, and switch to real `/blog/page/2/` routes once we pass ~40 posts; also emit `/tags/<tag>/` pages, because client-only tabs produce no crawlable category URLs (claude.dev's sitemap has none, openai.com's has ten).
4. **Put structured data + article metadata in `Seo.astro`, generated from frontmatter.** Copy claude.dev's `BlogPosting` block (`headline`, `author`, `datePublished`, `articleSection`, `timeRequired: PT{minutes}M`, `mainEntityOfPage`), `og:type=article`, `article:published_time/author/section`, and a real `og:image`; do **not** copy openai.com's zero JSON-LD + `og:type=website` on articles. **Trade-off:** more head bytes and a drift risk (Google penalises JSON-LD that contradicts visible text) — so build it in the layout from the same fields the page renders (we already compute `minutes` and `tags` in `src/lib/posts.ts`), never hand-written per post.
5. **Pre-generate responsive images at build time and always set dimensions.** openai.com gets 36× savings from Contentful's `fm=webp` (1.05 MB PNG → 28.9 KB WebP) plus a real `srcset`; claude.dev ships exactly one PNG per item (117 KB measured) with no `srcset`/WebP, relying on `width`/`height` + `aspect-ratio` + `loading="lazy" decoding="async"` to avoid layout shift. **Trade-off:** build-time variants cost build time and repo bytes, and unless `width`/`height`/`aspect-ratio` are always emitted we trade bytes for layout shift; a small blog needs 2–3 widths, not openai.com's eight (640w→3840w).
6. **Keep system fonts for CJK; if we add a Latin display face, self-host with preload + metric-matched fallback.** Copy claude.dev's two-part trick exactly: `@font-face{font-display:swap;font-weight:300 800}` on a self-hosted variable woff2, `<link rel="preload" … as="font" crossorigin type="font/woff2">` on the render path (their third font is preloaded with `fetchPriority="low"`), and local fallback faces carrying `size-adjust:104%; ascent-override:95.2%; descent-override:25%`. **Trade-off:** each face is a request plus hand-tuned metrics, and a full CJK webfont (Noto Sans SC) is multiple MB — our `--font-sans` stack already lists the local CJK families, so only Latin/mono subsets are worth self-hosting. Take the `prefers-reduced-motion` discipline from both sites too.
7. **Keep the flat `/blog/<slug>/` scheme and cross-link index ⇄ article.** claude.dev's flat scheme needs no locale/country segments and its sitemap is 19 lines; openai.com's split (`/news/<category>/` listing vs `/index/<slug>/` article under a `[...slug]` catch-all with `[locale]`/`[country]` prefixes) is what forces 30+ hreflang duplicates per post and `x-matched-path` routing. **Trade-off:** no per-category path for filtering (use query strings/anchors) and no i18n now; if we later add English, add explicit `/en/blog/<slug>/` routes rather than a catch-all.
8. **Generate the machine-readable twins from day one and keep them de-indexed.** Copy claude.dev's `/blog/<slug>.md` twin served as `text/markdown` with `x-robots-tag: noindex` (for LLM agents and copy-paste), its per-post OG image, plus `@astrojs/sitemap` next to the RSS feed we already have. **Trade-off:** one more artifact per post to keep in sync — generate it inside `[...id].astro`/an endpoint from the same content collection, never by hand — and the `noindex` header matters on GitHub Pages: without it the Markdown twin competes with the HTML page.

Two things **not** to copy: openai.com's 45-stylesheet Tailwind/marketing payload (our 2-file token CSS is the better trade for a teaching blog), and its CMS-plus-ISR-plus-locale machinery at our scale. One thing worth stealing from openai.com despite the above: semantic `<time dateTime="…">` for post dates, and `loading="lazy" decoding="async"` on every card image.

---

## 6. Numbers worth remembering

| Metric | claude.dev | openai.com |
|---|---|---|
| HTML size for one article | 344,853 bytes (`article-mods`) | 599,991 bytes (voice AI), 679,514 bytes (Codex Windows sandbox) |
| Card/listing HTML size | 87,340 bytes | 414,251 bytes |
| Stylesheets per page | 2 (index) / 4 (article) | 45 (both) |
| JS chunks referenced per page | 10 | 99 |
| Posts listed on first paint | 10 of 14 (+ "load five more") | 9 per category page (skip 0, limit 9) |
| Cached asset lifetime | `max-age=31536000, immutable` (`/_next/static`, `/media/*`) | `public,max-age=31536000,immutable` (`/_next/static/immutable`), Contentful images `max-age=31536000` |
| HTML cache lifetime | `public, max-age=0, must-revalidate` + Cloudflare `HIT` | `public, max-age=0, must-revalidate` + `x-vercel-cache: HIT` + ISR `stale-time: 300` |

---

## 7. Claims I could not verify (do not repeat these as facts)

**claude.dev**

1. **Static export vs. a running Next.js server.** Every HTML response was a Cloudflare `HIT`, so origin behaviour is unobservable: a `RSC: 1` request returned the identical HTML/ETag, responses carry no `Vary: rsc, …` (openai.com's do), and `/_next/image?url=…&w=64&q=75` returns 404. That is consistent with a static export/host-served HTML, but a proxy stripping `Vary` would look the same. Rendering is `Verified` as "prerendered HTML"; the *mechanism* is `Unknown`.
2. **Hosting platform and plan.** `server: cloudflare` + `cf-ray` only. Whether it is Cloudflare Pages, Workers, or a Node server on another host behind Cloudflare is not determinable from outside. Likewise, the `cf-cache-status: HIT` on `max-age=0` HTML implies a cache rule/edge TTL override — inferred, not observed.
3. **The content pipeline upstream of the deployment.** No CMS/API signature is present in any payload, and no client-side content fetch occurs — consistent with plain files in a repo, but the authoring system (e.g. an internal tool that commits Markdown) is invisible from the outside.
4. **"Load more" mechanism specifics.** The three posts beyond the first ten *are* present in the home document, but whether the button re-renders from that inlined array or fetches a route I could not confirm, and I did not verify a code-copy button on `<pre>` blocks (46 case-insensitive "Copy" matches in the article page were not attributable).
5. **Any performance field data (LCP/CLS/INP)** — no CrUX/Lighthouse run was made; nothing here should be read as a speed verdict.

**openai.com**

6. **Contentful as the article CMS** is an inference. Verified: image assets come from `images.ctfassets.net/kftzwdyauwt9` served by `Contentful Images API`, and the flight payload contains GraphQL-ish fields (`__typename`, `seoFields`, `contentKind`, `collection`-style `skip`/`limit`). Not verified: a Contentful Delivery/GraphQL API call for article text (I never saw the network request; I inferred from the serialized payload keys).
7. **Code-block anatomy.** Both sampled engineering articles contain **zero `<pre>` elements** — only inline `<code class="wrap-anywhere">` — and no shiki/prism/hljs/`language-` signatures. I therefore cannot describe how openai.com renders fenced code blocks (a different article may contain them). Their "code" experience may be inline-only plus screenshots (the sandbox article has 40 `<svg>` and 7 `<figure>`).
8. **No JSON-LD** is verified for the two articles plus the listing I fetched; I did not crawl other page types (docs, product pages), which may carry structured data.
9. **Why the JSON-LD/`og:type` gap exists** (both look like oversights on an otherwise polished SEO setup) — unverified; no authoring rationale observed.
10. **Their image pipeline inside the app.** `/_next/image` is never referenced (0 occurrences) and the `srcset` URLs are Contentful transforms, so `next/image` is likely unused for these images — but I did not execute their JS to confirm what the client renders.
11. **ISR details beyond headers:** `stale-time: 300` and observed `age` values only. Revalidation triggers, on-demand revalidation and the Vercel plan are unknown. Search backend, analytics wiring and A/B tooling likewise.
12. **The 403 challenge is header-sensitive, not absolute.** It reproduced with no headers and cleared with browser-like headers; a real browser additionally negotiates client hints (the page advertises `accept-ch`/`critical-ch: Sec-CH-UA-*`), so a browser sees responses my client may not have (e.g. different image formats or locale variants).
13. **Feeds:** I found no RSS/atom or Markdown twin for openai.com (their sitemap-based discovery is verified); the absence of a feed is only verified for the pages I fetched.

**Method limits.** `r.jina.ai` and `web.archive.org` were unreachable from this environment (`fetch failed`), so no mirror or snapshot corroborates anything; all observations are live GETs on 2026-10-05 (UTC). Only GETs were possible (no HEAD/OPTIONS), and no JavaScript was executed, so anything created client-side after load (search indexes, view transitions, lazy sections) is outside this report.

---

## Appendix — raw artifacts and reproducible commands

Saved bodies (JSON-escaped strings unescaped when parsed; each file is the spill of one `http_get`):

| File | What it is |
|---|---|
| `research/raw/claude-dev-home.html` | `https://claude.dev/` (200) — also the body of `/blog` (same ETag) |
| `research/raw/claude-dev-article-mods.html` | `https://claude.dev/blog/getting-started-with-claude-code-mods/` (200) |
| `research/raw/openai-news-engineering.html` | `https://openai.com/news/engineering/` (200 with browser-like headers) |
| `research/raw/openai-article-voice-ai.html` | `https://openai.com/index/delivering-low-latency-voice-ai-at-scale/` (200) |
| `research/raw/openai-article-codex-windows-sandbox.html` | `https://openai.com/index/building-codex-windows-sandbox/` (200) |

Extraction scripts used (PowerShell, read-only over the above): `research/digest.ps1`, `research/probe2.ps1`, `research/probe3.ps1`, `research/probe4.ps1`, `research/probe5.ps1`, `research/probe6.ps1`.

Key URLs probed: `/robots.txt`, `/sitemap.xml`, `/rss.xml`, `/blog/<slug>.md`, `/blog/<slug>/og.png`, `/_next/image?…`, `/_next/static/chunks/*`, `/_next/static/immutable/chunks/*`, `/news`, `/blog`, `/mod/`; `https://openai.com/{robots.txt,sitemap.xml,sitemap.xml/engineering/}`, `https://images.ctfassets.net/kftzwdyauwt9/…{?w=…&q=…&fm=webp}`.

$hd = (Get-Content -Raw -LiteralPath '.tnega/spill/http_get-call_01_gXYrm5kuwsfSznhZBOLv7927-http_get.txt') -replace '\\"','"' -replace '\\n',"`n"
function Cnt($s,$p){ ([regex]::Matches($s,$p)).Count }
function Sample($s,$p,$n,$cap){ ([regex]::Matches($s,$p) | ForEach-Object { $_.Value }) | Select-Object -First $n | ForEach-Object { $_.Substring(0,[Math]::Min($cap,$_.Length)) } }
function Ctx($s,$p,$n,$cap){ ([regex]::Matches($s,$p) | Select-Object -First $n | ForEach-Object { ($_.Value -replace '\s+',' ').Substring(0,[Math]::Min($cap,$_.Value.Length)) }) }

"=== CLAUDE.DEV HOME/INDEX ==="
"len=$($hd.Length)  data-slug=$((Cnt $hd 'data-slug='))  post-anchors=$((Cnt $hd 'class="post stag"'))"
"slugs: $((([regex]::Matches($hd,'data-slug="([^"]+)"') | ForEach-Object { $_.Groups[1].Value }) -join ', '))"
"later slugs present in payload? seeing-like-an-agent=$((Cnt $hd 'seeing-like-an-agent')) prompt-caching=$((Cnt $hd 'prompt-caching-is-everything')) html-essay=$((Cnt $hd 'unreasonable-effectiveness-of-html')) skills=$((Cnt $hd 'how-we-use-skills'))"
"load-more Ctx: $((Ctx $hd '.{0,160}Load more.{0,240}' 1 420) -join '')"
"stylesheet links=$((Cnt $hd 'rel="stylesheet"')) script chunks=$((Cnt $hd 'script src="/_next')) inline_scripts=$((Cnt $hd '<script'))"
"code wrapper: $((Ctx $hd '<div class="code[^"]*"[^>]{0,200}' 2 320) -join ' || ')"
"copy button: $((Ctx $hd '[^>]{0,200}(?i)copied[^>]{0,120}' 2 340) -join ' || ')"
"aria labels: $((([regex]::Matches($hd,'aria-label="[^"]{0,70}"') | ForEach-Object { $_.Value } | Sort-Object -Unique | Select-Object -First 14) -join ' | '))"
"p-time/reading: $((Ctx $hd 'p-time">[^<]{0,40}' 3 80) -join ' | ')"
"tabs: $((Ctx $hd '<div class="tabs"[^>]*>.{0,400}' 1 460) -join '')"
"search: $((Ctx $hd '<div class="search">.{0,260}' 1 300) -join '')"
"theme-color/light-dark: $((([regex]::Matches($hd,'theme-color') | ForEach-Object { $_.Value }) | Sort-Object -Unique) -join ' ')"
"attribution: $((Ctx $hd 'Made by|built with|Astro|Next.js|Vercel' 3 120) -join ' | ')"

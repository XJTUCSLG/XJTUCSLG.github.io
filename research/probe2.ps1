$home = (Get-Content -Raw -LiteralPath '.tnega/spill/http_get-call_01_gXYrm5kuwsfSznhZBOLv7927-http_get.txt') -replace '\\"','"' -replace '\\n',"`n"
$art  = (Get-Content -Raw -LiteralPath '.tnega/spill/http_get-call_02_kOxIMYhmPwqT5GYxLr6r3061-http_get.txt') -replace '\\"','"' -replace '\\n',"`n"
$lst  = (Get-Content -Raw -LiteralPath '.tnega/spill/http_get-call_00_xtuxWa4GA7oV2ICa8gBc5198-http_get.txt') -replace '\\"','"' -replace '\\n',"`n"

function Cnt($s,$p){ ([regex]::Matches($s,$p)).Count }
function Sample($s,$p,$n,$cap){
  ([regex]::Matches($s,$p) | ForEach-Object { $_.Value }) | Select-Object -First $n | ForEach-Object { $_.Substring(0,[Math]::Min($cap,$_.Length)) }
}
function Ctx($s,$p,$before,$after){ ([regex]::Matches($s,$p) | Select-Object -First 3 | ForEach-Object { ($_.Value -replace '\s+',' ') }) }

"=== CLAUDE.DEV index mechanics ==="
"data-slug count=$((Cnt $home 'data-slug='))"
"all slug values: $((([regex]::Matches($home,'data-slug="([^"]+)"') | ForEach-Object { $_.Groups[1].Value }) -join ', '))"
"slug in payload beyond cards: $((Cnt $home 'seeing-like-an-agent')) $((Cnt $home 'prompt-caching-is-everything')) $((Cnt $home 'unreasonable-effectiveness-of-html')) $((Cnt $home 'lessons-from-building-claude-code-how-we-use-skills'))"
"load-more markup: $((Ctx $home 'aria-label="Load more posts"' 0 200) -join '')"
"css links home=$((Cnt $home 'rel="stylesheet"')) js chunks home=$((Cnt $home '<script src="/_next'))"
"aria-label values home: $((([regex]::Matches($home,'aria-label="[^"]{0,60}"') | ForEach-Object { $_.Value } | Sort-Object -Unique) -join ' | '))"

"=== CLAUDE.DEV copy buttons ==="
"copy labels: $((([regex]::Matches($home,'(?i)copy') | ForEach-Object { $_.Value } | Sort-Object -Unique) -join ' '))"
"code wrapper sample: $((Ctx $home '<div class="code[^"]*"' 0 240) -join '')"

"=== OPENAI article structure ==="
"code contexts: $((Ctx $art '<code[^>]{0,200}' 0 200) -join "`n   ")"
"codeblock wrapper: $((([regex]::Matches($art,'class="[^"]{0,80}(code|Code)[^"]{0,80}"') | ForEach-Object { $_.Value } | Sort-Object -Unique | Select-Object -First 6) -join ' | '))"
"css links article=$((Cnt $art 'rel="stylesheet"')) js chunks article=$((Cnt $art '<script src="/_next'))"
"og:type: $((Ctx $art 'property="og:type" content="[^"]*"' 0 60) -join '')"
"keep reading ctx: $((Ctx $art 'Keep reading' 0 400) -join '')"
"toc ctx: $((Ctx $art 'Table of contents' 0 300) -join '')"
"authors block: $((Ctx $art '>Authors' 0 500) -join '')"
"byline words: $((([regex]::Matches($art,'(?i)(written by|published|updated|minutes|min read|newsletter|sign up)') | ForEach-Object { $_.Value } | Sort-Object -Unique) -join ' | '))"
"hero copy region: $((Ctx $art 'data-article-hero-copy-region="[^"]*"' 0 120) -join ' | ')"
"video: video=$((Cnt $art '<video')) iframe=$((Cnt $art '<iframe')) svg=$((Cnt $art '<svg'))"
"a11y: skip=$((Cnt $art '(?i)skip to')) main=$((Cnt $art '<main')) arialabel=$((Cnt $art 'aria-label=')) lang=$((Ctx $art '<html[^>]{0,80}' 0 120) -join '')"

"=== OPENAI listing payload ==="
"search overlay role=dialog: $((Cnt $lst 'role="dialog"')) dialog-ish: $((Cnt $lst '(?i)dialog'))"
"news nav links count=$((Cnt $lst 'href="/news/'))"
"time sample: $((Ctx $lst '<time[^>]*>[^<]*' 0 120) -join ' | ')"
"'Load more' button attrs: $((Ctx $lst '<button[^>]{0,400}>Load more' 0 500) -join '')"
"engineering breadcrumb/heading: $((Ctx $lst '(?i)(Engineering</|All Engineering|categories)' 0 200) -join '')"

$art = (Get-Content -Raw -LiteralPath '.tnega/spill/http_get-call_01_uFQiDW6dGIUcvOx2reAx0270-http_get.txt') -replace '\\"','"' -replace '\\n',"`n"
function Cnt($s,$p){ ([regex]::Matches($s,$p)).Count }
function Sample($s,$p,$n,$cap){ ([regex]::Matches($s,$p) | ForEach-Object { $_.Value }) | Sort-Object -Unique | Select-Object -First $n | ForEach-Object { $_.Substring(0,[Math]::Min($cap,$_.Length)) } }
function Ctx($s,$p,$n,$cap){ ([regex]::Matches($s,$p) | Select-Object -First $n | ForEach-Object { ($_.Value -replace '\s+',' ').Substring(0,[Math]::Min($cap,$_.Value.Length)) }) }

"=== OPENAI code-heavy article (building-codex-windows-sandbox) len=$($art.Length) ==="
"h1=$(Cnt $art '<h1') h2=$(Cnt $art '<h2') h3=$(Cnt $art '<h3') pre=$(Cnt $art '<pre') code=$(Cnt $art '<code') figure=$(Cnt $art '<figure') figcaption=$(Cnt $art '<figcaption') table=$(Cnt $art '<table') img=$(Cnt $art '<img') video=$(Cnt $art '<video') svg=$(Cnt $art '<svg')"
"highlighter sigs: shiki=$(Cnt $art 'shiki') prism=$((Cnt $art '(?i)prism')) hljs=$(Cnt $art 'hljs') language-=$(Cnt $art 'language-') token-=$(Cnt $art 'token')"
"--- pre tags ---"
Sample $art '<pre[^>]{0,300}' 6 320 | ForEach-Object { "   $_" }
"--- code block wrapper context (first 2) ---"
Ctx $art '.{0,300}<pre' 2 700 | ForEach-Object { "   $_" }
"--- copy button near code ---"
Ctx $art '(?i).{0,120}copy.{0,160}' 3 300 | ForEach-Object { "   $_" }
"--- headings text ---"
Sample $art '<h2[^>]*>[^<]{0,110}' 12 140 | ForEach-Object { "   $_" }
"--- figure/figcaption sample ---"
Ctx $art '<figcaption[^>]*>.{0,150}' 3 220 | ForEach-Object { "   $_" }
"--- img tag sample (card + inline) ---"
Sample $art '<img[^>]{0,900}>' 3 800 | ForEach-Object { "   $_" }
"srcset=$(Cnt $art 'srcset=') sizes=$(Cnt $art 'sizes=\\') lazy=$(Cnt $art 'loading=\\"lazy') fetchpriority=$(Cnt $art '(?i)fetchpriority') width_attrs=$(Cnt $art 'width=\\"') decoding=$(Cnt $art 'decoding=')"
"--- toc ---"
Ctx $art '(?i)(table of contents|on this page)' 2 240 | ForEach-Object { "   $_" }
"toc anchors = $((Cnt $art 'href=\\"#'))"
"--- authors / references / keep reading ---"
Ctx $art '>Authors.{0,400}' 1 500 | ForEach-Object { "   $_" }
Ctx $art '>References.{0,200}' 1 260 | ForEach-Object { "   $_" }
Ctx $art '>Keep reading.{0,200}' 1 260 | ForEach-Object { "   $_" }
"--- newsletter / cta words ---"
Sample $art '(?i)(sign up|subscribe|newsletter|share this|copy link|was this useful)' 8 40 | ForEach-Object { "   $_" }
"--- fonts + typography tokens ---"
"font-family decls in html: $((Sample $art 'font-family:[^;\\"]{0,90}' 6 110) -join ' | ')"
"text-* classes: $((Sample $art 'text-(h1|h2|h3|h4|h5|p1|p2|p3|meta|cta|nav-header)[^\\" ]{0,30}' 14 40) -join ' | ')"
"theme vars: $((Sample $art '--(font|text|color|spacing|content)-[a-z0-9-]{1,40}' 14 50) -join ' | ')"
"prefers-reduced-motion in html: $(Cnt $art 'prefers-reduced-motion')"
"dark mode refs: $((Sample $art '(?i)(dark:|prefers-color-scheme|theme-toggle|color-scheme)' 6 60) -join ' | ')"

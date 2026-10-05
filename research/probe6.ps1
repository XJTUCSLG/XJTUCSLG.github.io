$art = (Get-Content -Raw -LiteralPath '.tnega/spill/http_get-call_01_uFQiDW6dGIUcvOx2reAx0270-http_get.txt') -replace '\\"','"' -replace '\\n',"`n"
$lst = (Get-Content -Raw -LiteralPath '.tnega/spill/http_get-call_00_xtuxWa4GA7oV2ICa8gBc5198-http_get.txt') -replace '\\"','"' -replace '\\n',"`n"
function Cnt($s,$p){ ([regex]::Matches($s,$p)).Count }
function Ctx($s,$p,$n,$cap){ ([regex]::Matches($s,$p) | Select-Object -First $n | ForEach-Object { ($_.Value -replace '\s+',' ').Substring(0,[Math]::Min($cap,$_.Value.Length)) }) }
function Sample($s,$p,$n,$cap){ ([regex]::Matches($s,$p) | ForEach-Object { $_.Value }) | Sort-Object -Unique | Select-Object -First $n | ForEach-Object { $_.Substring(0,[Math]::Min($cap,$_.Length)) } }

"=== code block markup search (sandbox article) ==="
"token- contexts:"
Ctx $art 'token-[^\\" ]{0,40}' 6 60 | ForEach-Object { "   $_" }
"classes containing code: $((Sample $art 'class=\\"[^\\"]{0,90}code[^\\"]{0,60}\\"' 12 150) -join "`n   ")"
"div data-* near code: $((Sample $art 'data-[a-z-]{2,30}=\\"[^\\"]{0,40}\\"' 20 70) -join ' | ')"
"first <code context: $((Ctx $art '.{0,220}<code' 2 480) -join "`n   ")"
"prefers-reduced-motion ctx: $((Ctx $art '.{0,80}prefers-reduced-motion.{0,120}' 1 240) -join '')"
"aria labels sample: $((Sample $art 'aria-label=\\"[^\\"]{0,60}' 12 80) -join ' | ')"
"role= attrs: $((Sample $art 'role=\\"[^\\"]{0,20}' 12 30) -join ' | ')"
"heading id attrs: $(Cnt $art '<h[123][^>]*id=')  anchor links: $(Cnt $art 'href=\\"#')"
"lazy attr variants: $((Sample $art 'loading=[^ >]{0,12}' 6 20) -join ' | ')"
"decoding variants: $((Sample $art 'decoding=\\"[a-z]{0,8}' 4 20) -join ' | ')"
""
"=== listing search overlay semantics ==="
"dialog ctx: $((Ctx $lst '.{0,200}role=\\"dialog\\".{0,300}' 1 560) -join '')"
"aria-modal: $(Cnt $lst 'aria-modal') searchinput: $((Sample $lst '<input[^>]{0,200}' 4 220) -join "`n   ")"
"list markup: $((Sample $lst '<(ul|ol|li)[^>]{0,80}' 6 100) -join ' | ')"
"article headings on listing: $((Sample $lst '<h[12][^>]*>[^<]{0,60}' 6 90) -join ' | ')"
"sectioning: section=$(Cnt $lst '<section') article=$(Cnt $lst '<article') nav=$(Cnt $lst '<nav')"

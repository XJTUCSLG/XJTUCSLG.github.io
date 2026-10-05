$lst = (Get-Content -Raw -LiteralPath '.tnega/spill/http_get-call_00_xtuxWa4GA7oV2ICa8gBc5198-http_get.txt')
function Cnt($s,$p){ ([regex]::Matches($s,$p)).Count }
"listing stylesheet links = $((Cnt $lst 'rel=\\"stylesheet\\"'))"
"listing script src chunks = $((Cnt $lst '<script src=\\"/_next'))"
"listing preload-tagged chunks = $((Cnt $lst 'rel=\\"preload\\"'))"
"listing __next_f payload scripts = $((Cnt $lst '__next_f'))"
"listing inline script bytes approx = $((Cnt $lst 'self.__next_f.push'))"
"listing font refs (woff) = $((Cnt $lst 'woff'))  css font-face refs in html = $((Cnt $lst 'font-face'))"
"listing css hrefs sample:"
([regex]::Matches($lst,'/_next/static/immutable/chunks/[^\\"]+\.css') | ForEach-Object { $_.Value } | Select-Object -First 5) -join "`n"
$art = (Get-Content -Raw -LiteralPath '.tnega/spill/http_get-call_02_kOxIMYhmPwqT5GYxLr6r3061-http_get.txt') -replace '\\"','"' -replace '\\n',"`n"
$lst2 = (Get-Content -Raw -LiteralPath '.tnega/spill/http_get-call_00_xtuxWa4GA7oV2ICa8gBc5198-http_get.txt') -replace '\\"','"' -replace '\\n',"`n"
function Ctx($s,$p,$n,$cap){ ([regex]::Matches($s,$p) | Select-Object -First $n | ForEach-Object { ($_.Value -replace '\s+',' ').Substring(0,[Math]::Min($cap,$_.Value.Length)) }) }
"webp contexts in listing:"
Ctx $lst2 '.{0,70}webp.{0,70}' 6 150 | ForEach-Object { "   $_" }
"webp contexts in article:"
Ctx $art '.{0,70}webp.{0,70}' 6 150 | ForEach-Object { "   $_" }
"fm= params in article: $((([regex]::Matches($art,'fm=[a-z]+') | ForEach-Object { $_.Value } | Sort-Object -Unique)) -join ' ')"
"avif anywhere: $((([regex]::Matches($art,'avif') | ForEach-Object { $_.Value } | Sort-Object -Unique)) -join ' ')"

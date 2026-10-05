$art = (Get-Content -Raw -LiteralPath '.tnega/spill/http_get-call_02_kOxIMYhmPwqT5GYxLr6r3061-http_get.txt') -replace '\\"','"' -replace '\\n',"`n"
$lst = (Get-Content -Raw -LiteralPath '.tnega/spill/http_get-call_00_xtuxWa4GA7oV2ICa8gBc5198-http_get.txt') -replace '\\"','"' -replace '\\n',"`n"

function Cnt($s,$p){ ([regex]::Matches($s,$p)).Count }
function Sample($s,$p,$n,$cap){
  ([regex]::Matches($s,$p) | ForEach-Object { $_.Value }) | Sort-Object -Unique | Select-Object -First $n | ForEach-Object { $_.Substring(0,[Math]::Min($cap,$_.Length)) }
}
function First($s,$p,$cap){
  $m = [regex]::Match($s,$p); if($m.Success){ ($m.Value -replace '\s+',' ').Substring(0,[Math]::Min($cap,$m.Value.Length)) } else { '' }
}

"=== len article=$($art.Length) listing=$($lst.Length) ==="
"--- ARTICLE head meta ---"
Sample $art '<meta[^>]{0,400}>' 40 300 | Where-Object { $_ -match 'og:|twitter:|description|author|article|time' } | ForEach-Object { "   $_" }
"canonical=$((Cnt $art 'rel="canonical"')) hreflang=$((Cnt $art 'hreflang'))"
"title: $((First $art '<title[^>]*>[^<]*' 160))"
"relpreload/preconnect = $((Cnt $art 'rel="(preload|preconnect|dns-prefetch)"'))"
"--- preload tags ---"
Sample $art 'rel="preload"[^>]{0,220}' 8 260 | ForEach-Object { "   $_" }
"--- ARTICLE anatomy ---"
"h1=$(Cnt $art '<h1') h2=$(Cnt $art '<h2') h3=$(Cnt $art '<h3') pre=$(Cnt $art '<pre') code=$(Cnt $art '<code') table=$(Cnt $art '<table') figure=$(Cnt $art '<figure') blockquote=$(Cnt $art '<blockquote') video=$(Cnt $art '<video') img=$(Cnt $art '<img')"
"shiki=$(Cnt $art 'shiki') prism=$((Cnt $art '(?i)prism')) hljs=$(Cnt $art 'hljs') language-=$(Cnt $art 'language-') jsonld=$(Cnt $art 'application/ld\+json')"
"h1 text: $((First $art '<h1[^>]*>[\s\S]{0,160}' 200))"
"--- pre open tags ---"
Sample $art '<pre[^>]*>' 6 300 | ForEach-Object { "   $_" }
"--- img tags ---"
Sample $art '<img[^>]{0,600}>' 6 380 | ForEach-Object { "   $_" }
"--- ctfassets urls ---"
Sample $art 'images\.ctfassets\.net[^"'' ]{0,160}' 8 180 | ForEach-Object { "   $_" }
"srcset=$(Cnt $art 'srcset=') loadinglazy=$(Cnt $art 'loading="lazy"')"
"--- toc/share/related words ---"
Sample $art '(?i)(table of contents|on this page|jump to|copy link|min read|reading time|share)' 12 40 | ForEach-Object { "   $_" }
"--- h2 samples ---"
Sample $art '<h2[^>]*>[^<]{0,120}' 6 140 | ForEach-Object { "   $_" }
""
"=== LISTING ==="
"index links total=$((Cnt $lst 'href="/index/[^"]*"')) unique=$((Sample $lst 'href="/index/[^"]*"' 999 999).Count)"
Sample $lst 'href="/index/[^"]*"' 16 90 | ForEach-Object { "   $_" }
"ariaLabel: $((First $lst 'ariaLabel":"[^"]{0,120}' 200))"
"time elements=$(Cnt $lst '<time')"
"Load more ctx: $((First $lst '[\s\S]{0,120}Load more[\s\S]{0,200}' 340))"
"skip/limit tokens: $((Sample $lst '"(skip|limit)":[0-9]+' 6 30) -join ' ')"
"filter ctx: $((First $lst '[\s\S]{0,100}[Ff]ilter[\s\S]{0,220}' 340))"
"pagination words: $((Sample $lst '(?i)(load more|next page|previous|pagination|show more)' 8 40) -join ' | ')"
"search words: $((Sample $lst '(?i)(open search|close search|type="search")' 8 60) -join ' | ')"
"a11y main=$(Cnt $lst '<main') skip=$((Cnt $lst '(?i)skip to')) arialabel=$(Cnt $lst 'aria-label=') time=$(Cnt $lst '<time')"
"news links: $((Sample $lst 'href="/news/[^"]*"' 10 80) -join ' | ')"
"tailwind classes: $((Sample $lst 'class="[^"]{0,120}' 4 140) -join ' | ')"

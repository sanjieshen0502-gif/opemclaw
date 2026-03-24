## SKILL.md

Integration of 17 search engines for web crawling without API keys.

## Search Engines

### Domestic (8)

- Baidu: https://www.baidu.com/s?wd={keyword}

- Bing CN: https://cn.bing.com/search?q={keyword}&ensearch=0

- Bing INT: https://cn.bing.com/search?q={keyword}&ensearch=1

- 360: https://www.so.com/s?q={keyword}

- Sogou: https://sogou.com/web?query={keyword}

- WeChat: https://wx.sogou.com/weixin?type=2&query={keyword}

- Toutiao: https://so.toutiao.com/search?keyword={keyword}

- Jisilu: https://www.jisilu.cn/explore/?keyword={keyword}

### International (9)

- Google: https://www.google.com/search?q={keyword}

- Google HK: https://www.google.com.hk/search?q={keyword}

- DuckDuckGo: https://duckduckgo.com/html/?q={keyword}

- Yahoo: https://search.yahoo.com/search?p={keyword}

- Startpage: https://www.startpage.com/sp/search?query={keyword}

- Brave: https://search.brave.com/search?q={keyword}

- Ecosia: https://www.ecosia.org/search?q={keyword}

- Qwant: https://www.qwant.com/?q={keyword}

- WolframAlpha: https://www.wolframalpha.com/input?i={keyword}

## Quick Examples

// Basic search
web_fetch({"url": "https://www.google.com/search?q=python+tutorial"})

// Site-specific
web_fetch({"url": "https://www.google.com/search?q=site:github.com+react"})

// File type
web_fetch({"url": "https://www.google.com/search?q=machine+learning+filetype:pdf"})

// Time filter (past week)
web_fetch({"url": "https://www.google.com/search?q=ai+news&tbs=qdr:w"})

// Privacy search
web_fetch({"url": "https://duckduckgo.com/html/?q=privacy+tools"})

// DuckDuckGo Bangs
web_fetch({"url": "https://duckduckgo.com/html/?q=!gh+tensorflow"})

// Knowledge calculation
web_fetch({"url": "https://www.wolframalpha.com/input?i=100+USD+to+CNY"})

## Advanced Operators

OperatorExampleDescription
site:site:github.com pythonSearch within site
filetype:filetype:pdf reportSpecific file type
""machine learning"Exact match
-python -snakeExclude term
ORcat OR dogEither term

## Time Filters

ParameterDescription
tbs=qdr:hPast hour
tbs=qdr:dPast day
tbs=qdr:wPast week
tbs=qdr:mPast month
tbs=qdr:yPast year

## Privacy Engines

- DuckDuckGo: No tracking

- Startpage: Google results + privacy

- Brave: Independent index

- Qwant: EU GDPR compliant

## Bangs Shortcuts (DuckDuckGo)

BangDestination
!gGoogle
!ghGitHub
!soStack Overflow
!wWikipedia
!ytYouTube

## WolframAlpha Queries

- Math: integrate x^2 dx

- Conversion: 100 USD to CNY

- Stocks: AAPL stock

- Weather: weather in Beijing

## Documentation

- references/advanced-search.md - Domestic search guide

- references/international-search.md - International search guide

- CHANGELOG.md - Version history

## License

MIT
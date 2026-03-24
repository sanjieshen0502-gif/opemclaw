# Web Content Fetcher — 网页内容获取工具

当常规 `web_fetch` / `web_search` 无法获取内容时，使用替代服务获取网页 Markdown 格式内容。

## 支持的服务

| 优先级 | 服务 | 用法 | 适用场景 |
|--------|------|------|---------|
| 1 | Jina AI | `https://r.jina.ai/{url}` | 最稳定，通用性强 |
| 2 | markdown.new | `https://markdown.new/{url}` | Cloudflare 保护网站 |
| 3 | defuddle.md | `https://defuddle.md/{url}` | 备用方案 |

## 使用方法

### 直接调用（推荐）

当需要获取网页内容时，按顺序尝试：

1. 首先用 `web_fetch` 尝试获取
2. 如果失败或被过滤，使用 Jina AI 模式

```
https://r.jina.ai/https://example.com
https://r.jina.ai/https://news.example.com/article/123
```

### OpenClaw 内置方式

OpenClaw 的 `web_fetch` 工具已支持 Jina AI，可以直接使用。

**示例用法：**
- 用户: "帮我获取 https://news.example.com/article/123 的内容"
- 助手: 使用 `web_fetch` 工具抓取内容

## 使用场景

- 微博、知乎等需要登录的网站（直接抓取失败时）
- 被 Cloudflare 或反爬虫保护的网站
- 普通 `web_fetch` 返回 403/401/空内容时
- 视频页面、动态加载的内容

## 脚本使用（适用于 Linux/macOS）

```bash
# 使用 Jina AI（首选）
./fetch.sh https://example.com

# 使用 markdown.new
./fetch.sh https://example.com markdown

# 使用 defuddle.md
./fetch.sh https://example.com defuddle
```

## 限制说明

- 仅能获取**公开可访问**的网页内容
- 付费内容、登录后才能访问的内容无法抓取
- 部分网站有反爬虫机制，可能失败
- 请遵守网站的 robots.txt 和使用条款

让网页内容获取不再受限 🌐

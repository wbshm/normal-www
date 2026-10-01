# 首版验证记录

日期：2026-10-01。范围：Normal Apps 官网；未修改 Anglepop App。

## 构建与静态访问

- Node.js 24.19.0；Astro 7.3.5。
- `npm run check`：18 个检查文件，0 errors / 0 warnings / 0 hints。
- `npm run build`：8 个内容页面及 404 页面、sitemap、robots 成功生成。
- `npm run verify`：9 个 HTML 页面、211 个站内链接与资源、canonical、双语 alternate、目录锚点、政策邮箱和日期全部通过。
- 页面不输出客户端脚本，内容和语言切换均由静态 HTML 提供。

本机沙箱验证时使用 `ASTRO_TELEMETRY_DISABLED=1`，避免构建工具在工作区以外创建偏好目录；CI 同样禁用工具遥测。

## 浏览器验证

使用 Chrome，关闭 JavaScript，分别在 360px、390px、1280px 宽度直接访问和刷新全部 8 个内容页面，共 24 个场景：

- 所有页面 HTTP 200。
- 图片成功加载，无横向页面溢出。
- 文档语言正确，语言按钮保持当前 App 和文档类型。
- 英文政策切换中文后，继续打开中文支持页成功。
- 政策全文可读取、导航与目录锚点可使用。
- 桌面首页、手机首页与产品页截图经过视觉检查。

## 扩展与保留地址

在临时配置和文档中添加一款 `tool`，设为 `available`、截图数组为空：不修改模板，六个页面全部生成，下载按钮正确显示，首页回退为图标，详情页省略截图区域。

将 Anglepop 临时设为 `archived`：首页卡片隐藏，原有介绍、隐私和支持页面保留。检查通过后已删除全部测试内容、恢复正式配置，并重新完成类型检查、生产构建和静态验证。

## 发布后的核验

GitHub Pages 启用并完成部署后执行：

```sh
SITE_ORIGIN=https://wbshm.github.io npm run verify
```

该命令会检查所有正式内容页面、sitemap 和 robots 的公开 HTTP 响应。仅本地构建通过不能替代公开地址验证。

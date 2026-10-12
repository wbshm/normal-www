# Normal Apps

独立开发者的中英双语产品官网。收录 Anglepop 和打卡鸭（CheckInDuck），每款 App 提供介绍、独立隐私政策和用户支持页面。Astro 生成静态 HTML，所有内容和导航均无需客户端 JavaScript。

## 本地开发

需要 **Node.js 24 LTS**（最低 22.12）和 npm 9.6.5 或更新版本。

```sh
npm ci
npm run dev
```

开发地址为 `http://localhost:4321/normal-www/`。验证生产构建：

```sh
npm run check
npm run build
npm run verify
npm run preview
```

`verify` 检查静态页面、站内链接与资源、目录锚点、部署前缀、双语 alternate、canonical、政策日期、联系方式和 sitemap。页面不允许含客户端脚本或占位内容。

## 发布地址

| 页面 | 英文 | 中文 |
|---|---|---|
| 首页 | https://wbshm.github.io/normal-www/ | https://wbshm.github.io/normal-www/zh/ |
| Anglepop | https://wbshm.github.io/normal-www/apps/anglepop/ | https://wbshm.github.io/normal-www/zh/apps/anglepop/ |
| 隐私政策 | https://wbshm.github.io/normal-www/apps/anglepop/privacy/ | https://wbshm.github.io/normal-www/zh/apps/anglepop/privacy/ |
| 用户支持 | https://wbshm.github.io/normal-www/apps/anglepop/support/ | https://wbshm.github.io/normal-www/zh/apps/anglepop/support/ |
| 打卡鸭 | https://wbshm.github.io/normal-www/apps/checkinduck/ | https://wbshm.github.io/normal-www/zh/apps/checkinduck/ |
| 打卡鸭隐私政策 | https://wbshm.github.io/normal-www/apps/checkinduck/privacy/ | https://wbshm.github.io/normal-www/zh/apps/checkinduck/privacy/ |
| 打卡鸭用户支持 | https://wbshm.github.io/normal-www/apps/checkinduck/support/ | https://wbshm.github.io/normal-www/zh/apps/checkinduck/support/ |

GitHub 仓库中选择 **Settings → Pages → Source → GitHub Actions**。提交到 `main` 后，工作流执行类型检查、构建、静态验证，再发布到 Pages。PR 只检查、不发布，也可在 Actions 中手动运行。

发布后执行 HTTP 验证：

```sh
SITE_ORIGIN=https://wbshm.github.io npm run verify
```

`astro.config.mjs` 中的 `site` 和 `base` 是公开网址的来源。组件使用 `src/lib/urls.ts` 生成站内路径，避免丢失 `/normal-www/` 前缀。Markdown 中同一 App 内跳转用相对地址，例如支持页的 `../privacy/`。

## 新增一款 App

1. 在 `src/data/apps.json` 添加配置，可复制 Anglepop 条目：
   - `slug`：永久小写英文标识，只允许字母、数字、连字符，发布后不改。
   - `category`：`game` 或 `tool`。
   - `status`：`coming-soon`、`available` 或 `archived`。
   - `icon`、`screenshots`：文件放在 `public/images/{slug}/`，配置用 `/images/...` 逻辑路径。
   - `platform`、`requirement`、六位十六进制 `accent`。`appStoreUrl` 可省略；状态为 `available` 时必须填写已核实的 App Store 地址。
   - `locales.en` 和 `locales.zh`：名称、标语、简介、亮点。截图提供双语说明。
2. 添加六份 Markdown：`src/content/apps/{slug}/{en,zh}/{overview,privacy,support}.md`。
3. frontmatter 填 `app`、`locale`、`kind`、`title`、`description`。双语政策另填相同的 `updated: "YYYY-MM-DD"` 生效日期。
4. 执行 `npm run check && npm run build && npm run verify`，确认文案、真实数据处理情况和图片，再提交。

页面与 sitemap 自动生成，无需改模板。`screenshots` 可为空，此时省略截图区、首页使用图标。每款 App 的截图语言说明由配置提供。

## 上线、改名与停止下载

- 确认商店页公开可访问后，才改为 `available`。默认 `coming-soon`，不显示可点击的下载按钮。
- 改名只改双语名称，保留 slug；政策地址不含版本号或日期。
- 下架改为 `archived`，从首页隐藏；介绍、政策和支持页面继续保留，不删除配置或文档。
- 若有已提交的旧政策或支持 URL，保留旧页面或文件并指向新地址。旧仓库文件链接不能只靠新站重定向兼容。

## Anglepop 上架接入

App Store Connect 填英文政策与支持 URL；Marketing URL 可填英文介绍页。Anglepop 设置页添加「隐私政策」和「联系支持」入口，分别打开对应页面。本仓库只负责官网，未改动 iOS 客户端。

官网按当前实现描述：本机进度、288 主线关、75 内置每日挑战轮转、每天主动免费领取 1 张提示卡、历史轨迹一次性内购。价格由 App Store 展示。官网未宣传尚未开放的提示卡购买、云同步或永久轨迹档案。

公开署名 **Normal Apps**，邮箱 **wrq142857@gmail.com**，在 `src/data/site.ts` 维护。正文也包含邮箱，修改时同步更新 Markdown。后续增加 SDK、广告、在线功能或改变邮件处理方式时，应更新双语政策和生效日期。

## 素材来源

图标来自 Anglepop 现行 `AppIcon.png`；截图来自实际运行的首页、游戏中和选关界面。网站仅压缩截图为 WebP，未改 App 工程。使用系统字体，不加载远程字体、广告或分析脚本。

打卡鸭的介绍、权限边界、隐私政策和支持内容来自 [CheckInDuck-WWW](https://github.com/wbshm/CheckInDuck-WWW)，迁入版本为 `0b89b0ae808b589e06b322c8832ea4f3ec448a3d`。使用源仓库 `appstore.png` 图标和六张 `screen/img_*.png` 实际截图，截图压缩为 WebP，保留英文界面。隐私政策沿用原生效日期 `2026-03-29`，新增对应中文版本。iOS 16 最低版本依据本机 CheckInDuck App 工程的部署设置确认。

打卡鸭已在 App Store 上线，2026-10-12 核实中国及美国商店均可查询，下载地址为 [CheckInDuck / 打卡鸭](https://apps.apple.com/app/id6760517368)，状态为 `available`。中英首页和介绍页均提供下载按钮。原仓库和旧站地址未修改；App Store Connect 或 App 内的官网、隐私与支持入口可使用本仓库对应地址。迁入详情见 [打卡鸭迁入记录](docs/CHECKINDUCK-MIGRATION.md)。

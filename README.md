# 啵啵的猫粮计划

独立开发者的中英双语产品官网。收录 Anglepop、打卡鸭（CheckInDuck）、牌感（TileSense）、枫誓（MapleOath）和 Dayweave。每款 App 提供介绍、独立隐私政策和用户支持页面。牌感另有日文隐私政策，Dayweave 另有德语介绍、隐私政策和支持页面。Astro 生成静态 HTML，所有内容和导航均无需客户端 JavaScript；截图弹窗使用一个本地脚本增强交互。

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

`verify` 检查静态页面、站内链接与资源、目录锚点、部署前缀、语言 alternate、canonical、政策日期、联系方式和 sitemap，并检查所有 App 的首页卡片、截图语言与大图入口、牌感三语政策以及枫誓政策的日期和完整性。仅截图区允许加载本地 `screenshot-lightbox.js` 模块，不允许其他客户端脚本、内联脚本或占位内容。

## 发布地址

| 页面 | 英文 | 中文 |
|---|---|---|
| 首页 | https://wangrq.cn/ | https://wangrq.cn/zh/ |
| Anglepop | https://wangrq.cn/apps/anglepop/ | https://wangrq.cn/zh/apps/anglepop/ |
| 隐私政策 | https://wangrq.cn/apps/anglepop/privacy/ | https://wangrq.cn/zh/apps/anglepop/privacy/ |
| 用户支持 | https://wangrq.cn/apps/anglepop/support/ | https://wangrq.cn/zh/apps/anglepop/support/ |
| 打卡鸭 | https://wangrq.cn/apps/checkinduck/ | https://wangrq.cn/zh/apps/checkinduck/ |
| 打卡鸭隐私政策 | https://wangrq.cn/apps/checkinduck/privacy/ | https://wangrq.cn/zh/apps/checkinduck/privacy/ |
| 打卡鸭用户支持 | https://wangrq.cn/apps/checkinduck/support/ | https://wangrq.cn/zh/apps/checkinduck/support/ |
| 牌感 | https://wangrq.cn/apps/tilesense/ | https://wangrq.cn/zh/apps/tilesense/ |
| 牌感隐私政策 | https://wangrq.cn/apps/tilesense/privacy/ | https://wangrq.cn/zh/apps/tilesense/privacy/ |
| 牌感用户支持 | https://wangrq.cn/apps/tilesense/support/ | https://wangrq.cn/zh/apps/tilesense/support/ |
| 枫誓 | https://wangrq.cn/apps/mapleoath/ | https://wangrq.cn/zh/apps/mapleoath/ |
| 枫誓隐私政策 | https://wangrq.cn/apps/mapleoath/privacy/ | https://wangrq.cn/zh/apps/mapleoath/privacy/ |
| 枫誓用户支持 | https://wangrq.cn/apps/mapleoath/support/ | https://wangrq.cn/zh/apps/mapleoath/support/ |
| Dayweave | https://wangrq.cn/apps/dayweave/ | https://wangrq.cn/zh/apps/dayweave/ |
| Dayweave 隐私政策 | https://wangrq.cn/apps/dayweave/privacy/ | https://wangrq.cn/zh/apps/dayweave/privacy/ |
| Dayweave 用户支持 | https://wangrq.cn/apps/dayweave/support/ | https://wangrq.cn/zh/apps/dayweave/support/ |

Dayweave 德语版提供[介绍](https://wangrq.cn/de/apps/dayweave/)、[隐私政策](https://wangrq.cn/de/apps/dayweave/privacy/)和[用户支持](https://wangrq.cn/de/apps/dayweave/support/)。

牌感隐私政策的发布路径：

| 语言 | 地址 |
|---|---|
| 简体中文 | https://wangrq.cn/zh/apps/tilesense/privacy/ |
| English | https://wangrq.cn/apps/tilesense/privacy/ |
| 日本語 | https://wangrq.cn/ja/apps/tilesense/privacy/ |

主站部署到 **https://wangrq.cn/**。本机已经安装 `post-commit` hook，`main` 分支每次提交成功后自动构建已提交版本并通过 SSH 发布。部署失败不会撤销提交，修复后执行 `npm run deploy` 重试。SSH、服务器初始化、证书续期与回滚说明见 [部署文档](docs/DEPLOYMENT.md)。

同时保留原 GitHub Pages 地址 `https://wbshm.github.io/normal-www/`。GitHub 仓库中选择 **Settings → Pages → Source → GitHub Actions**。推送到 `main` 后，工作流执行类型检查、构建、静态验证，再发布到 Pages。PR 只检查、不发布，也可在 Actions 中手动运行。

发布后执行 HTTP 验证：

```sh
ASTRO_SITE=https://wangrq.cn ASTRO_BASE=/ npm run build
ASTRO_SITE=https://wangrq.cn ASTRO_BASE=/ SITE_ORIGIN=https://wangrq.cn npm run verify
```

`astro.config.mjs` 默认构建 GitHub Pages 的 `/normal-www/` 前缀；服务器发布设置 `ASTRO_SITE=https://wangrq.cn ASTRO_BASE=/`。组件使用 `src/lib/urls.ts` 生成站内路径，canonical、sitemap 和 robots 随目标同步切换。Markdown 中同一 App 内跳转用相对地址，例如支持页的 `../privacy/`。

## 新增一款 App

1. 在 `src/data/apps.json` 添加配置，可复制 Anglepop 条目：
   - `slug`：永久小写英文标识，只允许字母、数字、连字符，发布后不改。
   - `category`：`game` 或 `tool`。
   - `status`：`coming-soon`、`available` 或 `archived`。
   - `icon`、`screenshots`：文件放在 `public/images/{slug}/`，配置用 `/images/...` 逻辑路径。截图的 `src` 可以是共用路径，或包含 `en` 和可选 `zh`、`de` 图片路径的对象。未指定本地化图片时使用 `en` 图片。`width`、`height` 可填写图片实际尺寸，默认 780 × 1688。已合成的宣传图设置 `screenshotStyle: "poster"`，会保留完整画面并使用适合阅读的移动端布局。
   - `platform`、`requirement`、六位十六进制 `accent`。`appStoreUrl` 可省略；状态为 `available` 时必须填写已核实的 App Store 地址。
   - `locales.en` 和 `locales.zh`：名称、标语、简介、亮点。可选 `locales.de`，并提供对应的截图说明。
2. 添加 `src/content/apps/{slug}/{en,zh}/{overview,privacy,support}.md`。启用德语时，在 `de/` 下再添加对应的三份 Markdown。
3. frontmatter 填 `app`、`locale`、`kind`、`title`、`description`。各语言的隐私政策另填相同的 `updated: "YYYY-MM-DD"` 生效日期。
4. 执行 `npm run check && npm run build && npm run verify`，确认文案、真实数据处理情况和图片，再提交。

页面与 sitemap 自动生成，无需改模板。所有产品介绍页统一使用「精简产品信息 → 单行横向截图 → 详细介绍 → 支持入口」顺序。截图支持触摸滑动、横向滚动和键盘方向键，使用 CSS 滚动吸附对齐。点击图片会在当前页的原生 `dialog` 弹窗中放大，支持前后切图、方向键、Esc、关闭按钮和遮罩关闭，并恢复焦点；脚本不可用时保留原始大图链接。弹窗逻辑位于 `public/scripts/screenshot-lightbox.js`，由共享的 `ScreenshotGallery.astro` 组件加载，无第三方依赖。`screenshots` 可为空，此时省略截图区、首页使用图标。每款 App 的截图语言说明由配置提供。

## 牌感与额外政策语言

牌感与另外两个 App 使用相同的首页卡片、介绍页和用户支持模板。产品资料、图标及截图来自本机 `/Users/wangrq/Documents/Project/Ma`，最低 iOS 17 依据 Xcode 工程确认。牌感已在 App Store 上线，状态为 `available`，中英文首页和介绍页均提供下载按钮，地址使用 Apple 官方接口返回的[美区商品页](https://apps.apple.com/us/app/tilesense-mahjong-trainer/id6830058870)。

2026-11-14 通过 Apple Lookup API 核实美国、日本商店均可查询，App ID 为 `6830058870`，Bundle ID 为 `com.wang.TileSense`，开发者为「瑞庆 王」，当前版本为 1.1。中国区当日未查询到该 App；当前网络访问通用链接及美区网页会跳转中国区商店首页，不据此声称中国区可下载。介绍页和支持页同步说明六种界面语言（简体中文、英文、日文、韩文、印尼文、马来文）与默认关闭的每日练习提醒，提醒行为已核对本地 App 实现。

`src/data/policies.ts` 的 `policyApps` 登记政策翻译，可为完整产品补充额外语言，也可接入只有政策的 App。与产品重复的中英文政策只生成一次；首页仅为尚未接入完整产品的 App 单独显示政策卡片。

牌感政策正文位于 `src/content/apps/tilesense/{en,zh,ja}/privacy.md`，原有三个 URL 保持不变，政策页面可互相切换语言。日文政策的产品介绍与支持导航指向英文页面，不生成日文首页、介绍页或支持页。修改正文时同步核对三种语言、公开署名、邮箱和 `updated` 日期，并运行类型检查、构建和静态验证。

牌感政策依据开发者提供的数据处理事实撰写：无需账号、学习进度及设置仅在本地保存、不收集或上传个人信息、无第三方统计/广告/崩溃收集 SDK、不追踪或共享 App 数据，支付仅由 Apple 处理的一次性应用内购买。开发者公开署名和联系方式沿用本网站的 **啵啵的猫粮计划** 与 **wrq142857@gmail.com**；三语生效日期均为 **2026-11-03**。政策 Markdown 已从原草稿目录移入站点内容目录，后续以该目录为准。

## 上线、改名与停止下载

- 确认商店页公开可访问后，才改为 `available`。默认 `coming-soon`，不显示可点击的下载按钮。
- 改名只改双语名称，保留 slug；政策地址不含版本号或日期。
- 下架改为 `archived`，从首页隐藏；介绍、政策和支持页面继续保留，不删除配置或文档。
- 若有已提交的旧政策或支持 URL，保留旧页面或文件并指向新地址。旧仓库文件链接不能只靠新站重定向兼容。

## 枫誓接入

枫誓的中英文介绍、隐私政策和用户支持位于 `src/content/apps/mapleoath/{en,zh}/`。产品文案依据 `/Users/wangrq/Documents/Project/MapleOath/docs/appstore/上架材料.md`，支持说明同时核对本地 App 的设置、学习进度和购买实现。iPhone、iOS 17+ 依据 Xcode 工程确认。当前标记为 `coming-soon`；取得公开的 App Store 地址后，在 `src/data/apps.json` 填写 `appStoreUrl` 并切换为 `available`。

隐私政策保留提供的中英文正文和 2026-11-15 日期，支持邮箱使用网站已有的 `wrq142857@gmail.com`。英文隐私政策、支持页和介绍页可分别用于 App Store Connect 的 Privacy Policy URL、Support URL 和 Marketing URL。

图标来自 `MapleOath/Assets.xcassets/AppIcon.appiconset/AppIcon.png`；12 张宣传图来自 `docs/appstore/screenshots/{en,zh-Hans}/1.png` 至 `6.png`，按原比例缩为 880 × 1912 的 WebP，保留标题、配色与放大区域。英文页面使用英文图，中文页面使用中文图，图片可点开查看。第 5 张中的信息核实日期为 2026-11-15，已在截图说明中标注。

## Anglepop 上架接入

App Store Connect 填英文政策与支持 URL；Marketing URL 可填英文介绍页。Anglepop 设置页添加「隐私政策」和「联系支持」入口，分别打开对应页面。本仓库只负责官网，未改动 iOS 客户端。

官网按当前实现描述：本机进度、288 主线关、75 内置每日挑战轮转、每天主动免费领取 1 张提示卡、历史轨迹一次性内购。价格由 App Store 展示。官网未宣传尚未开放的提示卡购买、云同步或永久轨迹档案。

公开署名 **啵啵的猫粮计划**，邮箱 **wrq142857@gmail.com**，在 `src/data/site.ts` 维护。正文也包含邮箱，修改时同步更新 Markdown。后续增加 SDK、广告、在线功能或改变邮件处理方式时，应更新双语政策和生效日期。

## 素材来源

图标来自 Anglepop 现行 `AppIcon.png`；截图来自实际运行的首页、游戏中和选关界面。网站仅压缩截图为 WebP，未改 App 工程。使用系统字体，不加载远程字体、广告或分析脚本。

牌感图标来自 `Ma/TileSense/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png`；五张截图来自 `Ma/docs/appstore/screenshots/raw/zh-Hans/`，按比例压缩为 WebP，展示课程路径、答题图解、入门讲解、手牌分析和练习。中英文介绍依据 `Ma/docs/appstore/metadata.json`，支持内容依据 `Ma/docs/appstore/site/support.html`，免费范围与购买方式同时核对 `TileSense/Store/Access.swift` 和 `PaywallView.swift`。未修改 Ma 工程或已有隐私政策正文。

打卡鸭的介绍、权限边界、隐私政策和支持内容来自 [CheckInDuck-WWW](https://github.com/wbshm/CheckInDuck-WWW)，迁入版本为 `0b89b0ae808b589e06b322c8832ea4f3ec448a3d`。使用源仓库 `appstore.png` 图标和六张 `screen/img_*.png` 实际截图，截图压缩为 WebP，保留英文界面。隐私政策沿用原生效日期 `2026-03-29`，新增对应中文版本。iOS 16 最低版本依据本机 CheckInDuck App 工程的部署设置确认。

打卡鸭已在 App Store 上线，2026-10-12 核实中国及美国商店均可查询，下载地址为 [CheckInDuck / 打卡鸭](https://apps.apple.com/app/id6760517368)，状态为 `available`。中英首页和介绍页均提供下载按钮。原仓库和旧站地址未修改；App Store Connect 或 App 内的官网、隐私与支持入口可使用本仓库对应地址。迁入详情见 [打卡鸭迁入记录](docs/CHECKINDUCK-MIGRATION.md)。

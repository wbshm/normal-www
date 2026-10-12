# 打卡鸭官网迁入记录

日期：2026-10-10。

## 来源与范围

源仓库：[wbshm/CheckInDuck-WWW](https://github.com/wbshm/CheckInDuck-WWW)，版本 `0b89b0ae808b589e06b322c8832ea4f3ec448a3d`。

- `index.html`：自动打卡、任务规则、提醒、日历备注、小组件与 Premium 功能说明。
- `privacy.html`：权限与监测范围、保存的数据、小组件共享状态、购买与支持提交、保留和用户控制。政策生效日期保留为 2026-03-29。
- `support.html`：任务、权限、购买与恢复、隐私和反馈支持，邮箱保持为 `wrq142857@gmail.com`。
- `appstore.png` 与 `screen/img_1.png` 至 `screen/img_6.png`：原图标与六张实际界面截图。仅调整资源体积，不改变截图内容。

在现有 Astro 网站中新增永久标识 `checkinduck`，中文名「打卡鸭」，英文名「CheckInDuck」。新增首页卡片、中英介绍、中英隐私和中英支持。文案面向普通用户，不迁入原站的审核说明。Premium 保留源站确认的功能，不另行声明价格、购买期限或免费任务额度。

最低系统版本 iOS 16 来自本机 `CheckInDuck.xcodeproj/project.pbxproj` 的主 App 部署设置。迁入时源网站未提供 App Store 地址，因此最初使用 `coming-soon` 状态。

## 地址

| 页面 | 英文路径 | 中文路径 |
|---|---|---|
| 介绍 | `/normal-www/apps/checkinduck/` | `/normal-www/zh/apps/checkinduck/` |
| 隐私 | `/normal-www/apps/checkinduck/privacy/` | `/normal-www/zh/apps/checkinduck/privacy/` |
| 支持 | `/normal-www/apps/checkinduck/support/` | `/normal-www/zh/apps/checkinduck/support/` |

发布域名为 `https://wbshm.github.io`。旧网站位于另一个仓库，本次未修改或重定向旧站；已提交给 Apple 的旧地址继续依赖旧站保留。新站发布后，再将 App Store Connect 和 App 内入口切换到对应新地址。

## 验证

验证结果：

- `npm run check`：18 个检查文件，0 errors / 0 warnings / 0 hints。
- `npm run build`：15 个 HTML 页面成功生成。
- `npm run verify`：15 个 HTML 页面、385 个站内链接和资源，以及 canonical、双语 alternate、目录锚点、sitemap、政策日期与邮箱全部通过。
- Chrome 禁用 JavaScript，在 360px、390px、1280px 宽度检查全部 14 个中英文内容页面，共 42 个场景：HTTP 200、图片加载、页面和产品标题宽度、文档语言、语言切换地址全部通过。
- 浏览器实际点击英文隐私页 → 中文隐私页 → 中文支持页，导航通过。打卡鸭的桌面卡片与窄屏英文首屏已目视检查；窄屏标题字号适配较长的英文名。
- 七份原始图片均与源仓库 Git blob 校验一致。图标缩至 512px，截图缩至 780px 宽并转换为 WebP，总资源体积约 564KB；无内容修改。

## App Store 上线更新

2026-10-12，通过 Apple 官方查询接口核实中国和美国商店均已上线：应用 ID `6760517368`，Bundle ID `com.wang.CheckInDuck`，最低 iOS 版本 16.0。

下载链接设为 `https://apps.apple.com/app/id6760517368`，不固定商店地区，由 App Store 处理地区选择。状态改为 `available`，中英首页与介绍页显示正式下载按钮。

# wangrq.cn 部署

主站为 <https://wangrq.cn/>，保留 GitHub Pages 的原地址与 Actions 工作流。本机通过 `wangrq` 用户的现有 SSH 密钥连接服务器；服务器只接收生成的静态文件，无需安装 Node.js。

## 提交后自动发布

本机已设置 `git config --local core.hooksPath .githooks`。在 `main` 分支执行 `git commit` 后，`post-commit` 同步执行：

1. 用 `git archive HEAD` 创建独立快照，不包含工作区未提交或未跟踪文件。
2. 根据锁文件运行 `npm ci`，然后类型检查、构建、静态链接验证。
3. 通过 SSH/rsync 上传到 `/var/www/normal-www/releases/时间戳-提交号-进程号/`。
4. 原子切换 `current` 符号链接，验证 HTTPS 首页及版本标记。验证失败自动恢复上一版本。

其他分支、detached HEAD 和 rebase 过程不会自动发布；rebase 结束后可手动发布。发布失败不会撤销已经成功的 Git 提交，终端会显示错误。网络中断时先恢复网络，再重试：

```sh
npm run deploy
```

手动命令也只发布当前 **HEAD 提交**，因此首次使用前须把新增部署文件与构建配置一起提交。当前工作区更改不会因手动发布而上线。手动发布不限制分支，执行前自行确认 HEAD。

临时跳过一次自动发布：

```sh
SKIP_DEPLOY=1 git commit -m "message"
```

Git 客户端未加载交互式 shell 时，脚本会查找已安装的 fnm/nvm/Homebrew Node.js（22.12+ 的 22 LTS 或 24+）。也可指定 `DEPLOY_NODE_BIN=/absolute/path/to/node/bin`。本机现有 Node 22.23.2 已验证可用。

发布锁位于 `.git/normal-www-deploy.lock`，正常退出会清理。若进程被强制杀死，先确认没有部署进程，再用 `rmdir "$(git rev-parse --git-path normal-www-deploy.lock)"` 清理残留锁。远端切换另外使用 `flock`，防止多台电脑同时操作 `current`。

## 新电脑安装 SSH 和 hook

准备免密密钥，并通过可信渠道核对服务器主机密钥，加入本机 `known_hosts`。配置默认使用 `~/.ssh/id_rsa`，需要其他密钥时先修改 `deploy/ssh_config`。

```sh
npm run deploy:setup
ssh normal-www
```

安装脚本复制 `deploy/ssh_config` 到 `~/.ssh/normal-www.conf`，在 `~/.ssh/config` 顶部添加 Include，保留并备份原配置。`normal-www` 和 `wangrq.cn` 都连接 `wangrq@wangrq.cn:22`；启用严格主机密钥检查、非交互认证、连接超时及保活。已有不同 hooks 路径或 `post-commit` 时，安装脚本会停止，避免覆盖。

Git 不会自动复制本地 `core.hooksPath` 设置，所以每台新电脑需要运行一次安装命令。此 hook 在本机提交时触发；GitHub 网页提交只触发原有 Pages 工作流。

## 服务器初始化

已在 Ubuntu 26.04 上执行。DNS `wangrq.cn` 指向该服务器，公网 80/443 可达。脚本安装 Nginx、Certbot、rsync，不调整 SSH 服务端设置，也不升级整机软件。

```sh
rsync -az deploy/server/ normal-www:/tmp/normal-www-setup/
ssh normal-www 'sudo bash /tmp/normal-www-setup/setup.sh'
```

配置路径为 `/etc/nginx/sites-available/normal-www.conf`，站点根目录为 `/var/www/normal-www/current`，ACME 校验目录为 `/var/www/letsencrypt`。HTTP 自动跳转 HTTPS。脚本重复执行前会备份原配置到 `/var/backups/normal-www/`，先检查 Nginx 配置再重载。证书账户邮箱为项目公开联系方式 `wrq142857@gmail.com`；首次申请时可用 `CERTBOT_EMAIL` 覆盖。

## SSL 证书自动续期

使用系统 `certbot.timer`，每天两次检查，到期前自动续期；不额外创建重复 cron。续期成功后执行 `/etc/letsencrypt/renewal-hooks/deploy/normal-www-nginx`，检查并重载 Nginx。

```sh
# 查看定时任务和证书
ssh normal-www 'systemctl list-timers certbot.timer; sudo certbot certificates'

# 完整模拟续期，并验证续期后的 Nginx 重载
ssh normal-www 'sudo /usr/local/sbin/normal-www-renew --dry-run'

# 手动检查并续期（尚未到期时不会强制重签）
ssh normal-www 'sudo /usr/local/sbin/normal-www-renew'

# 查看最近执行日志
ssh normal-www 'sudo journalctl -u certbot.service -n 50 --no-pager'
```

## 在线验证和回滚

两种构建目标共享源码。默认 `npm run build` 生成 GitHub Pages 版本；主站构建及验证必须同时指定以下环境变量：

```sh
ASTRO_SITE=https://wangrq.cn ASTRO_BASE=/ npm run build
ASTRO_SITE=https://wangrq.cn ASTRO_BASE=/ SITE_ORIGIN=https://wangrq.cn npm run verify
```

服务端保留历史版本，不自动删除。查看当前版本和可回滚目录：

```sh
ssh normal-www 'readlink /var/www/normal-www/current; ls -1 /var/www/normal-www/releases'
```

选择一个此前验证过的实际版本名，用同一个切换脚本回滚（将示例名称替换为上面列出的目录）：

```sh
ssh normal-www 'bash -s -- 20261103T120000Z-0123456789ab-12345' < deploy/server/activate.sh
```

回滚也会做 HTTPS 健康检查。首次上线可直接上传经过主站构建验证的 `dist/`；日常发布统一使用 hook 或 `npm run deploy`，确保源代码可以追溯到提交。

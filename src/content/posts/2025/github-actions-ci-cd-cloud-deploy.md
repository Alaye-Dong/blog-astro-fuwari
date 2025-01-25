---
title: 利用 Github Actions 构建并部署项目到云服务器
published: 2025-01-22
updated: 2025-01-22
description: ""
image: ""
tags:
  - 教程
  - Linux
  - Github
  - 部署
category: 技术
draft: false
---

## 引

本教程将介绍如何通过 GitHub Actions 编译 Astro 项目，并将静态文件通过 SCP 推送到云服务器。虽然是 Astro 项目，但是其他项目的部署也是相通的，改一下脚本就好，有一定参考性。

月初为了自部署 Obsidian 的实时同步，在阿里云购入了服务器和域名，想着既然买都买了，那就正好重建一下博客吧，看来看去选用了 Astro 的 Fuwari 。但是部署到自己服务器时出现了一点问题，服务器是 2 核 2G 的，直接在服务器上编译静态文件再部署，在编译过程中因为服务器配置弱鸡直接就卡崩了，所以就只能在本地笔记本上编译好再把文件发送到服务器上，但是这样也很麻烦，需要手动本地重复编译和上传文件到服务器，于是就开始探究更优雅的方法。最后发现可以使用 Github Actions 来实现当仓库有新的推送时触发自动编译（由 Github 的服务器）和上传得到的静态文件到服务器。

---

## 准备工作

### 1. 生成 SSH 密钥对

在本地生成一对 SSH 密钥，用于 GitHub Actions 和服务器的连接。

```bash
ssh-keygen -t rsa -b 4096 -C "github-actions"
```

- 保存路径建议为 `~/.ssh/github_actions_key`。
- 公钥文件：`github_actions_key.pub`。
- 私钥文件：`github_actions_key`。

### 2. 配置服务器

将生成的公钥添加到服务器的 `~/.ssh/authorized_keys` 文件中：

```bash
echo "你的公钥内容" >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

确认 SSH 服务正常运行：

```bash
sudo systemctl status sshd
```

### 3. 配置 GitHub Secrets

将以下信息添加到 GitHub 仓库的 **Settings > Secrets and variables > Actions > New repository secret**：

| Secret 名称      | 内容                      |
|------------------|---------------------------|
| `SERVER_KEY`     | 私钥内容 (`github_actions_key`) |
| `SERVER_HOST`    | 服务器 IP 或域名           |
| `SERVER_USER`    | SSH 用户名                |
| `SERVER_PORT`    | SSH 端口（默认 22）        |

---

## GitHub Actions 工作流文件

创建工作流文件 `.github/workflows/deploy.yml`：

```yaml
name: Deploy Astro to Cloud Server

on:
  push:
    branches:
      - main  # 监控 main 分支的推送事件

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      # Step 1: 检出代码
      - name: Checkout code
        uses: actions/checkout@v3

      # Step 2: 设置 Node.js 环境
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: ${{ steps.detect-package-manager.outputs.manager }}
          cache-dependency-path: ${{ env.BUILD_PATH }}/${{ steps.detect-package-manager.outputs.lockfile }}

      # Step 3: 安装 pnpm
      - name: Install pnpm
        run: npm install -g pnpm

      # Step 4: 安装依赖并构建
      - name: Install dependencies and build
        run: |
          pnpm install       # 安装依赖
          pnpm run build     # 构建 Astro 项目

      # Step 5: 将静态文件推送到云服务器
      - name: Deploy to Cloud Server
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.SERVER_HOST }}       # 云服务器 IP 或域名
          username: ${{ secrets.SERVER_USER }}   # SSH 用户名
          key: ${{ secrets.SERVER_KEY }}         # 私钥
          port: ${{ secrets.SERVER_PORT }}       # SSH 端口
          source: dist/                          # Astro 输出目录
          target: /www/wwwroot/blog-astro-fuwari/          # 部署到服务器的路径
```

---

## 常见问题与排查

### 1. SSH 连接失败

- **错误信息**：`Permission denied (publickey)`
  - 检查服务器是否正确配置了公钥。
  - 确保私钥权限为 `600` 且对目标文件夹具有写入权限。

- **错误信息**：`ssh: handshake failed: connection reset by peer`
  - 检查服务器防火墙规则，确保允许 SSH 端口（默认 22）。
  - 确保服务器的 SSH 服务正在运行：
    ```bash
    sudo systemctl status sshd
    ```

### 2. SCP 文件上传失败

- **错误信息**：`No such file or directory`
  - 确认目标路径 `/var/www/html/astro/` 是否存在，必要时创建：
    ```bash
    mkdir -p /var/www/html/astro/
    ```

### 3. GitHub Secrets 配置问题

新建一个用于测试的 Action，在 Actions 日志中调试 Secrets 是否正确：

```yaml
name: Test GitHub Secrets

on:
  workflow_dispatch: # 手动触发工作流

jobs:
  test-secrets:
    runs-on: ubuntu-latest

    steps:
      # Step 1: 检出代码
      - name: Checkout code
        uses: actions/checkout@v3

      # Step 2: 创建 SSH 配置文件
      - name: Setup SSH Key
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.SERVER_KEY }}" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          echo -e "Host test-server\n  HostName ${{ secrets.SERVER_HOST }}\n  User ${{ secrets.SERVER_USER }}\n  IdentityFile ~/.ssh/id_rsa\n  StrictHostKeyChecking no" > ~/.ssh/config
          chmod 600 ~/.ssh/config

      # Step 3: 测试 SSH 连接
      - name: Test SSH Connection
        run: ssh test-server "echo 'SSH Connection Successful!'"

      # Step 4: 输出测试结果
      - name: Report Success
        if: success()
        run: echo "Secrets are configured correctly!"
```

## 参考资料

- [使用Github Action 部署项目到云服务器 - 知乎](https://zhuanlan.zhihu.com/p/107545396)
- [通过GitHub Action将博客网站等静态文件同步到云服务器 - 天一生水](https://www.jiangyu.org/github-action-deploy-to-vps/)
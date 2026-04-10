---
title: 新云服务器购买与 1Panel 配置指南
published: 2026-04-10
updated: 2026-04-10
description: ""
image: ""
tags:
  - Linux
  - DevOps
category: 技术
draft: false
---

## 引

最近在玩 AstrBot，想装一些 MCP 和插件，但是配置使用 npx 启动的本地 MCP 服务器时，我的阿里云学生机 2H2G 会直接卡死，悲。😭它小小的身体可能承载了太多，目前这台小机上部署了 Astro 博客、用于 Obsidian 云同步的 Couch DB、发说说的 Ech0。思考再三，还是决定花费 528 RMB 来购买一台三年的腾讯云 2H4G 的服务器，将 AstrBot 这样占用较大的服务迁移到新机器上来部署。

## 配置

 来到 [腾讯云的主页](https://curl.qcloud.com/ZKp0gbso) ，找到对应型号的服务器下单就可以了。系统方面因为之前使用的这台阿里云上使用的是一年多前 [@Kindyear](https://www.kindyear.cn/) 带我安装的宝塔面板，这次我想试试 1Panel。所以选择了直接带 1Panel 面板的版本，这点不错，面去了自己安装的步骤。付款成功之后，来到腾讯云的控制台就能看到刚刚购买的服务器了。在控制台点击登录，来到终端，使用 `1pctl --help` 指令来查看相关信息。

```shell
root@VM-0-11-ubuntu:~# 1pctl --help
------------------------------------------------------------
                        1Panel 控制脚本
------------------------------------------------------------
Usage:
  ./1pctl [COMMAND] [ARGS...]
  ./1pctl --help

Commands:
  status [core|agent]         检查 1Panel 服务状态
  start [core|agent|all]      启动 1Panel 服务
  stop [core|agent|all]       停止 1Panel 服务
  restart [core|agent|all]    重启 1Panel 服务
  uninstall                   卸载 1Panel 服务
  user-info                   获取 1Panel 用户信息
  listen-ip                   切换 1Panel 监听 IP
  version                     查看 1Panel 版本信息
  update                      修改 1Panel 系统信息
  reset                       重置 1Panel 系统信息
  restore                     恢复 1Panel 服务及数据
```

启动面板， `1pctl start`

查看用户信息，`1pctl user-info`

```
root@VM-0-11-ubuntu:~# 1pctl start
------------------------------------------------------------
                        启动 1Panel 服务
------------------------------------------------------------
🟢[OK]启动 Core: 成功
🟢[OK]启动 Agent: 成功
------------------------------------------------------------
root@VM-0-11-ubuntu:~# 1pctl user-info
============================================================
                       获取 1Panel 用户信息
============================================================
面板地址: http://$LOCAL_IP:8090/tencentcloud 
面板用户: z2pxxxxxsa
面板密码: 5jxxxxxx1w
提示: 修改密码可执行命令: 1pctl update password
------------------------------------------------------------
```

这样 1Panel 就是正常工作的了，然后使用提供的初始面板用户名和密码来访问 1Panel。`http://$LOCAL_IP:8090/tencentcloud` 其中的 `$LOCAL_IP` 指的就是服务器的 IP 了，这个在腾讯云的控制台可以查看，将实际的 IP 地址替换到这个地址中，就可以访问到面板了。

## 安全

为了安全性，登陆成功后来到菜单中的 `面板设置` ，修改用户名和密码。以及默认的端口，降低被恶意扫端口攻击的概率。

在腾讯云控制台点击服务器，进入二级菜单的防火墙，同步修改允许访问面板的端口，不然改了默认端口就访问不到网页面板了。在再来到终端处，使用 `1pctl restart` 重启面板。

这样就可以开始美美使用新服务器啦。😎

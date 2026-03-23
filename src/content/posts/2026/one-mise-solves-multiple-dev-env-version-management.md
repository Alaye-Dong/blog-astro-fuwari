---
title: mise 一个工具解决多个开发环境版本管理
published: 2026-03-23
updated: 2026-03-23
description: ""
image: ""
tags:
  - 开发环境
  - Windows
  - DX
category: 技术
draft: false
---

## 引

最近想为 [Ech0](https://github.com/lin-snow/Ech0) 做一些代码贡献，需要配置 GoLang 环境，平常经常需要 Java、Node 版本切换的我顺所当然的想，这次配置 Go 环境是不是应该也借助一个开发环境版本管理工具，往常像 Node 使用 nvm，Go 是不是也有类似的工具呢。于是在网络上搜索，逛着逛着发现了一个叫 [mise](https://mise.jdx.dev/) 的工具，研究了一下，居然一个工具支持：

- [Bun](https://mise.jdx.dev/lang/bun.html)
- [Deno](https://mise.jdx.dev/lang/deno.html)
- [Elixir](https://mise.jdx.dev/lang/elixir.html)
- [Erlang](https://mise.jdx.dev/lang/erlang.html)
- [Go](https://mise.jdx.dev/lang/go.html)
- [Java](https://mise.jdx.dev/lang/java.html)
- [NodeJS](https://mise.jdx.dev/lang/node.html)
- [Python](https://mise.jdx.dev/lang/python.html)
- [Ruby](https://mise.jdx.dev/lang/ruby.html)
- [Rust](https://mise.jdx.dev/lang/rust.html)
- [Swift](https://mise.jdx.dev/lang/swift.html) 
- [Zig](https://mise.jdx.dev/lang/zig.html)

这么多的开发环境管理。

这下不得不试试了🤗

## 安装

作为 Windows 用户，每次安装软件都要注意安装到非 C 盘。

所以需要先设置一下 mise 的数据位置，根据官方文档可以通过 `MISE_DATA_DIR` 环境变量来设置：

```powershell
setx MISE_DATA_DIR D:\DevEnv\mise\data
```

这里使用 winget 来安装（其他安装渠道也可以，如 npm、powershell），我之前安装 oh-my-posh 的时候配置了 winget 的包安装位置所以直接使用 winget 来安装。

```powershell
winget install jdx.mise
```

## 启用 mise 的工具和环境变量自动加载

以 powershell 为例，打开 powershell 的配置文件：

```powershell
# create profile if it doesn't already exist
if (-not (Test-Path $profile)) { New-Item $profile -Force }
# open the profile
Invoke-Item $profile
```

在配置文件中添加：

```powershell
(&mise activate pwsh) | Out-String | Invoke-Expression
```

## 将 mise 添加到环境变量

将刚刚配置的 `MISE_DATA_DIR` 中的 `D:\DevEnv\mise\data\shims` 添加到 `环境变量 - 用户变量` 的 `path`

> [!IMPORTANT]
> Windows 环境变量中的用户变量和系统变量效果是不一样的,如果只配置在系统变量中，会导致普通命令行读取不到环境变量而显示不存在该指令，而管理员终端正常使用

## 使用

```powershell
mise use -g go@1.26.1
```

```powershell
go version

❯ go version
go version go1.26.1 windows/amd64
```

可以使用啦 mise😋~

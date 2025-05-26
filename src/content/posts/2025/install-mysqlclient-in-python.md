---
title: Python 中安装 mysqlclient
published: 2025-05-22
updated: 2025-05-23
description: ""
image: ""
tags:
  - Python
  - 教程
category: 技术
draft: false
---

## 引

直接 `pip install mysqlclient`，安装报错：

```shell
	  ......
      building 'MySQLdb._mysql' extension
      error: Microsoft Visual C++ 14.0 or greater is required. Get it with "Microsoft C++ Build Tools": https://visualstudio.microsoft.com/visual-cpp-build-tools/
      [end of output]

  note: This error originates from a subprocess, and is likely not a problem with pip.
  ERROR: Failed building wheel for mysqlclient
Failed to build mysqlclient
ERROR: ERROR: Failed to build installable wheels for some pyproject.toml based projects (mysqlclient)
```

提示需要安装 `Microsoft C++ Build Tools`。

## 解决方法

以下两个方法选择一种即可。

### 安装 Microsoft C++ Build Tools

安装 [Microsoft C++ 生成工具 - Visual Studio](https://visualstudio.microsoft.com/zh-hans/visual-cpp-build-tools/)。安装过程中，请确保勾选了 C++ 生成工具（C++ Build Tools）组件。

### 使用预编译的二进制文件安装 mysqlclient

使用提供的预编译版本来安装，例如使用 wheel 提供的 `.whl` 文件进行安装。

访问 [mysqlclient · PyPI](https://pypi.org/project/mysqlclient/#files)，在 Built Distributions 中找到对应 Python 版本和系统及芯片架构的包。

这里例如需要下载的是 `mysqlclient-2.2.7-cp312-cp312-win_amd64.whl` ，将下载的文件临时放到命令行所访问的根路径下，使用命令安装：

```shell
(django) PS D:\Alaye\GitHubDesktop\Playground\django-vue3-admin\backend> 
pip install mysqlclient-2.2.7-cp312-cp312-win_amd64.whl
```

安装成功提示：

```shell
Processing d:\alaye\githubdesktop\playground\django-vue3-admin\backend\mysqlclient-2.2.7-cp312-cp312-win_amd64.whl
Installing collected packages: mysqlclient
  Attempting uninstall: mysqlclient
    Found existing installation: mysqlclient 2.2.4
    Uninstalling mysqlclient-2.2.4:
      Successfully uninstalled mysqlclient-2.2.4
Successfully installed mysqlclient-2.2.7
```

## 参考

- [Windows系统 安装mysqlclient最详细教程_mysqlclient安装-CSDN博客](https://blog.csdn.net/m0_67162074/article/details/128243290)
---
title: Windows 设置 Capslock 切换中英文输入
published: 2025-02-08
updated: 2025-02-08
description: ""
image: ""
tags:
  - 教程
  - Windows
category: 技术
draft: false
---

Windows 的默认中英文切换方式体验较差，Shift 键既用于切换大小写，又用于切换输入法，容易误触。而 macOS 的 CapsLock 方案——短按切换中英文，长按启用大写锁定——更加直观且减少误操作。

本文介绍如何使用 [AutoHotkey](https://www.autohotkey.com/) 实现类似 macOS 的 CapsLock 中英文切换方式，让输入更高效。

## 安装 AutoHotkey

首先，下载并安装 AutoHotkey：

- 官网：[AutoHotkey](https://www.autohotkey.com/)

安装完成后，继续进行 Windows 和 AutoHotkey 设置。

## Windows 设置

在 Windows 中，需要调整一些输入法设置，以确保 AutoHotkey 脚本正常工作。

1. **关闭微软拼音输入法的 Shift 切换中英文功能**
    
    - `设置` → `时间和语言` → `语言和区域` → `输入` → `微软拼音` → `键盘`
    - 取消勾选“Shift 切换中英文”
2. **添加一个英文输入法**
    
    - `设置` → `时间和语言` → `语言和区域` → `添加语言`
    - 选择 `English (United States)` 或其他需要的英文键盘

## AutoHotkey 设置

### 创建 AutoHotkey 脚本

1. 安装 AutoHotkey 后，右键桌面 → `新建` → `AutoHotkey Script`
2. 右键新建的脚本文件，选择 `编辑`
3. 替换内容为以下脚本：

### 使用 CapsLock 切换中英文输入法

```ahk
#Requires AutoHotkey v2.0
#SingleInstance Force

; 让脚本在后台持续运行
Persistent

CapsLock::
{
    if (KeyWait("CapsLock", "T0.5")) {
        ; 短按 CapsLock 切换中英文
        Send "{Alt Down}{Shift Down}{Alt Up}{Shift Up}"
    } else {
        ; 长按 CapsLock 进行大小写锁定
        SetCapsLockState !GetKeyState("CapsLock", "T")
    }
}
```

### 锁定中文输入法的中文输入模式

为了确保中文输入法默认处于中文输入模式，可以使用以下脚本：

来源：[gist.github.com](https://gist.github.com/maokwen/4d99f5c0aa2e7c0c114c708b03fb73ae)

```ahk
#Include %A_ScriptDir%

timeInterval := 500

InChs() {
  ime_status := DllCall("GetKeyboardLayout", "int", 0, "UInt")
  return (ime_status & 0xffff) = 0x804 ; LANGID(Chinese) = 0x804
}

SwitchImeState(id) {
  SendMessage(0x283,  ; WM_IME_CONTROL
              0x002,  ; wParam IMC_SETCONVERSIONMODE
              1025,   ; lParam (Chinese)
              ,       ; Control (Window)
              id)
}

DetectHiddenWindows True

SetTimer Mainloop, 1000

MainLoop() {
  try {
    hWnd := WinGetID("A")
    id := DllCall("imm32\ImmGetDefaultIMEWnd", "Uint", hWnd, "Uint")

    if (InChs()) {
      SwitchImeState(id)
    }
  }
}
```

## 设置脚本开机自启动

为了让脚本每次开机后自动运行，可以将其转换为 `.exe` 文件，并放入 Windows 启动目录。

### 转换 AutoHotkey 脚本为可执行文件

4. 在 AutoHotkey Dash 中找到 `Compile Open Ahk2Exe - convert .ahk to .exe`
5. 选择你的 `.ahk` 脚本，将其编译为 `.exe`
6. 生成的 `.exe` 文件移动至：
    
    ```
    C:\ProgramData\Microsoft\Windows\Start Menu\Programs\StartUp
    ```

这样，每次 Windows 启动时，脚本都会自动运行，无需手动执行。

## 总结

通过 AutoHotkey，我们可以实现 CapsLock 短按切换中英文，长按启用大写锁定，从而改善 Windows 输入体验。搭配锁定中文输入模式的脚本，可以确保中文输入法默认保持中文输入。

## 参考资料

- [My Windows11 Settings | 薇尔薇](https://vio.vin/article/windows-settings)
- [win10自定义快捷键 & 开机自启动—AutoHotkey 实现快捷键上下左右（60键小键盘福利）](https://blog.csdn.net/qq_43555917/article/details/106523588)
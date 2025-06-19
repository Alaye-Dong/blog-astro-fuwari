---
title: " flutter_local_notifications 踩坑记录"
published: 2025-06-19
updated: 2025-06-19
description: ""
image: ""
tags:
  - Flutter
  - Android
category: 技术
draft: false
---

仔细看官方文档很有用！

> [flutter_local_notifications | Flutter package](https://pub.dev/packages/flutter_local_notifications#-android-setup)

## Android 配置

### 配置 build.gradle.kts

启用 [desugaring](https://developer.android.com/studio/write/java8-support#library-desugaring)（脱糖）

```kts
android {
    defaultConfig {
        multiDexEnabled = true
    }

    compileOptions {
        // Flag to enable support for the new language APIs
        // 1、启用Desugaring
        isCoreLibraryDesugaringEnabled = true
        // Sets Java compatibility to Java 11
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
  
    kotlinOptions {
        jvmTarget = JavaVersion.VERSION_11.toString()
    }
}

// 2、启用coreLibrary
dependencies {
    coreLibraryDesugaring("com.android.tools:desugar_jdk_libs:2.1.4")
}
```

### 配置 AndroidManifest.xml

```xml
<receiver android:exported="false" android:name="com.dexterous.flutterlocalnotifications.ScheduledNotificationReceiver" />
<receiver android:exported="false" android:name="com.dexterous.flutterlocalnotifications.ScheduledNotificationBootReceiver">
    <intent-filter>
        <action android:name="android.intent.action.BOOT_COMPLETED"/>
        <action android:name="android.intent.action.MY_PACKAGE_REPLACED"/>
        <action android:name="android.intent.action.QUICKBOOT_POWERON" />
        <action android:name="com.htc.intent.action.QUICKBOOT_POWERON"/>
    </intent-filter>
</receiver>
```

### 请求通知权限（Android 13+）

```dart
FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin =
        FlutterLocalNotificationsPlugin();
flutterLocalNotificationsPlugin.resolvePlatformSpecificImplementation<
    AndroidFlutterLocalNotificationsPlugin>().requestNotificationsPermission();
```

## 常见问题

### 8 已过时、bigLargeIcon() 都匹配

报错信息如下：

```shell
Launching lib\main.dart on sdk gphone64 x86 64 in debug mode...
Running Gradle task 'assembleDebug'...
警告: [options] 源值 8 已过时，将在未来发行版中删除
警告: [options] 目标值 8 已过时，将在未来发行版中删除
警告: [options] 要隐藏有关已过时选项的警告, 请使用 -Xlint:-options。
C:\Users\Alaye\AppData\Local\Pub\Cache\hosted\pub.dev\flutter_local_notifications-16.3.3\android\src\main\java\com\dexterous\flutterlocalnotifications\FlutterLocalNotificationsPlugin.java:1033: 错误: 对bigLargeIcon的引用不明确
      bigPictureStyle.bigLargeIcon(null);
                     ^
  BigPictureStyle 中的方法 bigLargeIcon(Bitmap) 和 BigPictureStyle 中的方法 bigLargeIcon(Icon) 都匹配
1 个错误
3 个警告

FAILURE: Build failed with an exception.
```

这大概是因为包版本过低。

解决方法：

升级 `flutter_local_notifications` 版本，使用指令 `flutter pub upgrade`。

### NDK 版本问题

> [【Flutter】 在 Android NDK 中遇到错误时该怎么办 | HY Clear 博客 | hy clear blog](https://dev.hy-clear.com/article/iaxxjncpou/)

`Tools` - `SDK Manager` 下载所需版本的 NDK

NDK 项目版本和文件版本不一致：

```shell
Build file 'D:\Alaye\CODE\AndroidStudioProjects\exp3_notice_weather_info\android\build.gradle.kts' line: 16

- What went wrong:  
    A problem occurred configuring project ':app'.
    

> [CXX1104] NDK from ndk.dir at D:\DevEnv\Android\Sdk\ndk\29.0.13113456 had version [29.0.13113456] which disagrees with android.ndkVersion [26.3.11579264]
```

解决方法：

指定 NDK 版本及路径、修改 flutter 的文件。具体步骤可以看以上引用的文章。

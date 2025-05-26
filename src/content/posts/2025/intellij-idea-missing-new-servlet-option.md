---
title: IDEA 新建 Servlet 选项消失
published: 2025-05-26
updated: 2025-05-26
description: ""
image: ""
tags:
  - JSP
  - 教程
category: 技术
draft: false
---

## 引

实训课需要使用了 JSP - Servlet 的模式进行开发，在 IDEA 中新建文件却没有发现 Servlet 选项，但是老师和一些同学的旧版本中却有这个选项。

你是否也刚刚将你的 IntelliJ IDEA 升级到了最新版本，兴冲冲地准备开始你的 Java Web 项目，却在右键点击包名 -> "New" 时傻了眼——曾经熟悉的 "Servlet"、"Filter" 和 "Listener" 等选项竟然不见了？！

别担心，你不是一个人。这确实是 IntelliJ IDEA 近期版本的一个显著变化。本篇将为你揭示其中的原因，并提供清晰的解决方案。

## 变化的原因：JetBrains 的考量

根据 JetBrains 官方的说法 (主要在其 YouTrack 问题追踪系统中)，**从 IntelliJ IDEA 2023.1 版本开始，开发团队移除了直接在 "New" 菜单中创建 Servlet、Web Filter 和 Web Listener 的选项。**

**主要原因包括：**

1.  **使用频率降低：** 随着现代 Java Web 框架（如 Spring MVC/Boot, Jakarta EE 自身的 JAX-RS 等）的普及，开发者越来越少直接通过 IDE 的向导来创建这些底层的 Servlet API 组件。框架通常会提供更高级的抽象和注解来处理请求和过滤器逻辑。
2.  **简化菜单：** 移除不常用的选项有助于保持 "New" 菜单的简洁性。

虽然这一改变对于习惯了旧版操作的开发者来说可能有些突然，但创建这些组件的途径依然存在，只是方式略有不同。

## 如何在 IntelliJ IDEA 2023.1 及更高版本中创建 Servlet？

以下是目前推荐的几种方法：

### 1. 手动创建 Java 类 (推荐)

这是最直接也是最灵活的方式。

1.  **创建 Java 类：**
    * 在你的项目视图中，右键点击目标包（通常在 `src/main/java` 下）。
    * 选择 **New > Java Class**。
    * 输入你的类名，例如 `MyCustomServlet`。

2.  **继承相应的父类/实现接口：**
    * **对于 Servlet:** 使你的类继承 `jakarta.servlet.http.HttpServlet` (对于 Jakarta EE 9+，如 Tomcat 10+) 或 `javax.servlet.http.HttpServlet` (对于旧版 Java EE，如 Tomcat 9 或更早)。
    * **对于 Filter:** 实现 `jakarta.servlet.Filter` 或 `javax.servlet.Filter` 接口。
    * **对于 Listener:** 实现相应的 Listener 接口，如 `jakarta.servlet.ServletContextListener` 或 `javax.servlet.http.HttpSessionListener` 等。

3.  **添加注解或配置 `web.xml`：**
    * 使用注解是现代 Jakarta EE/Java EE 的推荐方式。
        * **Servlet:** `@WebServlet("/your-path")`
        * **Filter:** `@WebFilter("/your-path/*")`
        * **Listener:** `@WebListener`
    * 或者，你仍然可以在 `webapp/WEB-INF/web.xml` 文件中手动配置这些组件。

**示例：创建一个 Jakarta EE Servlet**

```java
package com.example.web;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "MyCustomServlet", urlPatterns = {"/hello"})
public class MyCustomServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("text/html");
        resp.getWriter().println("<h1>Hello from MyCustomServlet!</h1>");
    }
}
```

### 2. 使用自定义文件模板

如果你需要频繁创建这些组件，自定义文件模板是一个非常高效的选择。

1. **打开模板设置：**
    
    - 进入 **File > Settings (或 IntelliJ IDEA > Settings/Preferences 在 macOS 上) > Editor > File and Code Templates**。
2. **在 Files 页创建新模板：**
    
    - 点击 `+` (Add) 按钮。
    - **Name:** 给你的模板起一个描述性的名字，例如 "Jakarta Servlet"。
    - **Extension:** `java`
    - **Template text:** 粘贴你的 Servlet、Filter 或 Listener 的基本骨架代码。你可以使用预定义变量，如 `${PACKAGE_NAME}` 和 `${NAME}` (代表类名)。

> [!TIP]
> 在 Other 页 Web - Java code templates 中可以找到 `Servlet Class.java` 等的模板，复制粘贴即可。

```java
#if (${PACKAGE_NAME} && ${PACKAGE_NAME} != "")package ${PACKAGE_NAME};#end  
#parse("File Header.java")  
  
#if ($JAVAEE_TYPE == "jakarta")  
import jakarta.servlet.*;  
import jakarta.servlet.http.*;  
import jakarta.servlet.annotation.*;  
#else  
import javax.servlet.*;  
import javax.servlet.http.*;  
import javax.servlet.annotation.*;  
#end  
import java.io.IOException;  
  
@WebServlet(name = "${Entity_Name}", value = "/${Entity_Name}")  
public class ${Class_Name} extends HttpServlet {  
    @Override  
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {  
  
    }  
  
    @Override  
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {  
  
    }  
}
```
    
3. **使用模板：**
    
    - 之后，在你的项目中右键点击包，选择 **New > 你的模板名称** 即可快速生成。

JetBrains 官方也鼓励用户通过这种方式自定义常用的代码结构。

## 来自 JetBrains 的官方信息

可以从 JetBrains 的官方渠道找到佐证：

- **YouTrack 问题 IDEA-309062 (JavaEE: Drop new Servlet, Web Filter and Web Listener actions):** 明确记录了移除这些选项的决定，并提到“自 2023.1 版本起，我们不再提供这些模板，因为如今它们已很少被使用。”
    
    - 链接: [https://youtrack.jetbrains.com/issue/IDEA-309062](https://youtrack.jetbrains.com/issue/IDEA-309062)
- **YouTrack 问题 IDEA-316701 (Cannot create servlet, web filter, web listener after 2023.1 update):** 用户在更新后报告了此问题，JetBrains 员工确认了模板的移除，并建议使用自定义文件模板，甚至提供了移除前模板的内容供用户参考。
    
    - 链接: [https://youtrack.jetbrains.com/issue/IDEA-316701](https://youtrack.jetbrains.com/issue/IDEA-316701)
- **IntelliJ IDEA 官方文档:** 在关于创建 Web 应用程序元素的文档中，现在会说明 IntelliJ IDEA 不再提供这些组件的默认模板，并指导用户如何自己创建。
    
    - 参考链接: [https://www.jetbrains.com/help/idea/creating-and-configuring-web-application-elements.html](https://www.jetbrains.com/help/idea/creating-and-configuring-web-application-elements.html)

## 其他注意事项

- **项目依赖：** 确保你的项目 (`pom.xml` 或 `build.gradle`) 中添加了正确的 Servlet API 依赖。
    
	-  Jakarta EE 9+ (如 Tomcat 10+):
	        
	```xml
	<dependency>
		<groupId>jakarta.servlet</groupId>
		<artifactId>jakarta.servlet-api</artifactId>
		<version>6.0.0</version> 
		<scope>provided</scope>
	</dependency>
	```
	
	- 旧版 Java EE (如 Tomcat 9 及更早)
	        
	```xml
	<dependency>
		<groupId>javax.servlet</groupId>
		<artifactId>javax.servlet-api</artifactId>
		<version>4.0.1</version>
		<scope>provided</scope>
	</dependency>
	```

## 总结

虽然 IntelliJ IDEA 移除了直接创建 Servlet、Filter 和 Listener 的菜单选项，但这并不意味着我们无法再创建它们。通过手动创建 Java 类并结合注解，或者利用强大的自定义文件模板功能，我们依然可以进行 Servlet 开发。

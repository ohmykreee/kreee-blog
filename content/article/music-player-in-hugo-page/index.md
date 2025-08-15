---
title: "在 Hugo 里内嵌音乐播放器（APlayer）"
date: 2021-06-07T11:10:33+08:00
draft: false
categories: ['Learning']
tags: ['Hugo', 'Selfhosted', 'Learning', '2021']
---

就是置顶状态的那个音乐播放器。  
想要吗？只需要短短三步哦！   

<!--more-->

## 零、工作开始前
* 使用的 Hugo 版本：0.83.1 ，更高版本的应该也行。
* 使用的播放器： [APlayer](https://github.com/DIYgod/APlayer) ，一个大家都在用我不用不行的看上去还行的播放器小组件。
* 使用的解析器： [MetingJS](https://github.com/metowolf/MetingJS) ，很强大，支持许多音乐平台。本人常用网易云音乐平台。

## 一、添加依赖
虽然只有短短四个字，但是对于许多萌新（包括我）来说这一步就是个噩梦（误）。   

首先，这个东西是因所使用的模板而异。有的模板做的比较好（比如我这个，不得不说德国人是真的严谨），会在配置文件中预留可追加 `.css` 和 `.js` 的设置项；而有的模板只会提供 `.css` ，或者甚至没有。   
所以这问题就大了，对于某些人来说添加依赖就是在设置文件里添加三句话的功夫，对于某些人来说就是遥不可及的彼岸（误）。   

对于那些模板的配置文件里有位置预留追加 `.css` 和 `.js` 的，只需要追加 css 依赖 `https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.css` 和 js 依赖 `https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.js` `https://cdn.jsdelivr.net/npm/meting@2/dist/Meting.min.js` 即可。  

而对于**无法在配置文件中直接添加依赖的**，就需要 Overwrite 模板文件了：   
找到文件 `/themes/<你的主题名>/layouts/_default/baseof.html` ，并将该文件复制到 `/layouts/_default/baseof.html` ,并对后者进行修改：   
在 `<head>` 和 `</head>` 区域间复制粘贴以下代码：   
```html
<!-- require APlayer -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.css">
<script src="https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.js"></script>
<!-- require MetingJS -->
<script src="https://cdn.jsdelivr.net/npm/meting@2/dist/Meting.min.js"></script>
```
{{< alert >}}
**注意** 如果你的模板是通过 submodule 方式导入的，并且在非本地环境进行渲染和发布（如 GitHub Action），在每次模板更新后，最好重复以上步骤确保不会出啥奇奇怪怪的问题。  
{{< /alert >}}  

完事后，如何检测依赖成功被加载呢？   
只需要启动 Hugo 内置服务器，打开网页，按下~~高贵的~~`F12`按钮打开开发者工具。如果一切顺利，可以在控制台里看到两个 outputs ：
```plaintext
   APlayer v1.10.1 af84efb  http://aplayer.js.org 
   
   MetingJS v2.0.1  https://github.com/metowolf/MetingJS 
```
如果没有呢？那就是轮到你头痛的时候了😏   
也不需要太着急，我也是头痛了一下午才搞定的。毕竟整这东西玩的这就是折腾，不是吗？

## 二、 **（可选）** 定义 shortcodes
当然你这步不想做完全可以，只需要在想添加音乐播放器的地方插入这一行就行：
```html
<meting-js server="netease" type="playlist" id="769332917"></meting-js>
```
相关参数的意义可以在 [官方文档](https://github.com/metowolf/MetingJS) 查看详细介绍，这里我就不赘述。   

然后我们来讲讲我们的 shortcodes 。为啥要有 shortcodes 呢？其实就是方便我们写文章的时候以最快的速度插入音乐。   
老样子，我也是强烈推荐各位能够直接去 [官方文档：Shortcodes](https://gohugo.io/content-management/shortcodes/) 学习如何写 shortcodes 。下面就来说说我的 shortcodes 是怎么写的。 

首先，新建文件 `/layouts/shrotcodes/aplayer.html`，文件名就是你的 shortcodes 的名字。   
然后，文件里写：
```plaintext
<meting-js server="{{ .Get "server" }}" type="{{ .Get "type" }}" id="{{ .Get "id" }}"></meting-js>
```
很简单，不是吗？其中 `.Get` 就是一个能够得到被传递参数的一个方法，这个想必大家一眼就能看出来。其实大家还可以通过一个判断语句来完成即使不声明参数名也能完成参数传递的 shortcodes ，对着官方的示例代码写就能写出来。我由于没这个需求就简单写了这么一行。   
完事了之后，只需要在文章想要插入的地方使用刚刚定义的 shortcodes ：
```plaintext
# 前面记得补上两个 {{ ，放代码块里也会触发 shortcodes 我也是没想到
<aplayer server="netease" type="playlist" id="769332917">}}
```
就能达到之前那行 HTML 语句一样的效果。

## 三、更改 Goldmark 设置
你以为到这里就完事了？但是我有说需要三步啊。最后一步，也是 Hugo 版本更新遗留问题。    
如果你头铁，直接去部署网页；等你部署完了，你就会发现，本来应该出现音乐播放器的地方，竟然一片空白。   
不要慌张，和我一起，按下~~高贵的~~`F12`按钮打开开发者工具，使用元素检查选中本应该出现播放器的地方。然后，你就会在代码查看器里看到一行字：   
```html
<!-- raw HTML omitted -->
```
好了不卖关子了，问题就在于新的渲染器 Goldmark 不默认渲染 HTML 代码，甚至用 shortcodes 也不行。   

**所以**，解决方法有两个：
1. 更改 Goldmark 渲染器的设置，使其能够渲染 HTML 代码。只需要在配置文件的 `[markup]` 部分添加以下内容（以 `config.toml` 为例，其他格式请参考对应文件的语法）：
```toml
  [markup.goldmark]
    [markup.goldmark.renderer]
      unsafe = true
```
2. 如果你是那种 Old school style 的人，你可以直接更换到老的渲染器。在配置文件的 `[markup]` 部分添加以下内容（以 `config.toml` 为例，其他格式请参考对应文件的语法）：
```toml
  defaultMarkdownHandler = "blackfriday"
```

## 四、总结
So，导致播放器组件不起作用的可能原因分这三种：
1. css 和 js 依赖没有被成功添加 **（最有可能）**；
2. Goldmark 设置没有更改；
3. 其他傻X错误比如代码写错了或者传递参数不正确啥的。   

如果一切顺利的话，你也可以让自己的博客里充满音乐了！Enjoy！
{{<aplayer server="netease" type="song" id="29550185">}}
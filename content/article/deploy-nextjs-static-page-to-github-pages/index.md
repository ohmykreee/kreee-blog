---
title: "关于部署 Next.js 静态网页到 GitHub Pages 有关注意事项"
date: 2021-11-18T16:17:41+08:00
draft: false
tags: ['JavaScript', 'Frontend', 'GitHub', 'Learning', 'React', 'Next.js', '2021']
categories: ['Learning']
summary: "个人主页 [www.ohmykreee.top](https://www.ohmykreee.top) ~~涅槃重生啦~~ ，快去围观吧！"
---

个人主页 [www.ohmykreee.top](https://www.ohmykreee.top) ~~涅槃重生啦~~ ，快去围观吧！

（怎么这文案一股营销号的味道）
 
 ## 零、说点废话
 本来按照惯例，整完一个项目是要写一篇在做这个项目中学到的东西。但是因为这次懒癌犯了（我不掩饰了，来咬我啊咬我啊~~），这次就只写写如果要将 Next.js 项目渲染为静态网页并发布在 GitHub Pages 时要注意的几点。

 （其实是那些知识点有点杂，并且是涉及某个特定的库的问题，没啥太大的参考价值。如果想要一起学习的话可以考虑直接看项目源代码，反正整个项目体量也不是很大。）

 ## 一、Next.js 和 静态网页渲染
 > 参考： [Static HTML Export - Next.js](https://nextjs.org/docs/advanced-features/static-html-export)

 使用命令 `next build && next export` 就可以将整个项目渲染为静态的 HTML 文件，并且输出到 out 文件夹。默认情况下不需要额外的配置。

 如果想要进一步简化操作，也可以编辑 `package.json` 关于 `build` 的命令：
 ```json
"scripts": {
  "build": "next build && next export"
}
 ```
 然后运行 `npm run build` 就行了。

 ## 二、Jekyll 和 下划线
 > 参考： [Bypassing Jekyll on GitHub Pages - GitHub Blog](https://github.blog/2009-12-29-bypassing-jekyll-on-github-pages/)
 
 其实 GitHub Pages 并不是一个单纯的静态网页提供服务，而是一个 Jekyll 服务（用官方的话讲，就是：GitHub Pages is powered by Jekyll.）而 **在 Jekyll 生成最终的网站前会忽略所有开头带有 `_` 的文件夹和文件**。
 
 但是好巧不巧：在 Next.js 生成的文件中，一些关键文件是存放在 `_next` 文件夹中的（我觉得是故意的），导致了如果直接把生成的文件 push 到 GitHub Pages 上时，整个网页将会崩掉。

 解决方法嘛，很简单，就在根目录放一个名字为 `.nojekyll` 的空文件，这样 GitHub Pages 在生成最终的网页时会强制跳过 Jekyll 的处理。
 
 如果使用 GitHub actions，可以在流程文件里这样写：
 ```yaml
      - name: Build static page
        run: |
          npm run build
          touch ./out/.nojekyll
 ```

---
title: "使用 GitHub Action 自动渲染和发布网页"
date: 2021-06-07T10:21:29+08:00
draft: false
categories: ['Learning']
tags: ['GitHub', 'Learning', '2021']
summary: "所以秉承着人类科技进步的本质是懒这一原则，顺便学学 GitHub Action 做到网页渲染和发布一条龙吧。"
---
## Why?
根据 GitHub Pages 的政策，一个 GitHub 账号只能拥有一个个人主页和多个项目主页。我的个人主页名额给了服务器的 Landing Page，所以这个博客只能以项目主页的名义发布了。   
然鹅有一个问题是，不同于个人主页，项目主页的网页是要托管在 `gh-pages` 分支的，所以如果完全手动的话需要我自己在本地渲染好网页后，手动 push 到 `gh-pages` 分支上。   
所以秉承着人类科技进步的本质是~~懒~~这一原则，顺便学学 GitHub Action 做到网页渲染和发布一条龙吧。   
So, let's begin!

废话不多说，上 `/.github/workflows/publish-site.yml` ：
```yml
name: Publish site to GitHub Pages

on:
  push:
    branches:
      - main

jobs:

  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repo
        uses: actions/checkout@master
        with:
          submodules: true

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: 'latest'
          # extended: true
          
      - name: Build
        run: hugo
          
      - name: Deploy to GitHub Pages
        if: success()
        uses: crazy-max/ghaction-github-pages@v2
        with:
          target_branch: gh-pages
          build_dir: public
          fqdn: blog.ohmykreee.top
          dry_run: false
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## 流程文件分析
其实本人强烈推荐大家自己去 [官方文档](https://docs.github.com/cn/actions) 学习相关语法 + 看示例文件。下面就作为本人的学习成果（半吊子程度），分析一下这个 GitHub Action 流程文件。
### 触发条件
> [官方文档：触发工作流程的事件](https://docs.github.com/cn/actions/reference/events-that-trigger-workflows)
```yml
on:
  push:
    branches:
      - main
```
一目了然：在 `main` 分支有新的 push 事件时触发。

### 第一步：检验仓库
```yml
      - name: Checkout Repo
        uses: actions/checkout@master
        with:
          submodules: true
```
这里有一个关键：`submodules` 参数**一定**要记得传递 `true`， 因为如果你的 Hugo 项目用了模板，并且模板文件同样是托管在 GitHub 上，那么在创建项目和 push 项目时是要将模板设置为 SubModules 的。   
然鹅默认情况下 `git pull` 是不会拉下 SubModules 内的文件（同时也需要自己手动更新 SubModules 的文件），也就导致了如果不声明 SubModules 的存在，到时候在 GitHub Action 的服务器上，准备被渲染的项目文件里就会缺少模板文件，然后就无了。

### 第二步：准备环境
> [该包 Action marketplace 主页](https://github.com/marketplace/actions/hugo-setup)
```yml
      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: 'latest'
          # extended: true
```
一目了然，设置好 Hugo 环境。可以传递参数指定 Hugo 版本，以及是否使用 extended 版本。

### 第三步：开始渲染网页
```yml
      - name: Build
        run: hugo
```
也是一目了然，执行 `hugo` 命令。

### 第四步：push 到 `gh-pages` 分支并发布
> [该包 Action marketplace 主页](https://github.com/marketplace/actions/github-pages)   
  [官方文档：GitHub Actions 的上下文和表达式语法](https://docs.github.com/cn/actions/reference/context-and-expression-syntax-for-github-actions)   
  [官方文档：工作流程中的身份验证](https://docs.github.com/cn/actions/reference/authentication-in-a-workflow)   
```yml
      - name: Deploy to GitHub Pages
        if: success()
        uses: crazy-max/ghaction-github-pages@v2
        with:
          target_branch: gh-pages
          build_dir: public
          fqdn: blog.ohmykreee.top
          dry_run: false
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
还是一目了然（有完没完啊），如果上一步没有返回错误的话，push 生成的文件到 `gh-pages` 分支。   
可以传递参数有：
* `target_branch` ：目标分支；
* `build_dir` ：待上传文件夹；
* `fqdn` ：CNAME file 内容，用于自定义域名；
* `dry_run` ：测试用，运行但不 push 代码。
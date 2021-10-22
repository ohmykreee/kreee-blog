---
title: "wolf-bites-tweets 和 wolf-chews-tweets 开发小记"
date: 2021-10-19T12:29:53+08:00
draft: false

categories: ['Learning']
tags: ['Python', 'JavaScript', 'Frontend', 'GitHub', 'Learning', '2021']
author: "Kreee"
noSummary: false

resizeImages: true
---

~~又为：论如何嫖秃 GitHub 服务器~~

<!--more-->

## 万恶之源
一切都应该从那时说起：~~在一个月黑风高的夜晚~~，我翻译博客的 404 页面时，望着空荡荡的页面，心里突发奇想：如果这里能有一个随机展示我喜欢过的推特的一个小组件，是不是很 nice（顺便展示一下我奇怪的 xp ）。

说挖坑就挖坑。要实现这个小功能，我打算做两个项目： wolf-bites-tweets 和 wolf-chews-tweets（别问我这个名字咋想出来的）。前者是利用 ~~白嫖~~ 一下 GitHub action 的服务器，每周通过推特官方 API 获取我的推特喜欢列表（顺便也把获取发推列表这个功能也做了，万一我以后也产粮了呢），准备用我最熟悉的 Python 实现；后者就是利用前者获取的数据，把随机抽到的推特展示在网页上。

由于这是我第一次涉及前端的开发，JavaScript 之前也没有涉及过，所以这次填坑之旅最主要也是最难的是 wolf-chews-tweets 这个项目，这篇博文主要的也是这个前端项目。咋说呢，自己开的坑哭着也要自己填完，不是吗😂？

-----
## 写在前面
> 声明变量时没有类型标注是个坏习俗。   
> —— 某位不知名暴论者

> 遭了，写习惯了咋办？    
> —— 某位痛苦的初学者

### 1. 开 PR 前请再三检查！！
是的，很痛苦的教训，非常非常痛苦的教训。

在 wolf-bites-tweets 项目来到 1.0.5 的时候，我顺手就开了一个从 main <-- dev-1.0.5 的 PR，很快啊，开完了马上就 merge 了。等一切都完成后，突然发现：我 ** README 忘记更新了，就把 PR 给 merge 了。回想起来，其实只要在 main 那里再加一个更新 README 的 commit 就行了，结果我一顿窒息操作，直接把 main 整到了一个很奇怪的状态。

最后，**无奈之下**，采取了“核弹级”操作（好孩子不要学）：Hard reset 加 Force push：
```bash
git reset --hard commit_id
git push origin HEAD --force
```
后果就是后面想要撤销的 commit 的记录都会被丢失。

但是正确操作也是要学会的是吧，事后还是去谷歌上找了这篇讨论：[How to revert multiple git commits? - Stack overflow](https://stackoverflow.com/questions/1463340/how-to-revert-multiple-git-commits)

如果有一个 branch 长这样，其中想要撤销 commits 直到 A 的状态：
```plaintext
 Z <-- A <-- B <-- C <--D     <-- main <-- HEAD
```
如果这些 commits 中没有 merge 操作时，可以使用 `git revert`：
```bash
git revert --no-commit A..HEAD
# 或者使用：
# git revert --no-commit B^..HEAD
# 或者怕出错也可以一步一步 revert：
# git revert --no-commit D
# git revert --no-commit C
# git revert --no-commit B
git commit -m "the commit message for all of them"
```
最后会变成：
```plaintext
Z <-- A <-- B  <-- C <-- D <-- [(BCD)^-1]     <-- main <-- HEAD
```
另外一种就是使用 `git checkout` 来恢复，适用于含有 merge 操作的 commits：
```bash
git stash #暂存本地修改，如果有的话
git checkout -f A -- . # 在本地文件上 checkout 到指定 commit 上
git commit -a
```
最后会变成：
```plaintext
Z <-- A <-- B <-- C <-- D <-- A'     <-- main <-- HEAD
```

-----
## Wolf-Bites-Tweets
项目仓库：https://github.com/ohmykreee/wolf-bites-tweets

其实就是个比较简单的 Python 程序，写的也很快，花了两个晚上左右就把第一个版本 1.0.0 给写了出来，又花了几天肝 ~~水~~ 了两个版本。

也没啥技术含量（指很多东西都是对着其他项目照葫芦画瓢），其中一个坑就是在 1.0.0 版本中涉及到了一个关于 list/dict 变量复制的问题：

在 Python 中，如果想要把一个 list 的内容给另外一个变量，~~想整一些花活时~~，比如这样：
```python
this_is_a_list = another_list
```
其实这样操作完后在 Python 那里只有一个 list 有着两个不同的名字 `this_is_a_list`、`another_list`。**如果你对其中一个变量进行一些更改时，另外一个变量也会相应发生更改。**~~就很傻逼，不是吗？~~

正确操作应该是使用 Deep copy：
```python
import copy

this_is_a_list = copy.deepcopy(another_list)
```
这样就会有两个独立互不干扰的 list。

这个操作在版本 1.0.5 以及之后已经弃用了，因为 `get_tweets.py` 从 `pop` 删除元素的操作（而且回想起来那种方法好像还存在 bug，有兴趣的可以回看那个版本）改成了 `append` 添加元素的操作。

-----
## Wolf-Chews-Tweets
### 配置开发环境
对，很痛苦，也绕了一点弯路。

> 谁叫你用 Windows 做开发呢？   

mvn 用的是 [nvm-windows](https://github.com/coreybutler/nvm-windows) 这个项目，注意点有这几个：   
1. 安装目录不能包含空格，也就是说不能安装在 `Program Files` 文件夹下，推荐放在 `C:\nvm\` 或者 `D:\nvm\` ，不然会得到蜜汁乱码报错（估计是软件不适配中文环境的原因）。Node 的链接文件目录最好也放在这种盘根目录文件夹里。
2. 可以使用 `nvm node_mirror <node_mirror_url>` 和 `nvm npm_mirror <npm_mirror_url>` 命令来添加镜像，加速下载。
3. 在执行 `nvm use <node_version>` 时，会遭遇报错 `exit code 1 一堆乱码` ，解决方法就是用管理员权限开一个终端，再执行命令。
4. Node 首次安装完后 VS Code 内置终端可能会无法使用 `node` 和 `npm` 命令，暂时没有搞明白原因（可能是系统环境变量没有同步？）。重启解。

VS Code 那里又有一个大坑：   
如果想在 VS Code 用微软亲儿子 Edge 浏览器调试 Javascript 代码时，里面其实是已经内置了 debugger for Microsoft Edge 的。我**本以为**这个 debugger 是直接“开箱即用”的：开始调试时，它会启动一个内置本地服务器，然后再打开浏览器开始调试。但事实是它并没有本地服务器这个功能，还得自己整一个本地服务器，不然你就会得到一个第一眼看上去不知所以然的报错：
```plaintext
crbug/1173575, non-JS module files deprecated.
```
还好 VS Code 插件里就有现成的 [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) 插件。启动了之后在 `.vscode/launch.json` 里把 `url` 后面的端口改为开放的端口就行。

只能说这波啊，这波微软欺骗了我单纯的感情（雾）。
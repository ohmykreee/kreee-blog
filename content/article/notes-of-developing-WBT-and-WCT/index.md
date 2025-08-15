---
title: "wolf-bites-tweets 和 wolf-chews-tweets 开发小记"
date: 2021-10-19T12:29:53+08:00
draft: false
categories: ['Learning']
tags: ['Python', 'JavaScript', 'Frontend', 'GitHub', 'Learning', '2021']
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
## Wolf-Bites-Tweets v1
项目仓库：[https://github.com/ohmykreee/wolf-bites-tweets](https://github.com/ohmykreee/wolf-bites-tweets)

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
项目仓库：[https://github.com/ohmykreee/wolf-chews-tweets](https://github.com/ohmykreee/wolf-chews-tweets)

准备写两个实现方式：一个是插入推特官方的小部件，一个是用别人造好的轮子 [nolimits4web
/
swiper](https://github.com/nolimits4web/swiper) 来写一个直接展示图片的组件。
### 配置开发环境
对，很痛苦，也绕了一点弯路。

> 谁叫你用 Windows 做开发呢？   
> —— 不知名暴论者

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

### 使用 Custom Elements
准备使用自定义元素来调用生成我想要的内容。
> 参考：[使用 custom elements - MDN Web Docs](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_custom_elements)

用法大致是用 `window.customElements.define` 命令来声明一个自定义元素，然后定义一个类来定义这个自定义元素的行为。

不过想说一下，在参考文章里示例代码用的是 `constructor()` 方法，我认为在某些情况下并不是个好方法：
```javascript
class WolfChewsElement extends HTMLElement {
  constructor() {
    // 必须首先调用 super 方法
    super();

    // 元素的功能代码写在这里
    ...
  }
}
```
在此之前，我想提醒一下：浏览器渲染 HTML 文件时也是按照从头到尾的顺序读取文件；也就是说，HTML 文件内代码的读取和执行是是受位置先后顺序影响的。

回到这个问题上，`constructor()` 这个方法是用方法来定义一个类没错，并且是在这个类被创建的时候 **立即** 执行，也就是说当浏览器读取到这一行的代码时，会立即执行 `constructor()` 内的代码。于是问题来了：如果你的 `constructor()` 方法里有读取你自定义元素内属性的代码，并且这个代码执行的时候 DOM 还没有建立，**就会无法读取到属性内容并且返回 undifined**。

于此同时，在Chrome版本76.0.3809.132（正式版本）（64 位）中，如果你在 `constructor()` 方法内有读取自定义元素内属性的行为，并且在 HTML 引用 js 文件时在 `script` 标签上没有添加 `defer` 属性，浏览器会直接返回 undifined。那这个 `defer` 又是什么东西呢？这个属性是告诉浏览器这个代码要等整个页面加载完成后再执行。（参考文章： [Why do I have to defer customElement definitions? - Stack Overflow](https://stackoverflow.com/questions/52176168/why-do-i-have-to-defer-customelement-definitions)）

较好的方法应该是使用 `connectedCallback()` ,即在自定义元素首次被插入到文档 DOM 节点上时被调用：
```javascript
class WolfChewsElement extends HTMLElement {
  connectedCallback() {
    // 代码写在这里
    ...
  }

  this_is_a_function() {
    ...
  }
}
```
关于其他方法可以参考这里：[Web Components - MDN Web Docs](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components)
> 生命周期回调   
> 定义在自定义元素的类定义中的特殊回调函数，影响其行为：
> - connectedCallback: 当自定义元素第一次被连接到文档DOM时被调用。
> - disconnectedCallback: 当自定义元素与文档DOM断开连接时被调用。
> - adoptedCallback: 当自定义元素被移动到新文档时被调用。
> - attributeChangedCallback: 当自定义元素的一个属性被增加、移除或更改时被调用。

（在这里顺便附上我读取自定义元素的属性的方法，虽然方法不是我自己原创的，但是这个方法可以说是非常好，对于可选参数传递也能很好的读取：）
```javascript
// fetch value
const config = {}
const keys = ['url', 'method', 'index', 'container_id']
for (let i = 0; i < this.attributes.length; i = i + 1) {
    if (keys.includes(this.attributes[i].name)) {
        config[this.attributes[i].name] = this.attributes[i].value
    }
}
```

### 跨域问题
本来说是想直接用推特的 API ：`statuses/oembed` 来直接获取 embeded twitter 的 HTML 代码，结果遇到了跨域错误。

简单来说，跨域（跨域资源共享）就是在一个域名下想要用 `XMLHttpRequest` 访问另外一个域名下的资源时，出现的情况。

默认情况下，浏览器是默认拒绝跨域的，因为会有跨域攻击的可能存在（除非在发出请求的时候加上请求头： `Access-Control-Allow-Origin: *` 允许所有来源）。**于此同时**，对方服务器也需要允许跨域，否则这个跨域访问就无法完成。

但现状是，所有的推特 API 都不支持跨域访问，官方的说法是建议推特 API 只用于后端中。无可奈何，只能使用推特的 `widgets.js` 来渲染推特，缺点就是加入推特自己的分析框架，而且好像关不掉的样子。

更多信息可以去读读这篇文章：[跨源资源共享（CORS） - MDN Web Docs](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)

### 随机整数生成
```javascript
/**
* Returns a random integer between min and max
* Using Math.round() will give you a non-uniform distribution!
* Both min and max can be randomed
*/
_getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
```
直接从 Stack Overflow 上抄的：[Javascript Random Integer Between two Numbers -Stack Overflow](https://stackoverflow.com/questions/10134237/javascript-random-integer-between-two-numbers)，至于原理我还没弄懂（谁叫我数学那么拉呢）。
> Ctrl + C, Ctrl + V, work done!   
> —— 某人的暴言

### http_get 方法
```javascript
_httpGet (theUrl) {
    try{
        var xmlHttp = new XMLHttpRequest()
        xmlHttp.open( "GET", theUrl, false ) // false for synchronous request
        xmlHttp.send( null )
        return xmlHttp.responseText
    } catch (e) {
        throw this._throwException('http request', e)
    }
}
```
也是直接从 Stack Overflow 上抄的：[HTTP GET request in JavaScript? - Stack Overflow](https://stackoverflow.com/questions/247483/http-get-request-in-javascript)，自己加了个 try{} 和 ~~脱裤子放屁行为（指 catch 了一个错误又顺手丢出去）~~ 。

### 清空一个父 node 里的所有子 node
三个方法，我都觉得不是很优雅。（参考文章： [Remove all child elements of a DOM node in JavaScript - Stack Overflow](https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript)）

1. `parent.textContent = ''`   
项目中使用的是这个方法。因为原来的父 node 里只有一个 text node，我估计这个方法能行，还没试过父 node 里套了一些奇奇怪怪的东西的情况。

2. `parent.innerHTML = ''`   
杀伤力极大，直接父 node 里啥都没有了，就是执行速度上要比上面一个要慢一点。在某些情况下不是很好用。

3. 循环执行 `parentNode.removeChild()`   
虽然这个看上去最优雅，但是总觉得这种 ~~暴力~~ 循环哪里看着怪怪的。
```javascript
while (parentNode.firstChild) {
    parentNode.removeChild(parentNode).lastChild);
}
```
### 让整个 div 可以被超链接
可以说是一个很不错的一个 trick ，具体的话也不好说，直接放链接：[Make a div into a link - Stack Overflow](https://stackoverflow.com/questions/796087/make-a-div-into-a-link)

### 使用 Grunt 完成一些自动化
> 参考：[Getting started - GruntJS](https://gruntjs.com/getting-started)

目前只想到自动化来缩小项目文件，所以整个配置都会变得很简单。

在此之前要安装全局的 `grunt-cli` ，作用是调起项目中的 grunt 并运行，这样运行相应任务只要运行 `grunt <任务名>` 就行了：
```bash
npm install -g grunt-cli
```

然后在项目中安装 `grunt` 、 `grunt-contrib-uglify` 和 `grunt-contrib-cssmin`：
```bash
npm install grunt --save-dev
npm install grunt-contrib-uglify --save-dev
npm install grunt-contrib-cssmin --save-dev
```
安装完后可以考虑把 `node_modules` 添加到 `.gitignore` 里，如果不对包作直接的修改的话。

直接上官方的示例 `Gruntfile.js` ，然后自己改改：
```javascript
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'wolf-chews.js',
                dest: 'wolf-chews.min.js'
            }
        },
        cssmin: {
            build: {
                src: 'wolf-chews.css',
                dest: 'wolf-chews.min.css',
            }
        }
    });
  
    // Load the plugins.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
  
    // Default task(s).
    grunt.registerTask('build', ['uglify', 'cssmin']);
  
  };
```

如果之后想要用 GitHub Action 自动执行 `grunt` 命令，可以在 `package.json` 里设置测试用命令：
```
"scripts": {
    "test": "node -e \"var g = require('grunt'); g.cli.tasks = ['build']; g.cli()\""
},
```
这样就不用在 Action 流程里安装 `grunt-cli` 而直接执行 `npm test` 就行。

编写 `publish-to-npm.yml` 用 GitHub Action 帮我完成这些任务并发布在 npm 上：
```yaml
name: Publish to NPM

on:
  push:
    branches:
      - main

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - uses: actions/setup-node@v1
        with:
          node-version: 10
      - run: npm install
      - run: npm test
      - run: rm -rf .vscode .github
      - uses: JS-DevTools/npm-publish@v1
        with:
          token: ${{ secrets.NPM_TOKEN }}
          dry-run: false
```

-----
于是，这个大坑就这样先告一段落了。

各位看官可以在 [404页面](/404.html) 看到这个功能的实装了！

-----
你以为这就结束了吗？

~~在另外一个夜黑风高的夜晚~~，当我躺在床上时，脑海里突然涌现一个想法：既然你都会 Javasript 了，要不你把 Wolf-bites-tweets 用 Javascript 重写一遍吧。

于是，下期预告：Wolf-Bites-Tweets v2.0 的开发（Node.js）

> 开坑不止，填坑不息。   
> —— Kreee
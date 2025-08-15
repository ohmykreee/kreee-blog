---
title: "wolf-bites-tweets 2.0.0 开发小记"
date: 2021-10-27T22:59:38+08:00
draft: false
categories: ['Learning']
tags: ['JavaScript', 'Backend', 'GitHub', 'Learning', '2021']
summary: "为啥在已经有 wolf-bites-tweets v1 的情况下，还要重写并开发 v2.0.0 呢？"
---
## 万恶之源
接上文： [wolf-bites-tweets 和 wolf-chews-tweets 开发小记](/article/notes-of-developing-wbt-and-wct/)

项目地址： [https://github.com/ohmykreee/wolf-bites-tweets](https://github.com/ohmykreee/wolf-bites-tweets)

为啥在已经有 wolf-bites-tweets v1 的情况下，还要重写并开发 v2.0.0 呢？原因有俩：   
1. 想要节省下 build docker image 花掉的十几秒，以及那种直接运行的安全感。（？）
2. JavaScript 初上手，想要体验一下用 Node.js 开发后端的流程。

-----
## 设置代理
因为某些大家都懂的原因，整个开发都需要在代理环境下进行。

但是问题来了：原先用 Python 写的时候执行 GET 命令用的是第三方库，只需要传递环境变量就能完成代理的设置。然鹅在开发 JavaScript actions 包时，有一个原则就是尽量不要引入第三方包（原因之后会提及），所以 GET 方法只能使用内置库完成。结果写的时候死活都无法从代码层面上让程序走本地建立的代理：要么就是 `hostname not resolved` 或是 `connect reject from 127.0.0.1:443` ;也尝试过引入第三方库来解决，结果也是无功而返。

最后忍无可忍，还是使用了 Clash 的 TAP 模式：
[Clash TUN 和 TAP 模式 - EdNovas 的小站](https://ednovas.xyz/2021/02/15/clashtun/) 讲的挺详细的，再搭配上 [官方文档](https://docs.cfw.lbyczf.com/contents/tap.html)，就能轻松搭建全局的代理。大致流程在这里也提一提：
1. 在 `General` 页面的 `TAP Device` 旁边的 `Manage`, 点击 `Install`；
2. 在 `Settings` 页面 `Profile Mixin` 部分的 `YAML` 旁边的 `Edit`，把官方文档里的配置文件复制进去；
3. 回到 `General`，关掉 `System Proxy`，打开 `Mixin`。   
如果一切顺利，网络应该是显示连接到 clash-tap。

-----
## `@actions/core` 包
说是说官方推荐的工具包，但是整个项目开发完后我只想说一句话：**对它是真的无语**。

首先， `core.setFailed()` 方法看名字应该是那种抛出错误同时结束程序的功能对吧？结果本地测试的时候发现程序并没有按预期结束。去翻了翻源码，**大无语事件发生了**：整个 `core.setFailed()` 方法就是一行 `core.error()` 再加上一行设置退出码为 1 ，没了。根本不涉及退出程序的操作。那意思是说我用完 `core.setFailed()` 之后还要手动 `exit()` ？那为啥我不直接用 `core.error()` 加 `exit(1)` 呢，还能自定义退出码？

其次，所有 `core.notice()` ，`core.warning()`，`core.error()` 方法在本地测试的时候都不会输出内容到调试工作台，就导致本地测试的时候贼痛苦。最后还是开发了 local-run 功能给本地测试用，顺便也给程序添加一个新功能。

最后，**最令人无语的事件发生了**。你作为官方推荐的工具包，你就应该提前在环境里安装好对吧？结果呢，并没有。再加上 actions 包在运行前是不会执行 `npm install --production` ，也就导致了要么不要引入第三方包，要么就提前在 node_modules 文件夹里准备好第三方包。最终的解决方法是在 `.gitignore` 里加了两行：
```plaintext
/node_modules/*/
!/node_modules/@actions/
```
提醒一下，第一行不能换成 `node_modules/`，不然整个 node_modules 文件夹都不会被跟踪，第二行排除规则自然也不会生效。使用原文这行就会跟踪 node_modules 文件夹的同时不跟踪其下所有文件（夹），第二行规则才会生效。

（更加无语的是，因为最后一个大无语事件，我的 main 分支多了一串 dirty commits。而且如果要真正测试 actions 包的话一定需要创建 Release 而不能直接在当前项目仓库里测试，所以这些 dirty commits 又是不可避免的，就非常的气）

-----
## http GET
直接用的是这里的实现方法：[HTTP GET Request in Node.js Express - Stack Overflow](https://stackoverflow.com/questions/9577611/http-get-request-in-node-js-express)

其实本来复制粘贴就没事了，但是在 JavaScript 中，涉及网络和 I/O 等长时间占用操作默认是异步的。而对于从来没有接触过异步的新手来说，是一个比较麻烦的问题。

（据说 Axios 库挺好的，下次一定试试）

-----
## 异步！异步！异步！
久仰异步大名，听说异步是萌新杀手，今天可是真正见到其真面目。

异步是写 JavaScript 程序必须要过的一个坎，因为很多方法都是异步进行的。而异步问题最关键的一点就是**如何判断一个异步方法结束运行了**，并得到返回值。主流的话是两种处理方法：Old-style 的 callbacks 方法和最近才被引入的 async/await 方法：

### callbacks 方法
参考文档：[What are callbacks? - Node.js](https://nodejs.org/en/knowledge/getting-started/control-flow/what-are-callbacks/)
```javascript
function processData (callback) {
  fetchData(function (err, data) {
    if (err) {
      console.log("An error has occurred. Abort everything!");
      return callback(err);
    }
    data += 1;
    callback(data);
  });
}
```
在这段示例代码中，`callback` 变量以及传递给 `fetchData()` 方法的那个函数都是使用了 callbacks 方法。而理解 callbacks 的精髓在于**把一个方法作为变量传递给异步的方法**，而在异步的方法结束并得到数据后传递回原先传递给它的方法。听起来很绕，不是吗？但是如果你真正理解了你就会感觉这个解决方法绝妙极了：
```javascript
let data
processData(function beCalled (result) {
    data = result
})
console.log(data)
```
首先，上面的代码中调用了 `processData()` 方法，并且把名字为 `beCalled()`（实际应用中可以不用命名，直接省略） 并写有 `data = result` 的方法传递给 `processData()`；`beCalled()` 在 `processData()` 里有了一个新名字： `callback()`。在 `processData()` 中运行完成后并调用 `callback()` 方法，会把变量 `data` 中的数据重新传回到 `beCalled()` 并传递给 `beCalled()` 方法的 `result` 变量中。这样就完成了一次 callbacks。

### async/await 方法
async/await 功能是最近才被引入的，目的就是让你写异步的时候有一种“回到家的感觉”。

首先，在你想使用这个功能的方法前声明 `async`。**没有声明 async 的方法是无法使用 await 功能的**。

然后你就可以快乐地使用 `await` 啦！`await` 的功能其实非常简单：在 `await` 后跟的 Promise 只有运行完成并返回值后，整个程序才会进行下去，否则就会停在那一行代码上：
```javascript
async function fun_with_async () {
    ...
    
    let a = await this_is_a_promise()

    ...
}
```
而 Promise 则是一种特殊的方法，会返回方法得到的值以及运行结果，有三种运行状态：pending、fulfilled、rejected。关于怎么写 Promise 可以 ~~直接对着文档抄就行了~~ ：[Promise - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

以及关于 async/await 的高阶用法以及如何更高效地让程序跑得更快也可以在这里学到：[Making asynchronous programming easier with async and await - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await)

综上，可以看出真正在 JavaScript 编程中写一些复杂的方法是很少用 `return` 的，更多的是使用 callbacks（毕竟异步这种东西好是好，就是处理起来有点麻烦）。在实际运用中，也可以考虑 callbacks 方法和 async/await 方法同时使用（比如我，我愿称之为把毕生所学都给整上（误））。

-----
## 设置环境变量
主要是用来 debug 用，如果用在 local-run 功能上相比直接传递参数还是麻烦了一点。

GitHub actions 转换输入为环境变量的方法（直接从源代码里截的）：`INPUT_${name.replace(/ /g, '_').toUpperCase()}`

比如 `bearer-token` 就会被转换为 `INPUT_BEARER-TOKEN`。

-----
## 获取传递的参数
[How to parse command line arguments - Node.js](https://nodejs.org/en/knowledge/command-line/how-to-parse-command-line-arguments/)

原文档我觉得已经讲得很清楚了，我这里就简单提一下：
1. `process.argv` 会直接返回由跟在后面的参数组成的 array；
2. 第三方包 yargs 可以大大简化这一步骤。

-----
## 字符拼接小妙招
用反单引号框起来后，用 `${变量名}` 来代替变量值，空格都会被保留。

用起来很像 Python 里的 `format()` 方法。麻麻再也不用担心我用加号痛苦地连接字符串啦。

-----
## for in 和 for of
`for in` 是给 object 用的；   
`for of` 是给 array 用的。

用错了会直接不执行哦。

-----
## 写入文件
[How do I write files in Node.js? - Node.js](https://nodejs.org/en/knowledge/file-system/how-to-write-files-in-nodejs/)

原文档也已经讲得很详细了。就是异步要稍微注意一下。如果之前异步整明白的话，读这个文档也没啥太大压力。

-----
## ~~当事人~~ 发言
从10月13日开坑，到11月2日 wolf-bites-tweets v2.0.0 推出标志着填坑正式告一段落，这之间长达20多天。20天说长也不长说短也不短，虽然这些天来自学业的压力和部门安排的任务让我并没有大把的时间去做这个项目，在写这个项目的时候也遇到了很多困难和烦心事，但是经历下来我还是挺享受整个过程的。

不知道为啥，我还是挺喜欢解决问题这一过程：从运用搜索引擎寻找资料，到查找一个 bug 背后产生的原因，再到根据已有的资料和别人的解决方法来想出一个适合自己的解决方法。这个过程的确很累，在外人也许看来我在整一些“没用的东西”，但是谁知道呢？或是说，这是因为我在为了实现自己一个小小的需求而“费劲”，是在真正为我自己做一些东西，而不是为了他人或是生计。这何尝不是一种乐趣呢？

20天从入门 JavaScript 到写一个简单的项目，的确有一定的挑战。我也承认我写的项目也有很多不完善的地方，我也有很多东西需要去学习。学习之旅还很长，与君共勉。

> 到头来，还是 Python 爱我。   
>—— Kreee
---
title: "使用 Android Pad 进行（前端）开发"
date: 2021-12-05T09:48:10+08:00
draft: false

categories: ['Learning']
tags: ['Termux', 'Frontend', 'Learning', 'VSCode', 'code-server', '2021']
author: "Kreee"
noSummary: false

resizeImages: true
---

四舍五入安卓系统是 Linux，四舍五入可以在安卓系统上直接进行开发。

~~四舍五入又水了一篇~~

<!--more-->

-----
## 写在前面

得益于强大的 Termux，我们可以在安卓系统上玩一些 ~~奇奇怪怪~~ 的东西。

一切都开始于那一天：当我刷着B站，主页刷到了一个关于 code-server 的视频，然后从评论区里得知原来 Termux 还可以安装 Linux 发行版。这我就来劲了啊：本来当时买这个板子的时候就想着能不能用它进行一些简单的开发，结果发现 [GitHub Web Editor](https://github.dev) 这个官方的在线编辑器只能进行文本编辑。现在既然 Termux 里能安装（几乎）全功能的 Linux 发行版，那可玩性就不止一点了。而且操作下来也非常的简单，可以说 Termux 永远的神好吧（误）。

> 当我被告知 Termux 可以安装 Linux 发行版的时候，我就知道，它小命就不保了。   
> —— Kreee

（如果你还是嫌麻烦的话/不喜欢纯命令行的环境，我也发现了一个别人做的挺好的一个整合：[AidLux](http://www.aidlearning.net) ，开箱即用的那种，而且初始就配备了图形化界面，并且（好像）配置好了 GPU 加速的 AI 开发环境。至于为啥我不用那个，其实当我知道那个软件的底层就是 Termux 的时候，我就有点没有兴致了：既然就是个整合，为啥我不自己整一个呢？）

-----
## 安装 Termux 和 `proot-distro`
安装 Termux 的话， F-Droid（推荐）和 Google Play Store 上都有，再不行酷安上也有得下，这里我就不贴链接了。

安装完之后，直接使用包安装管理器安装 `proot-distro` 就行了：
```bash
pkg install proot proot-distro
```

如果说下载慢的话，可以考虑一下[换源为清华镜像源](https://mirrors.tuna.tsinghua.edu.cn/help/termux/)。

-----
## 安装 Linux 发行版
直接执行 `proot-distro list` 就可以查看可供安装的 Linux 发行版。

如果对储存空间和性能有一定要求的同学，可以考虑使用 Alpine Linux 发行版。这里因为要追求比较完整的 Linux 体验（以及自己对 Ubuntu 比较熟悉），就选择了 Ubuntu 发行版：
```bash
proot-distro install ubuntu
```
等它把必要文件下载好了之后，就可以使用 `proot-distro login ubuntu` 进入 Ubuntu 了！

-----
## 一些配置，和安装 `code-server`
这个 Ubuntu 环境拿到手了，第一步当然是换源为国内源了。由于这个环境还没有文本编辑器，还得先安装一个：
```bash
apt install vim
```
安装的时候按提示配置好地区后，就可以根据[这个文章换清华源了](https://mirrors.tuna.tsinghua.edu.cn/help/ubuntu-ports/)。（注意几点：一是因为是 arm64 环境，要用 ubuntu-ports 的镜像源，二是默认安装的 Ubuntu 版本是最新的（截止写这篇博文的时候是 21.10），改镜像源的时候要注意一下）

之后就是常规的安装一些需要的软件：
```
apt install git curl
```

[安装 code-server](https://github.com/cdr/code-server) 也很傻瓜化，直接下载并运行安装脚本就行：
```bash
curl -fsSL https://code-server.dev/install.sh | sh
```
安装完了之后再顺便改一下 `code-server` 的配置文件：
```bash
cd ~/.config/code-server/
cp config.yaml config.yaml.bak # 修改配置文件前备份原文件是个好习惯
vim config.yaml
```
整个配置文件的结构是这样的：
```yaml
bind-addr: 127.0.0.1:8080
auth: password
password: mew...22 # 随机生成的密码
cert: false
```
我个人习惯是保留第一行不变，然后把第二行的 `auth` 方法改为 `none`。

至于为啥第一行不改的原因是我第二行选择验证方式为不验证，而为了安全（在 VSCode 里是能够直接访问本机的命令行的），仅允许来自本机的连接；而如果我想临时允许局域网内的设备连接的话，我就在运行的时候加上 `--bind-addr=0.0.0.0:8080` 就行了。如果你有这样的需求的话，也可以直接在配置文件里把第一行改为 `0.0.0.0:8080`。

保存完配置文件后，（可能）要先退出一下 Ubuntu 环境(直接输入 `exit` 就行)，然后再用 `proot-distro login ubuntu` 进入，运行 `code-server` 命令，把 Termux 挂在后台，打开任意现代的浏览器访问 `localhost:8080`，就能愉快玩耍了！

-----
## 更多玩法！
其实呢，安卓设备的性能毕竟有限，一些大型的项目我猜放这上面开发体验也不是很好。不过前端开发对设备性能要求不高，并且这也是我一开始就想实现的。

其实也不难，直接使用 [NVM 的安装脚本](https://github.com/nvm-sh/nvm) ，重开一下 Ubuntu 环境，安装个 Node.js，项目的话直接用 git 从 GitHub 上 Clone 到本地，就可以愉快玩耍了。

如果想要编辑安卓储存空间里的文件的话，可以使用 [termux-setup-storage](https://wiki.termux.com/wiki/Termux-setup-storage) 来允许 Termux 访问安卓储存空间。具体操作的话因为我也没去搞，大家就看看官方文档就行。

Hugo 的话我没从 Snap Store 上下载，而是直接使用了 `apt` 里的 Hugo，虽然版本不是最新版的，但是 ~~我懒啊~~ （而且 Snap 还要自己另外装，试了一遍不知道为啥没成功）

Python 的话我也整了一个。直接在 Ubuntu 环境下安装：
```bash
apt install python3
apt install pip
```
然后在 VSCode 里安装 Python Debugger 插件就行了。首次使用要选择 Python 解释器。虽然我不知道为啥触屏模式下最下面那一栏不能拿手戳（包括设置里的好多下拉菜单），选不了 Python 解释器，最后还是外接了一个鼠标给解决了。运行效率还没有测试，但是谁知道呢，也就写着玩玩，大项目不还得在电脑上跑。

（应某人的需求）按照常理也是可以配置 C 开发环境的，只要安装一个 `gcc` 和一个 C Debugger 插件就行。但是由于不知为何写这篇博文的时候插件因为网络原因没办法安装，之后再试试。

至于其他玩法嘛，完整的 Linux 环境都摆在这里了，只要软件有 arm64 架构的包，都能安装。甚至你还可以安装一个 `termux-api` 插件访问安卓系统的一些 API，至于那些玩法就以后去探索吧。

（以及，这篇博文就是在这个开发环境下写的哦！又多了一个不开电脑的理由。）
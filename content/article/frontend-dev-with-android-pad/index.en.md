---
title: "Developing (Frontend) on an Android Pad"
date: 2021-12-05T09:48:10+08:00
draft: false
categories: ['Learning']
tags: ['Termux', 'Frontend', 'Learning', 'VSCode', 'code-server', '2021']
summary: "Roughly speaking, Android is Linux, so you can develop directly on Android."
---

{{< alert icon="language">}}
The English version is translated by AI (Gemini 2.5 Pro Preview). If you want to view the original content, please switch to Chinese version.
{{< /alert >}}

---

Roughly speaking, Android is Linux, so you can develop directly on Android.

~~Roughly speaking, I've written another post.~~

-----
## Foreword

Thanks to the powerful Termux, we can play some ~~weird~~ things on Android.

It all started that day: when I was browsing Bilibili, a video about code-server appeared on my homepage, and then I learned from the comments that Termux can also install Linux distributions. This got me excited: when I bought this tablet, I was thinking about whether I could use it for some simple development, but I found that the official online editor [GitHub Web Editor](https://github.dev) can only edit text. Now that Termux can install (almost) a full-featured Linux distribution, the playability is more than a little. And the operation is also very simple, it can be said that Termux is forever God (mistake).

> When I was told that Termux could install a Linux distribution, I knew its life was over.
> -- Kreee

(If you still find it troublesome/don't like the pure command line environment, I also found a good integration made by others: [AidLux](http://www.aidlearning.net), which is out of the box, and is initially equipped with a graphical interface, and (it seems) has configured a GPU-accelerated AI development environment. As for why I don't use that, in fact, when I knew that the underlying layer of that software is Termux, I was a little less interested: since it is an integration, why don't I make one myself?)

-----
## Install Termux and `proot-distro`
To install Termux, you can find it on F-Droid (recommended) and Google Play Store, and if not, you can also download it from Coolapk. I won't post the link here.

After installation, you can directly use the package installation manager to install `proot-distro`:
```bash
pkg install proot proot-distro
```

If the download is slow, you can consider [changing the source to the Tsinghua mirror source](https://mirrors.tuna.tsinghua.edu.cn/help/termux/).

-----
## Install Linux distribution
Just execute `proot-distro list` to see the available Linux distributions for installation.

If you have certain requirements for storage space and performance, you can consider using the Alpine Linux distribution. Here, because I want to pursue a more complete Linux experience (and I am more familiar with Ubuntu), I chose the Ubuntu distribution:
```bash
proot-distro install ubuntu
```
After it has downloaded the necessary files, you can use `proot-distro login ubuntu` to enter Ubuntu!

-----
## Some configuration, and installing `code-server`
After getting this Ubuntu environment, the first step is of course to change the source to a domestic source. Since this environment does not have a text editor yet, you have to install one first:
```bash
apt install vim
```
After configuring the region as prompted during installation, you can [change to the Tsinghua source according to this article](https://mirrors.tuna.tsinghua.edu.cn/help/ubuntu-ports/). (Note a few points: first, because it is an arm64 environment, you must use the ubuntu-ports mirror source, and second, the default installed Ubuntu version is the latest (as of writing this blog post, it is 21.10), so pay attention when changing the mirror source)

After that, it is the routine installation of some required software:
```
apt install git curl
```

[Installing code-server](https://github.com/cdr/code-server) is also very simple, just download and run the installation script:
```bash
curl -fsSL https://code-server.dev/install.sh | sh
```
After the installation is complete, change the `code-server` configuration file by the way:
```bash
cd ~/.config/code-server/
cp config.yaml config.yaml.bak # It is a good habit to back up the original file before modifying the configuration file
vim config.yaml
```
The structure of the entire configuration file is as follows:
```yaml
bind-addr: 127.0.0.1:8080
auth: password
password: mew...22 # randomly generated password
cert: false
```
My personal habit is to keep the first line unchanged, and then change the `auth` method in the second line to `none`.

As for why the first line is not changed, it is because I choose not to verify the authentication method in the second line, and for security (in VSCode, you can directly access the command line of the local machine), only connections from the local machine are allowed; and if I want to temporarily allow devices in the local area network to connect, I will add `--bind-addr=0.0.0.0:8080` when running. If you have such a need, you can also directly change the first line to `0.0.0.0:8080` in the configuration file.

After saving the configuration file, you may need to exit the Ubuntu environment first (just enter `exit`), and then use `proot-distro login ubuntu` to enter, run the `code-server` command, hang Termux in the background, open any modern browser to access `localhost:8080`, and you can play happily!

-----
## More ways to play!
In fact, the performance of Android devices is limited after all, and I guess the development experience of some large projects on it is not very good. However, front-end development does not have high requirements for device performance, and this is what I wanted to achieve from the beginning.

In fact, it is not difficult. Just use the [NVM installation script](https://github.com/nvm-sh/nvm), restart the Ubuntu environment, install Node.js, and clone the project from GitHub to the local with git, and you can play happily.

If you want to edit files in the Android storage space, you can use [termux-setup-storage](https://wiki.termux.com/wiki/Termux-setup-storage) to allow Termux to access the Android storage space. As for the specific operation, because I haven't done it, you can just read the official documentation.

I didn't download Hugo from the Snap Store, but directly used the Hugo in `apt`. Although the version is not the latest, ~~I'm lazy~~ (and Snap has to be installed separately, I tried it once and it didn't work for some reason)

I also have a Python. Just install it in the Ubuntu environment:
```bash
apt install python3
apt install pip
```
Then install the Python Debugger extension in VSCode. You need to select the Python interpreter for the first time. Although I don't know why the bottom bar in touch screen mode can't be poked by hand (including many drop-down menus in the settings), I can't select the Python interpreter. Finally, I connected an external mouse to solve it. The running efficiency has not been tested yet, but who knows, it's just for fun, and large projects still have to be run on a computer.

(At someone's request) It is also possible to configure a C development environment according to common sense, as long as you install a `gcc` and a C Debugger extension. However, since the extension could not be installed due to network reasons when writing this blog post, I will try again later.

As for other ways to play, the complete Linux environment is here. As long as the software has an arm64 architecture package, it can be installed. You can even install a `termux-api` plugin to access some APIs of the Android system. As for those ways to play, let's explore them in the future.

(And, this blog post was written in this development environment! Another reason not to turn on the computer.)

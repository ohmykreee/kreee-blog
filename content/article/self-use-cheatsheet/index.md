---
title: "自用备忘录表"
date: 2021-06-06T19:53:42+08:00
draft: false
categories: ['Learning']
tags: ['Selfhosted', 'Learning', '2021']
---
一个自用的备忘录表，记录一下要用但是又容易忘记的命令。   
不断更新中...

<!--more-->

-----

## Git
### 初始化
```bash
git init
```
### 关联远程仓库
```bash
git remote add origin <remote address>
git -M main # 切换默认分支到main(master 不再用)
git pull <local> <remote>
```
### 提交修改
```bash
git add <file>
git commit -m 'descriptions'
git push origin main
```
### 分支管理
```bash
git branch <branch name>            # 创建<branch name>分支
git checkout <branch name>          # 切换至<branch name>分支
git switch <branch name>            # 切换至<branch name>分支
git checkout -b <branch name>       # 创建并切换至<branch name>分支
git switch -c <branch name>         # 创建并切换至<branch name>分支
git branch                          # 查看已有分支（* 表示当前分支）
git merge <branch name>             # 合并<branch name>到当前分支（通常在master分支下操作）
git branch -d <branch name>         # 删除分支（本地）
git push <local> --delete <remote>  # 删除分支（远程）
```
### 子模块
```bash
git submodule add <submodule address> <local folder> # 添加子库，使用 --force 强制使用本地已有文件
git submodule foreach git pull    #子模块更新
```

-----
## Linux (Ubuntu) 操作相关
### 更改当前环境的 Java 版本
```bash
sudo update-alternatives --config java
```

### 创建无 Shell 的用户
根据 [nobody - Ubuntu Wiki](https://wiki.ubuntu.com/nobody)，不建议将程序的运行权限设置为 `nobody:nogroup`，而是额外创建一个新的用户组。

（没办法偷懒了呜呜呜）

（方法来自 [How can I create a non-login user? - superuser](https://superuser.com/questions/77617/how-can-i-create-a-non-login-user)）
```bash
sudo useradd -r <username>
```
将会创建一个组名和用户名都为 `<username>` 的用户，且无用户目录。

-----
## Certbot
### dns-challenge 自签名
```bash
certbot certonly --manual --preferred-challenges dns --email xxxxxx.xxxxx@outlook.com --agree-tos -d *.ohmykreee.top
```

-----
## pppoe-setup
### 设置拨号
```bash
pppoe-setup # 开始交互式操作
```
### 连接和断连
```bash
ifup ppp0
ifdown ppp0
```
### 状态
```bash
ifconfig ppp0
pppoe-status
```

-----
## docker
### 列出容器
```bash
docker ps -a
```
### 管理容器
```bash
docker start/stop/restart/rm/port/logs <container>
```
### 后台运行容器
```bash
docker run -itd --name <name> <container>  # -it: 使用交互模式并分配一个伪终端
docker exec -it <container>                # -d: 后台运行容器，并返回容器ID
```
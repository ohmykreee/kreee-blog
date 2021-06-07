---
title: "自用备忘录表"
date: 2021-06-06T19:53:42+08:00

categories: ['Learning']
tags: ['Selfhosted', 'Learning', '2021']
author: "Kreee"
noSummary: false

resizeImages: true
---
一个自用的备忘录表，记录一下要用但是又容易忘记的命令。   
不断更新中...

<!--more-->
-----
目录
{{<toc>}}

-----

## Git
### 初始化
```
git init
```
### 关联远程仓库
```
git remote add origin <remote address>
git -M main # 切换默认分支到main(master 不再用)
git pull <local> <remote>
```
### 提交修改
```
git add <file>
git commit -m 'descriptions'
git push origin main
```
### 分支管理
```
git branch <branch name>            # 创建<branch name>分支
git checkout <branch name>          # 切换至<branch name>分支
git switch <branch name>            # 切换至<branch name>分支
git checkout -b <branch name>       # 创建并切换至<branch name>分支
git switch -c <branch name>         # 创建并切换至<branch name>分支
git branch                          # 查看已有分支（* 表示当前分支）
git merge <branch name>             # 合并<branch name>到当前分支（通常在master分支下操作）
git branch -d <branch name>         # 删除分支
git branch -m <oldbranchname> <newname> # 合并分支
```
### 子模块
```
git submodule add <submodule address> <local folder> # 添加子库，使用 --force 强制使用本地已有文件
git submodule foreach git pull    #子模块更新
```

-----
## Certbot
### dns-challenge 自签名
```
certbot certonly –manual –preferred-challenges dns –email xxx@outlook.com –agree-tos -d *.ohmykreee.top
```

-----
## pppoe-setup
### 设置拨号
```
pppoe-setup # 开始交互式操作
```
### 连接和断连
```
ifup ppp0
ifdown ppp0
```
### 状态
```
ifconfig ppp0
pppoe-status
```

-----
## docker
### 列出容器
```
docker ps -a
```
### 管理容器
```
docker start/stop/restart/rm/port/logs <container>
```
### 后台运行容器
```
docker run -itd --name <name> <container>  # -it: 使用交互模式并分配一个伪终端
docker exec -it <container>                # -d: 后台运行容器，并返回容器ID
```
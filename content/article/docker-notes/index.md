---
title: "Docker 学习小记"
date: 2021-03-01T15:44:08+08:00

categories: ['Learning']
tags: ['Selfhosted', 'Learning']
author: "Kreee"
noSummary: false

resizeImages: false
---
本来一开始不打算使用 Docker 来配置服务：虽然的确 Docker 能省下配置环境的麻烦，但是总觉得哪里不舒服（误）。   
其实是因为服务器不是长时间运行的，会时不时关机/重启，还要重新到 Docker 里启动。   
以及据说有安全隐患（其实其他软件配置不当也会有安全隐患233）   
但是现在是真的闲的无聊 + 还是有很多软件是基于 Docker 的（还是只提供了 Docker 的安装教程，吐了），故打算核心服务直接部署在服务器里，整一些不重要的东西放在 Docker 里。   
Now, let's begin!   

<!--more-->


-----
## 安装 Docker
```
基于 https://mirrors.tuna.tsinghua.edu.cn/help/docker-ce/
```
如果是全新安装（并且使用的是 Minimal 安装的话），是没有预装 Docker 的。如果有请先卸载。   
查询是否有 Docker ：
```
rpm -qa | grep Docker
```
卸载 Docker ：
```
yum remove docker docker-common docker-selinux docker-engine
```
安装依赖：
```
yum install -y yum-utils device-mapper-persistent-data lvm2
```
下载 repo 文件：
```
wget -O /etc/yum.repos.d/docker-ce.repo https://download.docker.com/linux/centos/docker-ce.repo
```
替换软件仓库地址（此处为 TUNA ）   
（什么时候我们学校也搞一个开源软件镜像库）
```
sed -i 's+download.docker.com+mirrors.tuna.tsinghua.edu.cn/docker-ce+' /etc/yum.repos.d/docker-ce.repo
```
安装 Docker ：
```
yum makecache fast
yum install -y docker-ce
```
启动 Docker ：
```
systemctl start docker
```

-----
## Docker 的使用
列出所有容器：
```
docker ps -a
```
启动一个容器（使用容器 ID ）：
```
docker start *containerID*
```
同理，停止 `stop` ，重启 `restart` ,清除 `rm` ,查看映射端口 `port` ，查看日志 `logs` 。

创建容器并后台运行与进入后台容器：
```
docker run -itd --name *yourname* *container*
docker exec -it *containerID*
```

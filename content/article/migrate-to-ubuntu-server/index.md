---
title: "将后端服务器系统迁移至 Ubuntu server"
date: 2021-07-16T14:31:14+08:00
draft: false

categories: ['Learning']
tags: ['Selfhosted', 'Learning', '2021']
author: "Kreee"
noSummary: false

resizeImages: false
---
## What happend?
本来用 CentOS 7 用得开开心心的，结果了解到 Redhat 公司要整治一下我们这群白嫖怪（感觉被强行喂了一口💩）。   
So, 为了服务器的可持续发展（其实是放假闲得无聊），顺便重装一下机器的系统，以及更新一下远古的备忘指南，Let's begin!

<!--more-->

-----
**目录：**
{{<toc>}}

-----
## Install OS
安装版本: Ubuntu server 20.04 LTS   
跟着指示走就行。
安装中要求输入的用户名与密码为之后需要登陆用的普通账号，如果需要提权操作需要 `sudo` 命令，且密码为自己账号的密码。   

-----
## Config OpenSSH
在安装阶段的时候就提示是否安装 OpenSSH。  
同时，需要启用防火墙并设置端口：
```bash
sudo ufw enable
sudo allow ssh
sudo ufw reload
``` 
查看当前状态：
```bash
sudo ufw status
```

-----
## Swap mirror
> 参考： https://mirrors.tuna.tsinghua.edu.cn/help/ubuntu/

更改包安装管理器设置文件：
```bash
sudo vim /etc/apt/sources.list
```
然后根据提示添加 Tuna 源。

-----
## First update
```bash
sudo apt update
# 更新软件列表
sudo apt dist-upgrade
# 更新软件，单运行 upgrade 可能会导致更新系统
```

-----
## Set up auto-update
> 参考： https://help.ubuntu.com/community/AutomaticSecurityUpdates
```bash
sudo dpkg-reconfigure --priority=low unattended-upgrades
```
使用默认设置（一天检查一次）即可。

-----
## Set up Router
因为被网络桥接和 NAT 彻底整“破防”，一气之下决定：   
在系统里[虚拟出一个 OpenWRT ！](https://github.com/ohmykreee/kreee-blog/blob/main/content/article/openwrt-under-qemu-arm/index.md)


（2022/2/7 更新）
找到了一个项目：[lakinduakash / linux-wifi-hotspot](https://github.com/lakinduakash/linux-wifi-hotspot)，可以一步部署一个简单的无线路由器。

添加 ppa 包并安装：
```bash
sudo add-apt-repository ppa:lakinduakash/lwh
sudo apt install linux-wifi-hotspot
```
编辑 `/etc/create_ap.conf` 后，使用 `systemctl start create_ap` 启动 AP, `systemctl enable create_ap` 开机启动。

-----
## Set up serial login with getty
```bash
sudo cp /usr/lib/systemd/system/serial-getty@.service /etc/systemd/system/serial-getty@ttyS0.service
sudo systemctl daemon-reload
sudo systemctl start serial-getty@ttyS0.service
sudo systemctl enable serial-getty@ttyS0.service
```

-----
## Usage of ufw
查看当前状态和开放端口：
```bash
sudo ufw status
```
开放端口：
```bash
sudo ufw allow 8000/tcp
sudo ufw allow 7000
sudo ufw allow from 192.168.6.0/24 to any port 25577
```
删除已经添加的规则：
```bash
# 列出已有规则的编号
sudo ufw status numbered
# 根据编号删除规则
sudo ufw delete 3
sudo ufw reload
```

-----
## Set up Certbot
> 参考： https://certbot.eff.org/lets-encrypt/ubuntufocal-other
```bash
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

-----
## Set up mumble
> 参考： https://wiki.mumble.info/   

安装：
```bash
sudo add-apt-repository ppa:mumble/release
sudo apt-get update
sudo apt-get install mumble-server
sudo dpkg-reconfigure mumble-server
```
开放端口`64738`。   
配置 `/etc/mumble-server.ini` 文件。   
服务名为`mumble-server`。   

-----
## Set up Netdata
> 参考： https://learn.netdata.cloud/docs/

因为奇奇怪怪的连接问题（指墙 Github），所以使用离线安装模式。
```bash
curl -s https://my-netdata.io/kickstart.sh > kickstart.sh

# Netdata tarball
curl -s https://api.github.com/repos/netdata/netdata/releases/latest | grep "browser_download_url.*tar.gz" | cut -d '"' -f 4 | wget -qi -

# Netdata checksums
curl -s https://api.github.com/repos/netdata/netdata/releases/latest | grep "browser_download_url.*txt" | cut -d '"' -f 4 | wget -qi -

# Netdata dependency handling script
# 奇奇怪怪的是经常失败，需要手动创建
wget -q - https://raw.githubusercontent.com/netdata/netdata/master/packaging/installer/install-required-packages.sh

# go.d plugin 
# For binaries for OS types and architectures not listed on [go.d releases](https://github.com/netdata/go.d.plugin/releases/latest), kindly open a github issue and we will do our best to serve your request
export OS=$(uname -s | tr '[:upper:]' '[:lower:]') ARCH=$(uname -m | sed -e 's/i386/386/g' -e 's/i686/386/g' -e 's/x86_64/amd64/g' -e 's/aarch64/arm64/g' -e 's/armv64/arm64/g' -e 's/armv6l/arm/g' -e 's/armv7l/arm/g' -e 's/armv5tel/arm/g') && curl -s https://api.github.com/repos/netdata/go.d.plugin/releases/latest | grep "browser_download_url.*${OS}-${ARCH}.tar.gz" | cut -d '"' -f 4 | wget -qi -

# go.d configuration 
curl -s https://api.github.com/repos/netdata/go.d.plugin/releases/latest | grep "browser_download_url.*config.tar.gz" | cut -d '"' -f 4 | wget -qi -
```
复制文件到服务器并给予运行权限：
```
# 不安全，本不应该使用0777权限
sudo chmod -R 0777 /tmp/netdata
```
运行：
```
cd /tmp/netdata
sudo bash ./kickstart.sh --local-files /tmp/netdata/netdata-(version-number-here).tar.gz /tmp/netdata/sha256sums.txt /tmp/netdata/go.d.plugin-(version-number-here).(OS)-(architecture).tar.gz /tmp/netdata/config.tar.gz /tmp/netdata/install-required-packages.sh --disable-telemetry
```
**提示**：安装时经常出问题的是 `install-required-packages.sh` ，需要特别关照。   
然后就是修改配置文件 `/etc/netdata/netdata.conf` 。   
在配置 SSL 的时候几率发生无法读取证书文件的问题（主要是 privkey.pem ）需要参考 https://certbot.eff.org/docs/using.html#where-are-my-certificates 来配置文件的权限。

-----
## Set up NP-Client
> 参考：https://ehang-io.github.io/

先将提前下好的 npc 文件复制到 `/tmp/npc` 下，并创建配置文件 `/etc/np-client.conf` ：
```conf
[common]
server_addr=cloud.ip:8024
conn_type=kcp
vkey=you_vkey_here
auto_reconnection=true
crypt=false
compress=false
```
使用命令安装：
```bash
cd /tmp/npc
sudo ./npc install -config=/etc/np-client.conf
```
```bash
sudo npc start
```

-----
## Set up Java and Minecraft
安装 openjdk（最新）：
```
sudo apt install default-jdk
```
老版本的 Minecraft 需要 Java 8 ，需要自己去甲骨文官网下载二进制文件。   
参考用的 `/etc/systemd/system/*.service` 文件：   
Java 8 ：
```ini
[Unit]
Description=Minecraft Server with Java 8
After=network-online.target
Wants=network-online.target

[Service]
User=minecraft
WorkingDirectory=/usr/local/mc_1_7_10/
ExecStart=/usr/local/jre1.8.0_271/bin/java -jar /usr/local/mc_1_7_10/forge-1.7.10-10.13.4.1558-1.7.10-universal.jar nogui

[Install]
WantedBy=multi-user.target
```
OpenJDK ：
```ini
[Unit]
Description=Minecraft Server
After=network-online.target
Wants=network-online.target

[Service]
User=minecraft
WorkingDirectory=/usr/local/mc_1_17/
ExecStart=/usr/bin/java -jar /usr/local/mc_1_17/server.jar nogui

[Install]
WantedBy=multi-user.target

```
记得开放端口：
```bash
# Minecraft 主端口
sudo ufw allow 25565
# Minecraft Rcon 控制端口
sudo ufw allow 25577
```

-----
## Set up Zerotier
懒，没人用，先不整。
> 参考： https://www.zerotier.com/download/

-----
## Set up PPPOE
安装配置程序：
```bash
sudo apt install pppoeconf
```
进行配置：
```bash
sudo pppoeconf
```
启动与断连：
```
# 连接
pon dsl-provider
# 断开
poff dsl-provider
```
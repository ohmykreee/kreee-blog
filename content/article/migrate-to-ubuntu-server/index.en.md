---
title: "Migrating the Backend Server System to Ubuntu Server"
date: 2021-07-16T14:31:14+08:00
draft: false
categories: ['Learning']
tags: ['Selfhosted', 'Learning', '2021']
author: "Kreee"
summary: "I was happily using CentOS 7, but then I learned that Red Hat is going to crack down on us free-riders (I feel like I was force-fed a mouthful of 💩). So, for the sustainable development of the server (actually, I'm just bored during the holidays), I'm reinstalling the system and updating the ancient cheat sheet."
---

{{< alert icon="language">}}
The English version is translated by AI (Gemini 2.5 Pro Preview). If you want to view the original content, please switch to Chinese version.
{{< /alert >}}

---

## What happened?
I was happily using CentOS 7, but then I learned that Red Hat is going to crack down on us free-riders (I feel like I was force-fed a mouthful of 💩).
So, for the sustainable development of the server (actually, I'm just bored during the holidays), I'm reinstalling the system and updating the ancient cheat sheet. Let's begin!

-----
## Install OS
Installation version: Ubuntu server 20.04 LTS
Just follow the instructions.
The username and password required during installation are for the normal account that will be used for login later. If you need to perform operations with elevated privileges, you need to use the `sudo` command, and the password is the password of your own account.

-----
## Config OpenSSH
During the installation phase, you will be prompted whether to install OpenSSH.
At the same time, you need to enable the firewall and set the port:
```bash
sudo ufw enable
sudo allow ssh
sudo ufw reload
```
Check the current status:
```bash
sudo ufw status
```

-----
## Swap mirror
> Reference: https://mirrors.tuna.tsinghua.edu.cn/help/ubuntu/

Change the package installation manager settings file:
```bash
sudo vim /etc/apt/sources.list
```
Then add the Tuna source according to the prompts.

-----
## First update
```bash
sudo apt update
# Update software list
sudo apt dist-upgrade
# Update software, running upgrade alone may cause the system to be updated
```

-----
## Set up auto-update
> Reference: https://help.ubuntu.com/community/AutomaticSecurityUpdates
```bash
sudo dpkg-reconfigure --priority=low unattended-upgrades
```
Use the default settings (check once a day).

-----
## Set up Router
Because I was completely "broken" by network bridging and NAT, I decided in a fit of anger:
[Virtualize an OpenWRT in the system!](https://github.com/ohmykreee/kreee-blog/blob/main/content/article/openwrt-under-qemu-arm/index.md)


(Updated on 2022/2/7)
Found a project: [lakinduakash / linux-wifi-hotspot](https://github.com/lakinduakash/linux-wifi-hotspot), which can deploy a simple wireless router in one step.

Add ppa package and install:
```bash
sudo add-apt-repository ppa:lakinduakash/lwh
sudo apt install linux-wifi-hotspot
```
Manually install `dnsmasq` (if using NAT mode):
```bash
apt install dnsmasq
```
Edit `/etc/create_ap.conf` ([example file](https://github.com/lakinduakash/linux-wifi-hotspot/blob/master/src/scripts/create_ap.conf))
```bash
GATEWAY=192.168.6.1
SHARE_METHOD=nat
COUNTRY=CN
WIFI_IFACE=wlp7s0
INTERNET_IFACE=enp1s0
SSID=MyAccessPoint
PASSPHRASE=MyPassword
```
Use `systemctl start create_ap` to start the AP, and `systemctl enable create_ap` to start it on boot.

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
Check the current status and open ports:
```bash
sudo ufw status
```
Open ports:
```bash
sudo ufw allow 8000/tcp
sudo ufw allow 7000
sudo ufw allow from 192.168.6.0/24 to any port 25577
```
Delete added rules:
```bash
# List the numbers of existing rules
sudo ufw status numbered
# Delete rules by number
sudo ufw delete 3
sudo ufw reload
```

-----
## Set up Certbot
> Reference: https://certbot.eff.org/lets-encrypt/ubuntufocal-other
```bash
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

-----
## Set up mumble
> Reference: https://wiki.mumble.info/

Installation:
```bash
sudo add-apt-repository ppa:mumble/release
sudo apt-get update
sudo apt-get install mumble-server
sudo dpkg-reconfigure mumble-server
```
Open port `64738`.
Configure the `/etc/mumble-server.ini` file.
The service name is `mumble-server`.

-----
## Set up Netdata
> Reference: https://learn.netdata.cloud/docs/

Due to strange connection problems (referring to the wall of Github), the offline installation mode is used.
```bash
curl -s https://my-netdata.io/kickstart.sh > kickstart.sh

# Netdata tarball
curl -s https://api.github.com/repos/netdata/netdata/releases/latest | grep "browser_download_url.*tar.gz" | cut -d '"' -f 4 | wget -qi -

# Netdata checksums
curl -s https://api.github.com/repos/netdata/netdata/releases/latest | grep "browser_download_url.*txt" | cut -d '"' -f 4 | wget -qi -

# Netdata dependency handling script
# It's strange that it often fails and needs to be created manually
wget -q - https://raw.githubusercontent.com/netdata/netdata/master/packaging/installer/install-required-packages.sh

# go.d plugin
# For binaries for OS types and architectures not listed on [go.d releases](https://github.com/netdata/go.d.plugin/releases/latest), kindly open a github issue and we will do our best to serve your request
export OS=$(uname -s | tr '[:upper:]' '[:lower:]') ARCH=$(uname -m | sed -e 's/i386/386/g' -e 's/i686/386/g' -e 's/x86_64/amd64/g' -e 's/aarch64/arm64/g' -e 's/armv64/arm64/g' -e 's/armv6l/arm/g' -e 's/armv7l/arm/g' -e 's/armv5tel/arm/g') && curl -s https://api.github.com/repos/netdata/go.d.plugin/releases/latest | grep "browser_download_url.*${OS}-${ARCH}.tar.gz" | cut -d '"' -f 4 | wget -qi -

# go.d configuration
curl -s https://api.github.com/repos/netdata/go.d.plugin/releases/latest | grep "browser_download_url.*config.tar.gz" | cut -d '"' -f 4 | wget -qi -
```
Copy the file to the server and grant execution permission:
```
# Unsafe, should not use 0777 permission
sudo chmod -R 0777 /tmp/netdata
```
Run:
```
cd /tmp/netdata
sudo bash ./kickstart.sh --local-files /tmp/netdata/netdata-(version-number-here).tar.gz /tmp/netdata/sha256sums.txt /tmp/netdata/go.d.plugin-(version-number-here).(OS)-(architecture).tar.gz /tmp/netdata/config.tar.gz /tmp/netdata/install-required-packages.sh --disable-telemetry
```
**Tip**: The problem that often occurs during installation is `install-required-packages.sh`, which requires special attention.
Then modify the configuration file `/etc/netdata/netdata.conf`.
When configuring SSL, there is a chance that the certificate file cannot be read (mainly privkey.pem). You need to refer to https://certbot.eff.org/docs/using.html#where-are-my-certificates to configure the file permissions.

-----
## Set up NP-Client
> Reference: https://ehang-io.github.io/

First, copy the pre-downloaded npc file to `/tmp/npc`, and create the configuration file `/etc/np-client.conf`:
```bash
[common]
server_addr=cloud.ip:8024
conn_type=kcp
vkey=you_vkey_here
auto_reconnection=true
crypt=false
compress=false
```
Use the command to install:
```bash
cd /tmp/npc
sudo ./npc install -config=/etc/np-client.conf
```
```bash
sudo npc start
```

-----
## Set up Java and Minecraft
Install openjdk (latest):
```
sudo apt install default-jdk
```
Older versions of Minecraft require Java 8, which you need to download the binary file from the Oracle official website.
Reference `/etc/systemd/system/*.service` file:
Java 8:
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
OpenJDK:
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
Remember to open the port:
```bash
# Minecraft main port
sudo ufw allow 25565
# Minecraft Rcon control port
sudo ufw allow 25577
```

-----
## Set up Zerotier
Lazy, no one uses it, so I won't do it for now.
> Reference: https://www.zerotier.com/download/

-----
## Set up PPPOE
Install the configuration program:
```bash
sudo apt install pppoeconf
```
Configure:
```bash
sudo pppoeconf
```
Start and disconnect:
```
# Connect
pon dsl-provider
# Disconnect
poff dsl-provider
```

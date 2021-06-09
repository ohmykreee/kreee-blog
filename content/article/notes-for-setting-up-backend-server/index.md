---
title: "Notes for Setting Up Back-end Server"
date: 2021-01-13T22:58:38+08:00

categories: ['Learning']
tags: ['Selfhosted', 'Learning', '2021']
author: "Kreee"
noSummary: false

resizeImages: false
---
## Install CentOS
OS: CentOS 7 Minimal 

<!--more-->
 
Summary:  
1. Date & Time: Shanghai
2. Network & Hostname: hostname to `kserver.localdomain`  
If you want to change hostname later, use:
```
hostnamectl set-hostname AnythingYouLike.localdomain
```

When installing:
1. Set a root password

-----
## First run & install some software
```
yum -y update
yum -y install vim
yum -y install net-tools
yum -y install git
yum -y install unzip
yum -y install wget
```

-----
## Enable yum-cron
```
yum install -y yum-cron
```
Make it receive security update automatically:
```
vim /etc/yum/yum-cron.conf
```
Edit the file:
```
update_cmd = security
apply_updates = yes
```
Start and auto-run:
```
systemctl start yum-cron
systemctl enable yum-cron
```

-----
## Set up OpenSSH
```
vim /etc/ssh/sshd_config
```
Remove `#` in the following line:
```
Port 22
ListenAddress 0.0.0.0
ListenAddress ::
PermitRootLogin yes
```
Start and auto-run the SSH service.
```
systemctl enable sshd
systemctl start sshd
```
View the local address:
```
ifconfig -a
```

-----
## Set up Serial Port
Check if it is supported
```
dmesg |grep tty
```
Edit `/etc/default/grub` and add:
```
GRUB_CMDLINE_LINUX_DEFAULT="console=tty0 console=ttyS0,9600"
```
Update the grub file:
```
grub2-mkconfig -o /boot/grub2/grub.cfg
```
Reboot the machine.

Next, enable `serial-getty`
```
cp /usr/lib/systemd/system/serial-getty@.service /etc/systemd/system/serial-getty@ttyS0.service
systemctl daemon-reload
systemctl start serial-getty@ttyS0.service
systemctl enable serial-getty@ttyS0.service
```
-----
## Set up AP & soft router
```
ref: https://www.osradar.com/building-your-own-wireless-access-point-on-top-of-centos7/
```
Install the wireless-tools and hostapd.
```
yum -y install iw
yum -y install epel-release
yum -y install hostapd
```
Config hostapd.
```
vim /etc/hostapd/hostapd.conf
```
Edit the conf file.
```
interface=wlp7s0
hw_mode=g
channel=6
ssid=K_server
utf8_ssid=1
country_code=CN
bridge=br-AP
```
Remove the `#` in the following lines:
```
wpa=3
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP
wpa_passphrase=YouPassHere
```
Start and auto-run the hostapd
```
systemctl start hostapd
systemctl enable hostapd
```
Change zones.
```
firewall-cmd --permanent -zone=external --change-interface=enp1s0
firewall-cmd --permanent -zone=internal --change-interface=???
firewall-cmd --zone=external --add-masquerade --permanent
firewall-cmd --set-default-zone=internal
firewall-cmd --zone=internal --add-service=dns --permanent
firewall-cmd --complete-reload
```
Set up bridge.
```
nmcli con add con-name br-AP type bridge ifname br-AP autoconnect yes stp no ip4 192.168.6.1/24
```
Set up dhcp.
```
yum install -y dhcp
vim /etc/dhcp/dhcpd.conf
```
Edit the conf file.
```
subnet 192.168.6.0 netmask 255.255.255.0 {
	range dynamic-bootp 192.168.6.200 192.168.6.250;
	option broadcast-address 192.168.6.255;
	option domain-name-server 223.5.5.5, 223.6.6.6;
	option routers 192.168.6.1;
}
```
Start and auto-run the dhcp
```
systemctl start dhcpd
systemctl enable dhcpd
```
Post-setup: make it more stable.
```
yum -y install haveged
systemctl start havaged
systemctl enable havaged
```

-----
## Set up web-vmstats
```
cd /usr/local/
mkdir websocketd
git clone https://github.com/joewalnes/web-vmstats
```
Copy `websocketd.zip` to the folder `/usr/local/websocketd/` and unzip it:
```
unzip websocketd.zip
```  
Then create `webvmstats`.
```
vim /etc/systemd/system/webvmstats.service
```
Add the following content to the file:
```
[Unit]
Description=Web-vmstats

[Service]
ExecStart=/usr/local/websocketd/websocketd --port=8000 --staticdir=/usr/local/web-vmstats/web/ /usr/bin/vmstat -n 1

[Install]
WantedBy=multi-user.target
```
Reload, enable and start.
```
systemctl daemon-reload
systemctl start webvmstats
systemctl enable webvmstats
```
Add port `8000` to the firewall.
```
firewall-cmd --add-port=8000/tcp --zone=external --permanent
firewall-cmd --add-port=8000/tcp --zone=internal --permanent
```
View status:
```
systemctl status webvmstats -l
```
Or:
```
journalctl -e -u webvmstats
```

-----
## Set up Zerotier
Use the script to install Zerotier:
```
curl -s https://install.zerotier.com | sudo bash
```
Join network:
```
zerotier-cli join XXXXXXX
```
Start and auto-run ZeroTier.
```
systemctl start zerotier-one
systemctl enable zerotier-one
```

-----
## Set up FRP
```
mkdir /usr/local/frp
```
copy the frp.zip to the new folder. Then unzip it.

Edit the `frpc.ini` in the client-side. (Stupid error in [ftp]?)
```
[common]
server_addr = ?.?.?.?
server_port = 7000
pool_count = 2
authenticate_new_work_conns = true
authentication_method = token
token = balabalabalabalabalabala

[minecraft01]
type = tcp
local_ip = 127.0.0.1
local_port = 25565
remote_port = 25565

[minecraft02]
type = udp
local_ip = 127.0.0.1
local_port = 25565
remote_port = 25565

[murmur01]
type = tcp
local_ip = 127.0.0.1
local_port = 64738
remote_port = 64738

[murmur02]
type = udp
local_ip = 127.0.0.1
local_port = 64738
remote_port = 64738

[ftp01]
type = tcp
local_ip = 127.0.0.1
local_port = 20
remote_port = 20

[ftp02]
type = tcp
local_ip = 127.0.0.1
local_port = 21
remote_port = 21

[ftppasv]
type = udp
local_ip = 127.0.0.1
local_port = 20000-23333
remote_port = 20000-23333

[webvmstat]
type = tcp
local_ip = 127.0.0.1
local_port = 8000
remote_port = 8000
```
Copy origin `.service` file and edit it.
```
cp /usr/local/frp/systemd/frpc.service /etc/systemd/system/
vim /etc/systemd/system/frpc.service
```
~~User=nobody~~

On the server-side, edit the `frps.ini`.
```
[common]
bind_addr = 0.0.0.0
bind_port = 7000
dashboard_addr = 0.0.0.0
dashboard_port = 7500
authentication_method = token
authenticate_new_work_conns = true
token = balabalabalabalabalabala
dashboard_user = admin
dashboard_pwd = admin
```
Give permission:
```
chmod -R 700 /usr/local/frp/
```
-----
## Set up mumble server
```
ref: https://wiki.mumble.info/wiki/Install_CentOS7
```

-----
## Set up Minecraft server
Install java:
```
yum install -y java-latest-openjdk.x86_64
```
Upload the server.zip to the `/usr/local/mc_1_16_4` or `/opt/mc_1_16_4`
```
mkdir /usr/local/mc_1_16_4/mc_1_16_4
unzip server.zip
```
Create user:
```
groupadd -r minecraft
useradd -r -g minecraft -m -d /var/lib/minecraft -s /sbin/nologin minecraft
chown -R minecraft:minecraft /usr/local/mc_1_16_4
chmod -R 0770 /usr/local/mc_1_16_4
```
Create `mcserver.service` by `vim /etc/systemd/system/mcserver.service`
```
[Unit]
Description=Minecraft Server
After=network-online.target
Wants=network-online.target

[Service]
User=minecraft
ExecStartPre=/bin/sleep 10
ExecStart=/usr/bin/java -jar /usr/local/mc_1_16_4/fabric-server-launch.jar nogui
WorkingDirectory=/usr/local/mc_1_16_4/

[Install]
WantedBy=multi-user.target
```
Add port:
```
vim /etc/firewalld/services/minecraft.xml
```
```
<?xml version="1.0" encoding="utf-8"?>
<service>
        <short>Minecraft</short>
        <description>Minecraft Server</description>
        <port protocol="tcp" port="25565" />
        <port protocol="udp" port="25565" />
</service>
```
```
vim /etc/firewalld/services/rcon.xml
```
```
<?xml version="1.0" encoding="utf-8"?>
<service>
        <short>RCON</short>
        <description>Minecraft RCON</description>
        <port protocol="tcp" port="25577" />
        <port protocol="udp" port="25577" />
</service>
```
```
firewall-cmd --permanent --add-service=minecraft --zone=internal
firewall-cmd --permanent --add-service=minecraft --zone=external
firewall-cmd --permanent --add-service=rcon --zone=internal
firewall-cmd --complete-reload
```

-----
## Set up FTP
Install the ftp-daemon
```
yum -y install vsftpd
```
Edit the conf file:
```
vim /etc/vsftpd/vsftpd.conf
```
```
local_enable=NO
anonymous_enable=YES
write_enable=YES
anon_upload_enable=YES
listen=YES
```
Create a folder for uploading and change the permission:
```
mkdir /var/ftp/UploadArea
chown -R ftp:ftp /var/ftp/UploadArea
chmod -R 777 /var/ftp/UploadArea
```
Can ban users from logging in by adding name in `/etc/vsftpd/user_list`

Change Selinux settings:
```
getsebool -a | grep ftp
setsebool -P ftpd_anon_write on
setsebool -P ftpd_full_access on
```
Specify the Pasv-port by adding in `/etc/vsftpd/vsftpd.conf`
```
pasv_min_port=20000
pasv_max_port=23333
```
Open port.
```
firewall-cmd --permanent --add-service=ftp --zone=internal
firewall-cmd --permanent --add-service=ftp --zone=external
```
Start and auto-run the service.
```
systemctl start vsftpd
systemctl enable vsftpd
```

-----
## NTP enable
Install the ntp-daemon.
```
yum install -y ntp
```
Edit the conf file.
```
vim /etc/ntp.conf
```
Add the following line:
```
server ntp.ntsc.ac.cn
server cn.ntp.org.cn
SYNC_HWCLOCK=yes
```
Start and auto-run the servie.
```
systemctl start ntpd
systemctl enable ntpd
```
View stats:
```
ntpstat
ntpq -p
```

---
title: "PVE、OpnSense、Ubuntu Server设置小记"
date: 2022-12-14T18:39:00+08:00
draft: false

categories: ['Learning']
tags: ['Selfhosted', 'Learning', '2022']
author: "Kreee"

noSummary: false
resizeImages: false
toc: false
---
**注意！** 这篇文章仅仅是作为自己边鼓捣边摸索出来的产物，并非为一篇教程。

由于本人~~对于网络方面的知识一窍不通~~，所以并不能保证所有的内容全部正确，如有错误也欢迎指出。

<!--more-->

-----
**目录：**
{{<toc>}}

-----
## 安装 PVE
直接在[官网上下载](https://www.proxmox.com/en/downloads/category/iso-images-pve) ISO 镜像，然后按照提示安装上去就行。

安装中记得记录一下 Summary 与 Install Successful 中的信息，之后可能会用到。

首次安装完成后如果想要访问 ssh、WebGUI 等，需要先连接到安装时指定的管理网口（这里是 enp6s0），再设置电脑网卡将 IP 设置为安装时设置的同网段但是与 pve 主机不同的 IP。如果还是访问不了的话可以试试关闭其他网络连接（比如 WiFi 等）。

## 设置 PVE
### 设置硬件直通
由于想要将 enp1s0、wlp7s0直通给 OpnSense，所以要修改一下设置让 pve 支持硬件直通。

ssh 登录 pve，修改 grub 文件：`nano /etc/default/grub`，修改`GRUB_CMDLINE_LINUX_DEFAULT=quite`一栏的值为`quite intel_iommu=on`（AMD 的就是`amd_iommu=on`）。保存后使用`update-grub`更新。

修改 `/etc/modules` 文件，添加以下内容：
```plaintext
vfio
vfio_iommu_type1
vfio_pci
vfio_virqfd
```
保存后，重启机器。

运行以下命令行来列出所有 IOMMU 组：
```bash
#!/bin/bash
shopt -s nullglob
for g in `find /sys/kernel/iommu_groups/* -maxdepth 0 -type d | sort -V`; do
    echo "IOMMU Group ${g##*/}:"
    for d in $g/devices/*; do
        echo -e "\t$(lspci -nns ${d##*/})"
    done;
done;
```

-----
## 安装和设置 OPNSense
### 安装 OPNSense
进入 pve WebGUI，上传 OPNSense 的 ISO 安装包。

在 pve 节点处新建一个网卡桥接，选择一个与管理网卡不同的网卡，且只填写 `Bridge Ports` 字段。这里名字为 vmbr1。

新建一个虚拟机，设置参数（记得在 CPU 设置里把 aes 功能打开），添加网络设备 vmbr1 ，在 `Hardware` 里添加 PCI 设备，先只添加 enp1s0。

启动虚拟机，首先进入的是 live mode（演示模式），其中在进入演示模式前会配置网络信息，这里建议手动配置，设置好WAN口与LAN口，这里是把连接到光猫的 enp1s0 端口设置为 WAN，pve 的桥接网卡 vtnet0 设置为 LAN 口。

在成功进入演示模式后，使用用户名 `installer` 与密码 `opensense` 登录，就能进入安装模式，完成接下来的安装，与设置管理员密码。

安装完成后，重启虚拟机，移除安装介质。

### 初步设置
将电脑连接到 enp5s0 对应的网口上，并将电脑的手动地址改回为 DHCP 自动获取地址。使用默认地址`192.168.1.1`登录上 OPNSense 的 WebGUI 后，完成初始设置向导。在设置向导里可以更改 LAN 口地址，防止与光猫的 `192.168.1.1` 冲突。应用设置后，等待一段时间（比较长），重新用新的地址访问 WebGUI 界面，

### 配置多网口
将网线重新插回 enp6s0 对应网口，重新设置电脑地址（enp6s0 将作为 pve 的管理网口，以后在 OPNSense 挂了后紧急访问 pve 就用这个方法），将 OPNSense 虚拟机关闭，并添加 enp2s0 enp3s0 enp4s0 wlp7s0 网卡。重新启动虚拟机。

按上面的方法回到 OPNSense 的 WebGUI。在 Interfaces -> Assignments 把刚刚添加的所有端口都新建一遍，保存设置。再在 Interfaces -> 刚刚添加的各个网口，把刚刚添加的网口都启用，并应用更改。

在 Interfaces -> Other Types -> Bridge 里，新建一个 `br-LAN` 网桥，然后把除最开始添加的 LAN 口外的其他网口全部添加进去。回到 Interface -> Assignments，把 LAN 口（即在标识名字后面是 lan 字样的）换到 `br-LAN`，保存并应用。此时将断开与 OPNSense 的连接，将电脑连接到其他的 LAN 口上可以重新连接。

连接成功后，按照以上的操作方式把最开始的网口  添加进 `br-LAN` ，保存并测试是否可以访问 OPNSense WebGUI。

在 System -> Settings -> Tunables 里，将 `net.link.bridge.pfil_member` 改为 0，`net.link.bridge.pfil_bridge`改为 1。






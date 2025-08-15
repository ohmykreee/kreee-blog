---
title: "在 QEMU 里运行 OpenWRT(arm32)"
date: 2021-07-17T21:36:03+08:00
draft: true
categories: ['Learning']
tags: ['Selfhosted', 'Learning', 'QEMU', '2021']
---
烂尾了烂尾了，AP 的事先不打算整了。    
这篇文章有部分可以参考，就先留在这里了。

> 参考： https://gist.github.com/extremecoders-re/f2c4433d66c1d0864a157242b6d83f67    

-----
## 安装虚拟机软件 `qemu-system-arm`
```bash
sudo apt install qemu-system-arm
```

## 准备 OpenWRT 镜像
```bash
# 内核镜像
wget -q https://downloads.openwrt.org/releases/19.07.7/targets/armvirt/32/openwrt-19.07.7-armvirt-32-zImage -O zImage
# 储存镜像
wget -q https://downloads.openwrt.org/releases/19.07.7/targets/armvirt/32/openwrt-19.07.7-armvirt-32-root.ext4.gz -O root.ext4.gz
gunzip root.ext4.gz
```

## 首次启动
```
qemu-system-arm -M virt  -kernel zImage  -no-reboot -nographic  -device virtio-net-pci  -netdev user,id=net1,hostfwd=tcp::2222-:22 -device virtio-net-pci,netdev=net1  -drive file=root.ext4,if=virtio,format=raw  -append "root=/dev/vda"
```
这将会：
1. 创建两个网络端口： eth0 as LAN, eth1 as WAN
2. 将外部 2222/tcp 的流量重定向到内部 22/tcp(ssh) （记得关闭防火墙： `service firewall stop`）

```bash
# 更新软件列表
# 或者可以去 https://mirrors.tuna.tsinghua.edu.cn/help/openwrt/ 换源
opkg update
# 关机
halt
#重启
reboot
```

-----
## 分配硬件 (PCI card passthrough)
### 前期主机准备：
检查是否启用 IOMMU：
```bash
dmesg | grep -e DMAR -e IOMMU
```
启用 IOMMU：   
更改 `/etc/default/grub` 添加内核启动参数：
```bash
GRUB_CMDLINE_LINUX_DEFAULT="intel_iommu=on"
```
应用更改：
```bash
update-grub
shutdown -r now
```
### 从主机上解绑并绑定到 vfio-pci
> 参考： https://wiki.archlinux.org/title/PCI_passthrough_via_OVMF#Binding_vfio-pci_via_device_ID

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
示例输出：
```plaintext
IOMMU Group 19:
-e      07:00.0 Network controller [0280]: Intel Corporation Wi-Fi 6 AX200 [8086:2723] (rev 1a)
```
这里可以看到 Wi-Fi 卡在单独的一个 IOMMU Group 里，所以就不需要进行分离。   
解绑并绑定到 vfio-pci 上（通过添加内核启动参数）：
```bash
# 两个参数之间只需要一个空格隔开就行，不同设备 ID 只需要用逗号隔开
GRUB_CMDLINE_LINUX_DEFAULT="intel_iommu=on vfio-pci.ids=8086:2723"
```
重启机器，检查是否生效：
```bash
# 内核启动参数是否成功传递
dmesg | grep -i vfio
# 设备是否被正确分配
lspci -nnk -d 8086:2723
```
后一个命令的示例输出：
```plaintext
07:00.0 Network controller [0280]: Intel Corporation Wi-Fi 6 AX200 [8086:2723] (rev 1a)
        Subsystem: Intel Corporation Wi-Fi 6 AX200 [8086:0084]
        Kernel driver in use: vfio-pci
        Kernel modules: iwlwifi
```

### 分配给虚拟机
可以通过给参数来分配 PCI 设备：
```plaintext
-device vfio-pci,host=07:00.0
```
命令就变成了（这里可能需要用 root 权限运行）：
```bash
#!/bin/bash
ospath="/home/kreee/openwrt-19.07.7"
vfioid="07:00.0"

sudo qemu-system-arm -M virt \
-kernel $ospath/zImage \
-no-reboot -nographic \
-device virtio-net-pci \
-netdev user,id=net1,hostfwd=tcp::2222-:22 -device virtio-net-pci,netdev=net1 \
-device vfio-pci,host=$vfioid \
-drive file=$ospath/root.ext4,if=virtio,format=raw \
-append "root=/dev/vda"
```
查看是否被分配到了设备：
```bash
# 如果提示没有找到包，需要先运行一遍 opkg update
opkg install pciutils
lspci -nn
```
然后看列表里是否出现了想要的设备：
```plaintext
00:03.0 Network controller [0280]: Intel Corporation Device [8086:2723] (rev 1a)
```
很明显设备被分配成功了，但是未能正确识别，需要自己手动打驱动。

-----
## 配置 OpenWRT
### 配置主机和客户机的网络
> 参考：https://wiki.qemu.org/Documentation/Networking

一个来自官网的关于默认 SLIRP 模式的网络拓扑图：
![](https://wiki.qemu.org/images/9/93/Slirp_concept.png)
（不知道啥原因，从主机能够 SSH 虚拟机，但是从外部直接 SSH 主机的响应端口）
（该部分需要完善）

### 编译镜像文件
因为奇奇怪怪的问题，无法直接从外部连接到虚拟机内，所以就打算直接编译打好驱动的镜像文件。
> 参考： https://openwrt.org/docs/guide-user/additional-software/imagebuilder   

驱动下载： https://www.intel.com/content/www/us/en/support/articles/000005511/wireless.html  
驱动文件放在 `/lib/firmware` 文件夹中。   
镜像编译程序可以从下载镜像的下面一点可以发现。   
镜像编译要在 Linux 64 位环境下编译（ WSL 会出现一些奇奇怪怪的报错），具体过程我累了，这里只放出最后执行的命令：
```bash
make image PACKAGES="pciutils" FILES=./files DISABLED_SERVICES="firewall"
```
**然后就发现 OpenWRT 系统的内核太低，打不了驱动。**   
**于是，就烂尾了。**
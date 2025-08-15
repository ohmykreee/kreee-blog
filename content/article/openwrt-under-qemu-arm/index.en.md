---
title: "Running OpenWRT (arm32) in QEMU"
date: 2021-07-17T21:36:03+08:00
draft: true
categories: ['Learning']
tags: ['Selfhosted', 'Learning', 'QEMU', '2021']
---

{{< alert icon="language">}}
The English version is translated by AI (Gemini 2.5 Pro Preview). If you want to view the original content, please switch to Chinese version.
{{< /alert >}}

---

It's abandoned, it's abandoned, I'm not going to deal with the AP for now.
This article has some parts that can be used as a reference, so I'll leave it here for now.

> Reference: https://gist.github.com/extremecoders-re/f2c4433d66c1d0864a157242b6d83f67

-----
## Install the virtual machine software `qemu-system-arm`
```bash
sudo apt install qemu-system-arm
```

## Prepare the OpenWRT image
```bash
# Kernel image
wget -q https://downloads.openwrt.org/releases/19.07.7/targets/armvirt/32/openwrt-19.07.7-armvirt-32-zImage -O zImage
# Storage image
wget -q https://downloads.openwrt.org/releases/19.07.7/targets/armvirt/32/openwrt-19.07.7-armvirt-32-root.ext4.gz -O root.ext4.gz
gunzip root.ext4.gz
```

## First boot
```
qemu-system-arm -M virt  -kernel zImage  -no-reboot -nographic  -device virtio-net-pci  -netdev user,id=net1,hostfwd=tcp::2222-:22 -device virtio-net-pci,netdev=net1  -drive file=root.ext4,if=virtio,format=raw  -append "root=/dev/vda"
```
This will:
1. Create two network ports: eth0 as LAN, eth1 as WAN
2. Redirect external 2222/tcp traffic to internal 22/tcp(ssh) (remember to turn off the firewall: `service firewall stop`)

```bash
# Update software list
# Or you can go to https://mirrors.tuna.tsinghua.edu.cn/help/openwrt/ to change the source
opkg update
# Shutdown
halt
#Reboot
reboot
```

-----
## Allocate hardware (PCI card passthrough)
### Host preparation:
Check if IOMMU is enabled:
```bash
dmesg | grep -e DMAR -e IOMMU
```
Enable IOMMU:
Change `/etc/default/grub` to add kernel boot parameters:
```bash
GRUB_CMDLINE_LINUX_DEFAULT="intel_iommu=on"
```
Apply changes:
```bash
update-grub
shutdown -r now
```
### Unbind from the host and bind to vfio-pci
> Reference: https://wiki.archlinux.org/title/PCI_passthrough_via_OVMF#Binding_vfio-pci_via_device_ID

Run the following command line to list all IOMMU groups:
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
Example output:
```plaintext
IOMMU Group 19:
-e      07:00.0 Network controller [0280]: Intel Corporation Wi-Fi 6 AX200 [8086:2723] (rev 1a)
```
Here you can see that the Wi-Fi card is in a separate IOMMU Group, so there is no need for separation.
Unbind and bind to vfio-pci (by adding kernel boot parameters):
```bash
# Only one space is needed between the two parameters, and different device IDs only need to be separated by commas
GRUB_CMDLINE_LINUX_DEFAULT="intel_iommu=on vfio-pci.ids=8086:2723"
```
Reboot the machine and check if it takes effect:
```bash
# Whether the kernel boot parameters are successfully passed
dmesg | grep -i vfio
# Whether the device is correctly assigned
lspci -nnk -d 8086:2723
```
Example output of the latter command:
```plaintext
07:00.0 Network controller [0280]: Intel Corporation Wi-Fi 6 AX200 [8086:2723] (rev 1a)
        Subsystem: Intel Corporation Wi-Fi 6 AX200 [8086:0084]
        Kernel driver in use: vfio-pci
        Kernel modules: iwlwifi
```

### Assign to virtual machine
You can assign PCI devices by giving parameters:
```plaintext
-device vfio-pci,host=07:00.0
```
The command becomes (you may need to run it with root privileges here):
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
Check if a device has been assigned:
```bash
# If it prompts that the package is not found, you need to run opkg update first
opkg install pciutils
lspci -nn
```
Then see if the desired device appears in the list:
```plaintext
00:03.0 Network controller [0280]: Intel Corporation Device [8086:2723] (rev 1a)
```
It is obvious that the device has been successfully assigned, but it cannot be correctly identified, and you need to manually install the driver.

-----
## Configure OpenWRT
### Configure the network of the host and guest
> Reference: https://wiki.qemu.org/Documentation/Networking

A network topology diagram of the default SLIRP mode from the official website:
![](https://wiki.qemu.org/images/9/93/Slirp_concept.png)
(For some reason, I can SSH to the virtual machine from the host, but I can't SSH to the response port of the host directly from the outside)
(This part needs to be improved)

### Compile the image file
Due to some strange problems, I cannot connect to the virtual machine directly from the outside, so I plan to directly compile the image file with the driver installed.
> Reference: https://openwrt.org/docs/guide-user/additional-software/imagebuilder

Driver download: https://www.intel.com/content/www/us/en/support/articles/000005511/wireless.html
The driver file is placed in the `/lib/firmware` folder.
The image compilation program can be found a little below the download image.
The image compilation must be compiled in a Linux 64-bit environment (WSL will have some strange errors). I am tired of the specific process. Here I only release the last executed command:
```bash
make image PACKAGES="pciutils" FILES=./files DISABLED_SERVICES="firewall"
```
**Then I found that the kernel of the OpenWRT system is too low to install the driver.**
**So, it was abandoned.**

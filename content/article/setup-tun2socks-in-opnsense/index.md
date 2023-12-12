---
title: "在 OPNsense 上安装 tun2socks 服务"
date: 2023-11-25T17:06:00+08:00
draft: false

categories: ['Learning']
tags: ['Selfhosted', 'Learning', '2023']
author: "Kreee"

noSummary: false
resizeImages: false
toc: false
---
~~吐槽一下：距离上次写博文已经快一年了，可想而知我有多懒。~~

由于 OPNsense 上的 Squid 包将被降低支持力度，且该方法无法代理 UDP/Quic 流量，故使用一种全新的方法来解决这个问题。
<!--more-->

![](network-topology.jpg)

-----
**目录：**
{{<toc>}}

-----

## 准备可执行文件和配置文件
前往 [xjasonlyu/tun2socks](https://github.com/xjasonlyu/tun2socks) 下载最新的适用于 FreeBSD 的 `tun2socks` 可执行文件于你喜欢的位置。这里就放置于 `/usr/local/tun2socks`。

新建配置文件 `/usr/local/tun2socks/config.yaml` 并填写以下内容：
```yaml
# debug / info / warning / error / silent
loglevel: info

# URL format: [protocol://]host[:port]
# 这里填写到代理服务器的链接
# 配置透明网关可参考文章：https://rxclc.club/index.php/archives/18/
proxy: socks5://192.168.3.10:7891

# URL format: [driver://]name
# TUN 设备名称，避免使用 tun0
device: tun://proxytun2socks0

# Maximum transmission unit for each packet
mtu: 1500

# Timeout for each UDP session, default value: 60 seconds
udp-timeout: 120s
```

在文件夹 `/usr/local/tun2socks/` 内运行 `./tun2socks -config ./config.yaml`，测试配置文件是否正确。Ctrl+C 中止当前程序。

-----
## 新建服务文件
新建文件 `/usr/local/etc/rc.d/tun2socks` 并填写以下内容：
```bash
#!/bin/sh

# PROVIDE: tun2socks
# REQUIRE: LOGIN
# KEYWORD: shutdown

. /etc/rc.subr

name="tun2socks"
rcvar="tun2socks_enable"

load_rc_config $name

: ${tun2socks_enable:=no}
: ${tun2socks_config:="/usr/local/tun2socks/config.yaml"}

pidfile="/var/run/${name}.pid"
command="/usr/local/tun2socks/tun2socks"
command_args="-config ${tun2socks_config} > /dev/null 2>&1 & echo \$! > ${pidfile}"

start_cmd="${name}_start"

tun2socks_start()
{
    if [ ! -f ${tun2socks_config} ]; then
        echo "${tun2socks_config} not found."
        exit 1
    fi
    echo "Starting ${name}."
    /bin/sh -c "${command} ${command_args}"
}

run_rc_command "$1"
```
给予运行权限 `chmod +x /usr/local/etc/rc.d/tun2socks`。

如果你有将 `tun2socks` 可执行文件和配置文件放于其他地方，要记得更改文件内的相应内容。

创建 `/etc/rc.conf` 并添加以下内容：
```plaintext
tun2socks_enable="YES"
```

-----
## 新建 configd 文件
新建文件 `/usr/local/opnsense/service/conf/actions.d/actions_tun2socks.conf` 并填写以下内容：
```bash
[start]
command:/usr/local/etc/rc.d/tun2socks start
parameters:
type:script
message:starting tun2socks

[stop]
command:/usr/local/etc/rc.d/tun2socks stop
parameters:
type:script
message:stopping tun2socks

[restart]
command:/usr/local/etc/rc.d/tun2socks restart
parameters:
type:script
message:restarting tun2socks

[status]
command:/usr/local/etc/rc.d/tun2socks status; exit 0
parameters:
type:script_output
message:request tun2socks status
```
运行 `service configd restart` 以重启 `configd` 服务来应用更改。

-----
## 新建插件
> 参考： [Using plugins - OPNsense Documentation](https://docs.opnsense.org/development/backend/legacy.html)

新建文件 `/usr/local/etc/inc/plugins.inc.d/tuntosocks.inc` 并填写以下内容：
```php
<?php

/*
 * Copyright (C) 2017 EURO-LOG AG
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESS OR IMPLIED WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
 * OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * register service
 * @return array
 */
function tuntosocks_services()
{
    global $config;

    $services = array();
    $services[] = array(
        'description' => gettext('tun2socks gVisor TCP/IP stack'),
        'configd' => array(
            'restart' => array('tun2socks restart'),
            'start' => array('tun2socks start'),
            'stop' => array('tun2socks stop'),
        ),
        'name' => 'tun-socks',
        'pidfile' => '/var/run/tun2socks.pid'
    );
    return $services;
}

function tuntosocks_syslog()
{
    $logfacilities = array();
    $logfacilities['tun2socks'] = array(
        'facility' => array('tun2socks'),
    );
    return $logfacilities;
}
```
使用 `pluginctl -s` 读取并加载插件。如果输出列表中有出现 `tun-socks` 且在 Web-GUI 的 Services 内出现 `tun-socks` 服务，点击运行能够成功运行，则说明插件注册成功。

-----
## 使服务在 Early Stage 启动
> 参考： [Bootup / autorun options - OPNsense Documentation](https://docs.opnsense.org/development/backend/autorun.html)

创建文件 `/usr/local/etc/rc.syshook.d/early/60-tun2socks`，注意最好前面的数字不要和文件夹内已有文件重复。填写以下内容：
```bash
#!/bin/sh

# Start tun2socks service
/usr/local/etc/rc.d/tun2socks start
```
给予文件可执行权限 `chmod +x /usr/local/etc/rc.syshook.d/early/60-tun2socks`。

然后重启系统，测试 `tun2socks` 是否正常启动。

-----
## 新建端口，和配置网关
> 参考： [opnsense使用透明代理并分流 - OPNsense Forum](https://forum.opnsense.org/index.php?topic=27078.0)

在 Interfaces ‣ Assignments 里，将刚刚创建的 TUN 设备新建为新端口，保存设置。

在 Interfaces ‣ [刚刚添加的网口]，进行以下设置，保存应用：
| Setting | Value |
| ------------------------------- | ---------------- |
| Enable                          | Enable Interface |
| Description                     | TUN2SOCKS        |
| IPv4 Configuration Type         | Static IPv4      |
| IPv4 address                    | 10.0.3.1/24      |

其中 IPv4 地址要和目前所用局域网地址不同。

在 System ‣ Gateways ‣ Single 里，添加网关：

| Setting | Value |
| ------------------------------- | ---------------- |
| Name                            | TUN2SOCKS_PROXY  |
| Interface                       | TUN2SOCKS        |
| Address Family                  | IPv4             |
| IP address                      | 10.0.3.2         |
| Disable Gateway Monitoring      | True             |

保存并应用。

-----
## 善用别名（Aliases）

别名的配置在 Firewall ‣ Aliases 里，可以通过自定义别名来快速选定一个或多个对象。

本人常用的别名类型为 Host(s)、Port(s)、MAC Address、Network Group。其中 Host(s) 类型用来存储那些不想被代理的网站，Port(s) 类型用来存储想要代理的端口，MAC Address 类型用来存储想要代理的单个设备，Network Group 类型用来存储代理设备集合、非代理目标集合。

故接下来将要使用的别名有：

| Name | Type | Description | 
| -------------- | -------------- | ----------------------------- |
| NoProxyGroup   | Network group  | 包括非代理域名、局域网地址      |
| ProxyDevices   | Network group  | 包括所有想要代理的设备 MAC 地址 |
| ProxyPort      | Port(s)        | 80 端口和 443 端口             |

如果你原意，也可以上 GeoIP 规则，需要注册 MaxMind 账号：[MaxMind GeoIP’s Setup - OPNsense Documentation](https://docs.opnsense.org/manual/how-tos/maxmind_geo_ip.html)。

-----
## 配置防火墙规则
在 Firewall ‣ Rules ‣ LAN 中添加规则，且该规则在默认的 `Default allow LAN to any rule` 和 `Default allow LAN IPv6 to any rule` 之前：

| Setting | Value |
| ------------------------------- | ---------------- |
| TCP/IP Version                  | IPv4                   |
| Protocol                        | TCP/UDP                |
| Source                          | ProxyDevice            |
| Destination / Invert            | True                   |
| Destination                     | NoProxyGroup           |
| Destination port range          | ProxyPort to ProxyPort |
| Gateway                         | TUN2SOCKS_PROXY        |

保存并应用。

-----
## IPv6 相关配置
施工中...

由于目前还没有 IPv6 环境给我测试，故这个部分等以后再补充（或者有高人帮我完善）。
---
title: "Setting up tun2socks service on OPNsense"
date: 2023-11-25T17:06:00+08:00
draft: false
categories: ['Learning']
tags: ['Selfhosted', 'Learning', '2023']
summary: "Since the Squid package on OPNsense will be deprecated and this method cannot proxy UDP/Quic traffic, a new method is used to solve this problem."
---

{{< alert icon="language">}}
The English version is translated by AI (Gemini 2.5 Pro Preview). If you want to view the original content, please switch to Chinese version.
{{< /alert >}}

---

~~Let me complain: it's been almost a year since I last wrote a blog post, so you can imagine how lazy I am.~~

Since the Squid package on OPNsense will be deprecated and this method cannot proxy UDP/Quic traffic, a new method is used to solve this problem.

-----
## Prepare executable files and configuration files
Go to [xjasonlyu/tun2socks](https://github.com/xjasonlyu/tun2socks) to download the latest `tun2socks` executable file for FreeBSD to your preferred location. Here it is placed in `/usr/local/tun2socks`.

Create a new configuration file `/usr/local/tun2socks/config.yaml` and fill in the following content:
```yaml
# debug / info / warning / error / silent
loglevel: info

# URL format: [protocol://]host[:port]
# Fill in the link to the proxy server here
# For configuring a transparent gateway, please refer to the article: https://rxclc.club/index.php/archives/18/
proxy: socks5://192.168.3.10:7891

# URL format: [driver://]name
# TUN device name, avoid using tun0
device: tun://proxytun2socks0

# Maximum transmission unit for each packet
mtu: 1500

# Timeout for each UDP session, default value: 60 seconds
udp-timeout: 120s
```

In the `/usr/local/tun2socks/` folder, run `./tun2socks -config ./config.yaml` to test whether the configuration file is correct. Press Ctrl+C to terminate the current program.

-----
## Create a new service file
Create a new file `/usr/local/etc/rc.d/tun2socks` and fill in the following content:
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
Grant execution permission `chmod +x /usr/local/etc/rc.d/tun2socks`.

If you have placed the `tun2socks` executable file and configuration file in other places, remember to change the corresponding content in the file.

Create `/etc/rc.conf` and add the following content:
```plaintext
tun2socks_enable="YES"
```

-----
## Create a new configd file
Create a new file `/usr/local/opnsense/service/conf/actions.d/actions_tun2socks.conf` and fill in the following content:
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
Run `service configd restart` to restart the `configd` service to apply the changes.

-----
## Create a new plugin
> Reference: [Using plugins - OPNsense Documentation](https://docs.opnsense.org/development/backend/legacy.html)

Create a new file `/usr/local/etc/inc/plugins.inc.d/tuntosocks.inc` and fill in the following content:
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
Use `pluginctl -s` to read and load the plugin. If `tun-socks` appears in the output list and the `tun-socks` service appears in the Services in the Web-GUI, and it can be run successfully by clicking run, it means that the plugin has been registered successfully.

-----
## Make the service start in the Early Stage
> Reference: [Bootup / autorun options - OPNsense Documentation](https://docs.opnsense.org/development/backend/autorun.html)

Create the file `/usr/local/etc/rc.syshook.d/early/60-tun2socks`, note that it is best that the preceding number does not conflict with existing files in the folder. Fill in the following content:
```bash
#!/bin/sh

# Start tun2socks service
/usr/local/etc/rc.d/tun2socks start
```
Grant the file executable permission `chmod +x /usr/local/etc/rc.syshook.d/early/60-tun2socks`.

Then restart the system to test whether `tun2socks` starts normally.

-----
## Create a new port and configure the gateway
> Reference: [opnsense uses transparent proxy and shunts - OPNsense Forum](https://forum.opnsense.org/index.php?topic=27078.0)

In Interfaces ‣ Assignments, create the newly created TUN device as a new port and save the settings.

In Interfaces ‣ [the newly added network port], make the following settings and save and apply:
| Setting | Value |
| ------------------------------- | ---------------- |
| Enable                          | Enable Interface |
| Description                     | TUN2SOCKS        |
| IPv4 Configuration Type         | Static IPv4      |
| IPv4 address                    | 10.0.3.1/24      |

The IPv4 address should be different from the currently used local area network address.

In System ‣ Gateways ‣ Single, add a gateway:

| Setting | Value |
| ------------------------------- | ---------------- |
| Name                            | TUN2SOCKS_PROXY  |
| Interface                       | TUN2SOCKS        |
| Address Family                  | IPv4             |
| IP address                      | 10.0.3.2         |
| Disable Gateway Monitoring      | True             |

Save and apply.

-----
## Make good use of Aliases

The configuration of aliases is in Firewall ‣ Aliases. You can quickly select one or more objects by customizing aliases.

The alias types I commonly use are Host(s), Port(s), MAC Address, and Network Group. The Host(s) type is used to store websites that I don't want to be proxied, the Port(s) type is used to store ports that I want to be proxied, the MAC Address type is used to store individual devices that I want to be proxied, and the Network Group type is used to store a collection of proxy devices and a collection of non-proxy targets.

Therefore, the aliases to be used next are:

| Name | Type | Description | 
| -------------- | -------------- | ----------------------------- |
| NoProxyGroup   | Network group  | Includes non-proxy domains and local area network addresses      |
| ProxyDevices   | Network group  | Includes the MAC addresses of all devices to be proxied |
| ProxyPort      | Port(s)        | Port 80 and port 443             |

If you want, you can also use GeoIP rules, which require registering a MaxMind account: [MaxMind GeoIP’s Setup - OPNsense Documentation](https://docs.opnsense.org/manual/how-tos/maxmind_geo_ip.html).

-----
## Configure firewall rules
In Firewall ‣ Rules ‣ LAN, add a rule, and this rule should be before the default `Default allow LAN to any rule` and `Default allow LAN IPv6 to any rule`:

| Setting | Value |
| ------------------------------- | ---------------------- |
| TCP/IP Version                  | IPv4                   |
| Protocol                        | TCP/UDP                |
| Source                          | ProxyDevice            |
| Destination / Invert            | True                   |
| Destination                     | NoProxyGroup           |
| Destination port range          | ProxyPort to ProxyPort |
| Gateway                         | TUN2SOCKS_PROXY        |

Save and apply.

-----
## IPv6 related configuration

{{< alert >}}
**Note** This part has not been fully verified/tested, so the following content may be incorrect, please refer to it with caution.
{{< /alert >}}


In Interfaces ‣ [corresponding network port], make the following settings and save and apply:
| Setting | Value |
| ------------------------------- | ----------------------------- |
| Enable                          | Enable Interface              |
| Description                     | TUN2SOCKS                     |
| IPv4 Configuration Type         | Static IPv6                   |
| IPv4 address                    | FEC0:0000:0000:0003::/64      |

In System ‣ Gateways ‣ Single, add a gateway:

| Setting | Value |
| ------------------------------- | ----------------------- |
| Name                            | TUN2SOCKS_PROXY_IPV6    |
| Interface                       | TUN2SOCKS               |
| Address Family                  | IPv6                    |
| IP address                      | FEC0:0000:0000:0003::2  |
| Disable Gateway Monitoring      | True                    |

Save and apply.

In Firewall ‣ Rules ‣ LAN, add a rule, and this rule should be before the default `Default allow LAN to any rule` and `Default allow LAN IPv6 to any rule`:

| Setting | Value |
| ------------------------------- | ---------------------- |
| TCP/IP Version                  | IPv6                   |
| Protocol                        | TCP/UDP                |
| Source                          | ProxyDevice            |
| Destination / Invert            | True                   |
| Destination                     | NoProxyGroup           |
| Destination port range          | ProxyPort to ProxyPort |
| Gateway                         | TUN2SOCKS_PROXY_IPV6   |

Save and apply.

-----
## What to read next

{{< article link="/en/article/tproxy-in-opnsense-with-wireguard/" showSummary=true compactSummary=true >}}

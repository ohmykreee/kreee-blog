---
title: "使用 WireGuard 在 OPNsense 实现透明代理（进阶）"
date: 2025-05-24T20:21:00+08:00
draft: false

categories: ['Learning']
tags: ['Selfhosted', 'Learning', '2025']
author: "Kreee"

noSummary: false
resizeImages: false
toc: false
---
**注意！：此篇文章涉及很多高级网络知识（有些我自己也是一知半解），故请在跟随这篇文章时请有一定的自我问题解决能力！**
<!--more-->

-----
**目录：**
{{<toc>}}

-----
## Why and why you shouldn't
此篇为 [《在 OPNsense 上安装 tun2socks 服务 - Kreee's Blog》](/article/setup-tun2socks-in-opnsense/) 文章的后续及进阶（~~指摸了3年然后憋出来一篇文章~~），主要是针对在用了3年的 `tun2socks` 方案后的一些思考（+个人的精神洁癖）。以下是我列出的为什么我想需要使用这种方法以及我**个人建议**怎样的情况下不要使用这种方法：

Why?:
- 发现 `tun2socks` 存在一定的性能问题：指在存在超级多的 TCP 连接时，`tun2socks` 会出现较高的 CPU 占用；
- 安全性考量：不想用 hack OPNsense 的方法来使用 `tun2socks`（指使用 root 权限），并且对在 Terminal 环境下对 OPNsense 进行修改存在精神洁癖上的抗拒；
- 安全性考量：`tun2socks` 近几年几乎没有更新（虽然说功能已经稳定，没有更新必要，除非有重大漏洞披露）；
- WireGuard 已经成为 OPNsense 的 first class citizen, why not?

Why not:
- 你不知道你自己在干什么：这种方法涉及很多网络相关的深度知识，有些我自己也没有搞懂。对于我自己都没有搞懂的部分（我会在文章中明确标出），我不会尝试去回答相关问题；
- 你不知道你自己在干什么：这篇文章不会说明一些**简单操作**在其他系统中的方法（比如安装WireGuard、配置 WireGuard、设置 WireGuard 自启等等），只会写出在我自己的环境下的配置方法；
- 这种方法的性能、资源使用、稳定性我都还没有长期测试过。

-----
## 我的环境
1. EndPoint: 作为安装了代理工具和 WireGuard 出口的服务器，我选择的是 `Alpine Linux`（之后教程的操作也会基于该系统）；
2. OPNsense: `2.5.17_2`（部分操作官方文档教程没有更新）；
3. Proxy软件：`mihomo`

-----
## EndPoint：配置 WireGuard
安装 WireGuard（`apk add wireguard-tools`），生成公钥和私钥：
```bash
wg genkey | tee /etc/wireguard/privatekey | wg pubkey > /etc/wireguard/publickey
```
编写 WireGuard 配置文件（`/etc/wireguard/tunnel.conf`）：
```cfg
[Interface]
Address = 10.0.0.1/24, fd00::1/64
ListenPort = 51820
PrivateKey = <刚刚生成的 EndPoint 私钥>

[Peer]
PublicKey = <OPNsense生成的公钥，等会填写>
AllowedIPs = 10.0.0.2/32, fd00::2/128
```

创建链接文件来创建服务文件：
```bash
ln -s /etc/init.d/wg-quick /etc/init.d/wg-quick.tunnel
```
使用 `service wg-quick.tunnel start` 启动， `service wg-quick.tunnel stop` 停止，`rc-update add wg-quick.tunnel default` 加入 default runlevel 以实现自启。

-----
## OPNsense：配置 WireGuard
> 参考： [WireGuard Selective Routing to External VPN Endpoint - OPNsense Documentation](https://docs.opnsense.org/manual/how-tos/wireguard-selective-routing.html)

在 VPN ‣ WireGuard ‣ Instances 里，创建一个 WireGuard 实例：
| Setting | Value |
| --------------------- | ----------------------------------------------- |
| Name                  | ProxyTunnel                                     |
| Public key            | （自动生成，并填写到前一步的配置中）              |
| Private key           | （自动生成）                                     |
| Listen port           | （可以留空，如果你不想让它自己选择一个随机端口的话）|
| Tunnel address        | 10.0.0.2/32 fd00::2/128                         |
| Peers                 | Tunnel（稍后配置）                               |
| Disable routes        | True                                            |

注意！：在原官方文档中，有一步为配置 `Gateways`，新版软件的 UI 更改给改没了，故我把 IP 填进了 Tunnel address 中，虽然不知道有没有用，反正我是能跑通（逃）

在 VPN ‣ WireGuard ‣ Peers 里，创建一个 WireGuard 节点：
| Setting | Value |
| --------------------- | ------------------------------ |
| Name                  | Tunnel                         |
| Public key            | （EndPoint 的公钥，上一步生成） |
| Allowed IPs           | 0.0.0.0/0 ::/0                 |
| Endpoint address      | Endpoint.example.com           |
| Endpoint port         | 51820                          |
| Instances             | ProxyTunnel                    |
| Keepalive interval    | 25                             |

启用该实例，重启 WireGuard。

-----
## OPNsense：配置 WireGuard Gateway
在 Interfaces ‣ Assignments 里，将刚刚创建的 WireGuard 隧道设备新建为新端口，保存设置。

在 Interfaces ‣ [刚刚添加的网口]，进行以下设置，保存应用：
| Setting | Value |
| ------------------------------- | ---------------- |
| Enable                          | Enable Interface |
| Description                     | ProxyTunnel      |
| IPv4 Configuration Type         | None             |
| IPv6 Configuration Type         | None             |
| Dynamic gateway policy          | False            |

**不要选 Dynamic gateway policy ！**

在 System ‣ Gateways ‣ Configuration 里，添加两个网关（分别对应 IPv4 和 IPv6）：

| Setting | Value |
| ------------------------------- | ---------------- |
| Name                            | TUNPROXY         |
| Interface                       | ProxyTunnel      |
| Address Family                  | IPv4             |
| IP address                      | 10.0.0.3         |
| Far Gateway                     | True             |
| Disable Gateway Monitoring      | True             |

| Setting | Value |
| ------------------------------- | ---------------- |
| Name                            | TUNPROXY_IPv6    |
| Interface                       | ProxyTunnel      |
| Address Family                  | IPv6             |
| IP address                      | fd00::3          |
| Far Gateway                     | True             |
| Disable Gateway Monitoring      | True             |

注意！：这里配置的 IP address 不要与现有的 IP 有冲突，即在该 WireGuard 网络里这个 IP 不能出现在其他任何设备上。

-----
## OPNsense：配置 Gateway 防火墙规则
（接下来是配置 Aliases 和配置透明代理的的环节，在我的之前那篇文章 [《在 OPNsense 上安装 tun2socks 服务 - Kreee's Blog》](/article/setup-tun2socks-in-opnsense/) 都有提及，这里~~为了凑字数我~~ 方便你们不来回跳转就直接把当时写的内容直接复制在下面了）

**善用别名（Aliases）**

别名的配置在 Firewall ‣ Aliases 里，可以通过自定义别名来快速选定一个或多个对象。

本人常用的别名类型为 Host(s)、Port(s)、MAC Address、Network Group。其中 Host(s) 类型用来存储那些不想被代理的网站，Port(s) 类型用来存储想要代理的端口，MAC Address 类型用来存储想要代理的单个设备，Network Group 类型用来存储代理设备集合、非代理目标集合。

故接下来将要使用的别名有：

| Name | Type | Description | 
| -------------- | -------------- | ----------------------------- |
| NoProxyGroup   | Network group  | 包括非代理域名、局域网地址      |
| ProxyDevices   | Network group  | 包括所有想要代理的设备 MAC 地址 |
| ProxyPort      | Port(s)        | 80 端口和 443 端口             |

如果你原意，也可以上 GeoIP 规则，需要注册 MaxMind 账号：[MaxMind GeoIP’s Setup - OPNsense Documentation](https://docs.opnsense.org/manual/how-tos/maxmind_geo_ip.html)。

**配置防火墙规则**
在 Firewall ‣ Rules ‣ LAN 中添加规则，且该规则在默认的 `Default allow LAN to any rule` 和 `Default allow LAN IPv6 to any rule` 之前：

| Setting | Value |
| ------------------------------- | ---------------------- |
| TCP/IP Version                  | IPv4                   |
| Protocol                        | TCP/UDP                |
| Source                          | ProxyDevices           |
| Destination / Invert            | True                   |
| Destination                     | NoProxyGroup           |
| Destination port range          | ProxyPort to ProxyPort |
| Gateway                         | TUNPROXY               |

IPv6 你也可以再新建一个以上类似的规则，TCP/IP Version 使用 IPv6，并且 Gateway 使用对应的 `TUNPROXY_IPv6`。

保存并应用。

~~（复制结束）~~

-----
## 配置更多的防火墙规则和 NAT OutBound 规则
以下很多设置我都不太清楚原理（这些内容为官方文档的操作），我只能提供我所收集到的所有资料。

（配置转发由 OPNsense 生成的流量）在 Firewall ‣ Rules ‣ Floating 中添加规则：
| Setting | Value |
| ----------------------- | ------------------------------ |
| Action                  | Pass                           |
| Quick                   | False                          |
| Interface               | 不选择任何                     |
| Direction               | out                            |
| TCP/IP Version          | IPv4                           |
| Protocol                | any                            |
| Source / Invert         | False                          |
| Source                  | TUNPROXY address               |
| Destination / Invert    | True                           |
| Destination             | TUNPROXY net                   |
| Gateway                 | TUNPROXY                       |
| Advanced features                                        |
| Allow Options           | True                           |

IPv6 版本也可以按这个配置再配置一个，TCP/IP Version 选 IPv6，Source 和 Destination 选对应网关。

（我也找到了一些人在讨论这个规则是不是有必要的帖子：[Wireguard Selective Routing - Why Step 9? - OPNsense Forum](https://forum.opnsense.org/index.php?topic=32074.0)，以及在这帖子里 [关于这一步很长的 Github Issues 讨论串](https://github.com/opnsense/core/issues/5329)（我并没有看），你可以尝试去阅读并思考，这个配置是否有必要的选择权交给你，反正我是这样配置的）

（创建 outbound NAT rule）在 Firewall ‣ NAT ‣ Outbound 中，先选择 `Hybrid outbound NAT rule generation` 启用自定义规则 + 自动生成规则，并添加以下规则：
| Setting | Value |
| -------------------------- | --------------------------- |
| Interface                  | TUNPROXY                    |
| TCP/IP Version             | IPv4                        |
| Protocol                   | any                         |
| Source invert              | False                       |
| Source address             | ProxyDevices                |
| Source port                | any                         |
| Destination invert         | False                       |
| Destination address        | any                         |
| Destination port           | any                         |
| Translation / target       | Interface address           |

IPv6 版本也可以按这个配置再配置一个，TCP/IP Version 选 IPv6。

保存应用。

-----
## EndPoint：配置透明代理
> 参考： [我的家庭网络设计思路，开启debian的旁路由之路（四） - Evine的个人博客](https://evine.win/p/%E6%88%91%E7%9A%84%E5%AE%B6%E5%BA%AD%E7%BD%91%E7%BB%9C%E8%AE%BE%E8%AE%A1%E6%80%9D%E8%B7%AF%E5%BC%80%E5%90%AFdebian%E7%9A%84%E6%97%81%E8%B7%AF%E7%94%B1%E4%B9%8B%E8%B7%AF%E5%9B%9B/)

（感谢大佬 Evine 的这篇文章，里面写的 `nftables` 规则虽然我看得并不是很懂，但是每一行都有注释让我也能大致理清思路，顺便将该规则用 `inet` 改写让其支持双栈）

在 Alpine Linux 中，安装 `nftables`：`apk add nftables`；创建一个 `nftables` 脚本于 `/etc/wireguard/tproxy.nft`：

```bash
#!/usr/sbin/nft -f

## 清空旧规则
flush ruleset

## 只处理指定网卡的流量，要和 IP 规则中的接口操持一致
define interface = eth0

## mihomo 的透明代理端口
define tproxy_port = 7893

## mihomo 打的标记（routing-mark）
define mihomo_mark = 233

## 常规流量标记，ip rule 中加的标记，要和ip规则中保持一致，对应 "ip rule add fwmark 1 lookup 100" 中的 "1"
define default_mark = 1

## 本机运行了服务并且需要在公网上访问的 TCP 端口（本机开放在公网上的端口），仅本地局域网访问的服务端口可不用在此变量中，以半角逗号分隔
define local_tcp_port = {
    22,        # ssh，按需设置
    443        # webui，按需设置
}

## 要绕过的局域网内 TCP 流量经由本机访问的目标端口，也就是允许局域网内其他主机主动设置 DNS 服务器为其他服务器，而非旁路由
define lan_2_dport_tcp = {
    53     # dns查询
}

## 要绕过的局域网内 UDP 流量经由本机访问的目标端口，也就是允许局域网内其他主机主动设置 DNS 服务器为其他服务器，而非旁路由；另外也允许局域网内其他主机访问远程的 NTP 服务器
define lan_2_dport_udp = {
    53,    # dns查询
    123    # ntp端口
}

table inet mihomo {

    ## 保留 IPv4/IPv6 集合
    set private_address4_set {
        type ipv4_addr
        flags interval
        elements = {
            127.0.0.0/8,
            100.64.0.0/10,
            169.254.0.0/16,
            224.0.0.0/4,
            240.0.0.0/4,
            10.0.0.0/8,
            172.16.0.0/12,
            192.168.0.0/16
        }
    }
    set private_address6_set {
        type ipv6_addr
        flags interval
        elements = {
            ::1/128,            # 本地环回
            fc00::/7,           # 唯一本地地址（ULA，类似 IPv4 的私有地址）
            fe80::/10,          # 链路本地地址（Link-local）
            ff00::/8,           # 组播地址
            64:ff9b::/96        # IPv4-IPv6 转换地址（NAT64）
        }
    }


    ## prerouting链
    chain prerouting {
        type filter hook prerouting priority filter; policy accept;
        meta l4proto { tcp, udp } socket transparent 1 meta mark set $default_mark accept # 绕过已经建立的连接
        meta mark $default_mark goto mihomo_tproxy                                        # 已经打上 default_mar 标记的属于本机流量转过来的，直接进入透明代理
        fib daddr type { local, broadcast, anycast, multicast } accept                    # 绕过本地、单播、组播、多播地址
        tcp dport $lan_2_dport_tcp accept                                                 # 绕过经由本机到目标端口的 TCP 流量
        udp dport $lan_2_dport_udp accept                                                 # 绕过经由本地到目标端口的 UDP 流量
        meta nfproto ipv4 ip daddr @private_address4_set accept                           # 绕过目标地址为保留IP的地址(IPv4)
        meta nfproto ipv6 ip6 daddr @private_address6_set accept                          # 绕过目标地址为保留IP的地址(IPv6)
        goto mihomo_tproxy                                                                # 其他流量透明代理到 mihomo
    }

    ## 透明代理
    chain mihomo_tproxy {
        meta l4proto { tcp, udp } tproxy to :$tproxy_port meta mark set $default_mark
    }

    ## output链
    chain output {
        type route hook output priority filter; policy accept;
        oifname != $interface accept                                                      # 绕过本机内部通信的流量（接口lo）
        meta mark $mihomo_mark accept                                                     # 绕过本机 mihomo 发出的流量
        fib daddr type { local, broadcast, anycast, multicast } accept                    # 绕过本地、单播、组播、多播地址
        udp dport { 53, 123 } accept                                                      # 绕过本机 DNS 查询、NTP 流量
        tcp sport $local_tcp_port accept                                                  # 绕过本地运行了服务的 TCP 端口，如果并不需要从公网访问这些端口，可以注释掉本行
        meta nfproto ipv4 ip daddr @private_address4_set accept                           # 绕过目标地址为保留IP的地址(IPv4)
        meta nfproto ipv6 ip6 daddr @private_address6_set accept                          # 绕过目标地址为保留IP的地址(IPv6)
        meta l4proto { tcp, udp } meta mark set $default_mark                             # 其他流量重路由到prerouting
    }
}

```
其中要注意以下自行更改内容：
1. `define interface = eth0` 网口要换成你自己的网口，在 mihomo 的配置文件中也要匹配；
2. `define tproxy_port = 7893` 透明代理端口也要和 mihomo 匹配得上；
3. `define mihomo_mark = 233` 包标识要和 mihomo 的 `routing-mark` 匹配得上。

保存并给予运行权限 `chmod +x /etc/wireguard/tproxy.nft`。同时在 WireGuard 配置文件 `/etc/wireguard/tunnel.conf` 中添加以下两行以自动配置防火墙规则：
```cfg
[Interface]
...

PostUp = ip route add local default dev eth0 table 100 ; ip rule add fwmark 1 lookup 100 ; /etc/wireguard/tproxy.nft
PostDown = nft flush ruleset ; ip route del local default dev eth0 table 100 ; ip rule del fwmark 1 lookup 100

...
[Peer]
...
```
其中 `eth0` 要换成你自己的网口，上同。

至此透明代理规则已经配置完成。注意这个规则是会将 IPv4 和 IPv6 的私有地址直接放行而未经过透明代理，而系统配置中可能未配置这些流量的转发，故访问这些私有地址的流量可能会迷失在系统里。但是因为我们在 OPNsense 里配置透明代理的时候已经剔除了内网流量，所以影响不大，需要注意。

关于 IPv6 的问题，很多特殊服务提供商并不会提供关于 IPv6 的服务，故某些人可能会遇到打开一个特殊应用转半天圈，最后才加载出来的情况。这大概率是应用开始时使用 IPv6 模式，但是发现不通后 fallback 到 IPv4 模式。故个人推荐是直接在 OPNsense 的防火墙规则中 Reject 代理设备的前往国外（用 GeoIP 匹配）的流量。

（偷偷做一个不相干的安利：`os-caddy` 插件的 layer 4 proxy 模式真好用，懂的人会懂，支持 UDP，可以去试试）
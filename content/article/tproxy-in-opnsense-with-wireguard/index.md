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
**注意！：此篇文章并非完整教程，因为部分环节的原理我还没弄懂（Help wanted），故这篇文章并非教程，并在照着这篇文章进行操作时请明白你自己在做什么！出现任何问题后果请自负！**
<!--more-->

注意2：此篇文章全文未使用 AI 撰写（~~除了文章头图是尝试找了个 AI 生成了一个 meme 图~~ 来自未来的我：AI 真 tm 垃圾，算了还是我自己p吧），故请放心食用~

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
- 你不知道你自己在操作的时候每一步在干什么：这种方法涉及很多网络相关的深度知识，有些我自己也没有搞懂。对于我自己都没有搞懂的部分（我会在文章中明确标出），我不会尝试去回答；
- 你不知道你自己在干什么：这篇文章不会说明一些**简单操作**的通用方法（比如安装WireGuard、配置 WireGuard、设置 WireGuard 自启等等），只会写出在我自己的环境下的配置方法，我也不一定会有时间去解答在你使用的系统中如何完成我文章里面的操作；
- 这种方法的性能、资源使用、稳定性我都还没有测试过。

-----
## 我的环境
1. EndPoint: 作为安装了你喜欢的代理工具和 WireGuard 出口的服务器，我选择的是 `Alpine Linux`（之后教程的操作也会基于该系统）；
2. OPNsense: `2.5.17_2`（部分操作因为官方教程有更新，所以要重点注意部分我标明的地方）；
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

注意！：在原官方文档中，是有配置 `Gateways` 的地方的，新版的 UI 更改给改没了，所以我就把 IP 填进了 Tunnel address 中，虽然不知道有没有用，反正我是能用（逃）

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
以下很多设置我都不太清楚原理（这些内容都是官方文档的操作中），我只能提供我所收集到的所有资料。

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

IPv6 版本也可以按这个配置再配置一个，TCP/IP Version 选 IPv6，Source 和 Destination 选对应网口。

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
说句实话，对于这一部分我是真的一窍不通（iptables 和 Linux 网络栈相关内容），所以这一部分我会非常简略地带过。总之，help wanted.

这一部分主要是配置 EndPoint 服务器的透明代理规则，让从 `tunnel` 网口内的流量走本地的代理应用。而这一部分的配置我是全权让 `mihomo` 自动给我配置的 tproxy 模式，并且其所配置的规则是默认接受非内网 IP 的所有流量到其自生（所以你看我的文章里缺少了一部分关于如何配置 iptables 让 WireGuard 流量能够走向互联网）。

我也尝试打开 `mihomo` 的 debug 模式看它到底设置了哪些 iptables 命令，事实是我并看不懂。而且其设置的规则是非内网 IP 会经过其自身，内网 IP 因为没有额外配置路由所以流量就迷失在了系统里。而因为我们在 OPNsense 里配置透明代理的时候已经剔除了内网流量，所以影响不大，但是对部分人来说会存在问题。

（这篇文章就这样草草结束了，或者等我什么时候上完班有兴致来研究这一部分的内容，但是目前来说我是没有兴趣去研究。over。）

（偷偷做一个不相干的安利：`os-caddy` 插件的 layer 4 proxy 模式真好用，懂的人会懂，支持 UDP，可以去试试）
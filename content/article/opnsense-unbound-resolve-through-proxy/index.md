---
title: "OPNsense 的 Unbound 使用代理进行递归查询（无DNS泄露）"
date: 2025-10-07T00:44:01+08:00
draft: false
categories: ['Learning']
tags: ['Selfhosted', 'Learning', '2025']
summary: "方法很简单也很邪门，但是也是当下（可能的）最优方案。"
---

-----
## 前置条件
1. 有一个指向代理服务的网关（透明代理），具体实现方法可参考文章 [使用 WireGuard 在 OPNsense 实现透明代理（进阶） - Kre's Blog](/article/tproxy-in-opnsense-with-wireguard/) **（推荐）**，或者 [在 OPNsense 上安装 tun2socks 服务 - Kre's Blog](/article/setup-tun2socks-in-opnsense/) 。这里的代理服务所在网关为 `TUNPROXY`。
2. 启用 Unbound 作为递归 DNS 查询服务器。

-----
## 操作步骤
### 1. 设置 Unbound 的 DoT
在 Services ‣ Unbound DNS ‣ DNS over TLS 里，添加以下 DoT 设置（你也可以选择你喜欢的 DoT 服务商）：
| Setting | Value |
| ------------------------------- | ---------------- |
| Enable                          | True             |
| Server IP                       | 1.1.1.1          |
| Server Port                     | 853              |
| Verify CN                       | one.one.one.one  |

| Setting | Value |
| ------------------------------- | ---------------- |
| Enable                          | True             |
| Server IP                       | 9.9.9.9          |
| Server Port                     | 853              |
| Verify CN                       | dns.quad9.net    |

应用更改。

### 2. 设置路由表
在 System ‣ Routes ‣ Configuration 里，设置以下路由表：
| Setting | Value |
| ------------------------------- | ---------------- |
| Network Address                 | 1.1.1.1/32       |
| Gateway                         | TUNPROXY         |

| Setting | Value |
| ------------------------------- | ---------------- |
| Network Address                 | 9.9.9.9/32       |
| Gateway                         | TUNPROXY         |

如果你的 DNS 地址在上一步填写的是 IPv6 版本，这里也要记得 Gateway 要选择 IPv6 版本的网关。

{{< alert >}}
**注意：** 此步可能会造成潜在的流量循环，即如果在局域网的代理软件直接向 1.1.1.1/9.9.9.9 发起任何形式的查询请求，都会被以上路由表导回自身。所以要么代理服务不要使用以上 IP 的 DNS 服务，要么以上 IP 的 DNS 查询强制走自身代理。
{{< /alert >}}

### 3. （可选）启用 Unbound 的 DNSSEC
在 Services ‣ Unbound DNS ‣ General 里，启用 `Enable DNSSEC Support`，并应用。

-----
## 优点
1. 国外网站的解析能保证干净；
2. 满足你的小小洁癖/癖好，解析过程是相对安全的；
3. 能够使用 DNSSEC；
4. 无DNS泄露。

-----
## 缺点
1. 潜在的流量循环（见上文注意事项）；
2. 所有设备所有向 1.1.1.1/9.9.9.9 的流量都会走代理，不好进行规划；
3. 代理服务如果不稳定的话会影响首次查询速度（但是缓存下来的第二次就会快很多）；
4. 一些基于地理位置的解析结果会因为代理的原因返回非期望的结果。

-----
## 为什么这么做
本来 Unbound 是支持设置 `Outgoing Network Interfaces` 的，但是貌似[在 21.7 及以后的版本砍掉了这个功能](https://forum.opnsense.org/index.php?topic=25395.msg121998)。故现在有两个方法去实现这个功能：
1. 写静态路由，也是本方法（参考：[adguard home lookups through WG tunnel? - OPNsense Forum](https://forum.opnsense.org/index.php?topic=24192.msg116770#msg116770)）；
2. 先写一个路由将 `TUNPROXY` 的流量向 WAN 走，再将 `TUNPROXY` 设置为 Upstream Gateway 并给予一个更高的优先级（Priority 值设置得比 WAN 低），让所有流量（包括 OPNsense 本身的流量）往代理走。没折腾出来，也觉得这样设置太破坏性了（参考：[Unbound outgoing network interface - OPNsense Forum](https://forum.opnsense.org/index.php?topic=35170.0)）。

本来一开始是想写 Floating Rules 匹配来自 OPNsense 的流量然后路由到代理网关里，但是流量匹配到了但是莫名奇妙连不通，然后遂在网上乱查找到以上的内容，最后采用本文方法。如果以后整出来了再试试吧。
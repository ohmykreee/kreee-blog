---
title: "Using Proxy for Recursive Queries in OPNSense's Unbound (No DNS Leaks)"
date: 2025-10-07T00:44:01+08:00
draft: false
categories: ['Learning']
tags: ['Selfhosted', 'Learning', '2025']
summary: "The method is simple yet unconventional, but it may be the best solution available at the moment."
---

-----
## Prerequisites
1. Have a configured gateway pointing to a proxy service (transparent proxy). For specific implementation methods, refer to the article [Using WireGuard for Transparent Proxying in OPNsense (Advanced) - Kre's Blog](/en/article/tproxy-in-opnsense-with-wireguard/) **(Recommended)**, or [Setting up tun2socks service on OPNsense - Kre's Blog](/en/article/setup-tun2socks-in-opnsense/). In this article the gateway is `TUNPROXY`.
2. Enable Unbound as a recursive DNS query server.

-----
## Steps
### 1. Configure Unbound's DoT
In Services ‣ Unbound DNS ‣ DNS over TLS, add the following DoT settings (you can also choose your preferred DoT provider):
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

Apply the changes.

### 2. Configure Routing Table
In System ‣ Routes ‣ Configuration, set up the following routing table:
| Setting | Value |
| ------------------------------- | ---------------- |
| Network Address                 | 1.1.1.1/32       |
| Gateway                         | TUNPROXY         |

| Setting | Value |
| ------------------------------- | ---------------- |
| Network Address                 | 9.9.9.9/32       |
| Gateway                         | TUNPROXY         |

If you filled in the IPv6 version of the DNS address in the previous step, remember to select the IPv6 version of the gateway here as well.

{{< alert >}}
**Note:** This step may cause potential traffic loops, meaning if proxy software on the local network initiates any form of query request directly to 1.1.1.1/9.9.9.9, it will be routed back to itself by the above routing table. So either the proxy service should not use DNS services with the above IPs, or DNS queries to the above IPs should be forced to go through its own proxy.
{{< /alert >}}

### 3. (Optional) Enable DNSSEC in Unbound
In Services ‣ Unbound DNS ‣ General, enable `Enable DNSSEC Support` and apply.

-----
## Advantages
1. Satisfies your minor obsession/preference, the resolution process is relatively secure;
2. Able to use DNSSEC;
3. DNS leaks safe.

-----
## Disadvantages
1. Potential traffic loops (see the note above);
2. All traffic from all devices to 1.1.1.1/9.9.9.9 will go through the proxy, difficult to supervise;
3. If the proxy service is unstable, it will affect the initial query speed (but the second query with cached results will be much faster);
4. Some geolocation-based resolution results may return unexpected results due to the proxy.

-----
## Why Do This
Originally, Unbound supported setting `Outgoing Network Interfaces`, but apparently [this feature was removed in version 21.7 and later](https://forum.opnsense.org/index.php?topic=25395.msg121998). Therefore, there are now two methods to implement this functionality:
1. Write static routes, which is the method in this article (Reference: [adguard home lookups through WG tunnel? - OPNsense Forum](https://forum.opnsense.org/index.php?topic=24192.msg116770#msg116770));
2. First write a route to direct `TUNPROXY` traffic through WAN, then set `TUNPROXY` as the Upstream Gateway and give it a higher priority (set Priority value lower than WAN), so that all traffic (including OPNsense's own traffic) goes through the proxy. Couldn't get this to work, and also felt this setup was too destructive (Reference: [Unbound outgoing network interface - OPNsense Forum](https://forum.opnsense.org/index.php?topic=35170.0)).

Originally, I wanted to write Floating Rules to match traffic from OPNsense itself and then route it to the proxy gateway, but the connection was matched yet mysteriously couldn't work. Then I searched randomly online and found the above content, and finally adopted the method in this article. If I figure it out in the future, I'll try again.
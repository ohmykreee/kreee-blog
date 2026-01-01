---
title: "OPNsense + Loki + Grafana 实现防火墙/IDS日志可观测性"
date: 2026-01-01T13:23:56+08:00
draft: false
categories: ['Learning']
tags: ['Selfhosted', 'Learning', '2026']
summary: "我的 2026 跨年是和 Loki 与 Grafana 过的。"
---

-----
## 先放成品截图

{{< alert "lightbulb" >}}
点击图片可以放大。
{{< /alert >}}

1. OPNsense Firewall Dashboard

{{< gallery >}}
  <img src="img/firewall-01.png" class="grid-w50" />
  <img src="img/firewall-02.png" class="grid-w50" />
{{< /gallery >}}

2. OPNsense IDS/IPS Dashboard

{{< gallery >}}
  <img src="img/ids-01.png" class="grid-w50" />
  <img src="img/ids-03.png" class="grid-w50" />
{{< /gallery >}}


-----
## 主要监控流程

{{< mermaid >}}
graph LR;
A[OPNsense]-->B[Alloy];
B-->C[Loki]
C-->D[Grafana]
{{< /mermaid >}}

1. OPNsense 通过将 `filterlog` / `suricata` 的 syslog 发送给 Alloy 进行收集和打标签
2. Alloy 再把处理过后的日志发送存储在 Loki 中
3. Grafana 连接 Loki 进行数据展示

-----
## 服务搭建

{{< alert "lightbulb" >}}
因为编写时间有限 + 搭建需要基础的操作知识，故接下来不会详细介绍每一个步骤（默认读者已经掌握基础的操作知识），只会给出关键操作步骤和提示。
{{< /alert >}}

因为我整套 Grafana 是通过 Docker 搭建的，故这里不详细介绍搭建流程，只提供 `docker-compse.yaml` 作为参考：
```yaml
---
# https://grafana.com/docs/grafana/latest/setup-grafana/installation/docker/
services:
  grafana:
    user: "1001:100"
    image: grafana/grafana:latest
    container_name: grafana
    environment:
      - TZ=Asia/Shanghai
      - GF_DEFAULT_INSTANCE_NAME=TurboKre_Dashboard
      - GF_SERVER_ROOT_URL=https://dash.example.com/
      - GF_SMTP_FROM_ADDRESS=no-reply@kre3.net
      - GF_SMTP_HOST=smtp.example.com
      - GF_SMTP_USER=admin
      - GF_SMTP_PASSWORD=password
    networks:
      - grafananet
    hostname: grafana
    ports:
      - 8090:3000
    volumes:
      - /path/to/grafana/data:/var/lib/grafana
    restart: unless-stopped

  loki:
    user: "1001:100"
    image: grafana/loki:latest
    container_name: grafana-loki
    hostname: loki # on port 3100
    networks:
      - grafananet
    volumes:
      - /path/to/loki/config.yaml:/etc/loki/local-config.yaml
      - /path/to/loki/data:/var/lib/loki
    command: -config.file=/etc/loki/local-config.yaml

  alloy:
    user: "1001:100"
    image: grafana/alloy:latest
    container_name: grafana-alloy
    hostname: alloy
    networks:
      - grafananet
    ports:
      - 8091:8091
      - 8092:8092
    volumes:
      - /path/to/alloy/config.alloy:/etc/alloy/config.alloy
      - /path/to/alloy/data:/var/lib/alloy
      - /path/to/alloy/GeoLite2-City.mmdb:/etc/alloy/GeoLite2-City.mmdb
    command: 
      - run
      - --server.http.listen-addr=0.0.0.0:12345
      - --storage.path=/var/lib/alloy
      - /etc/alloy/config.alloy

networks:
  grafananet:
    driver: bridge
```
注意事项：
1. 因为我使用了外部文件映射 Volume，所以存储文件时会出现权限问题。这里强制设置以 `1001:100` 用户运行，实际请根据你的情况变更（建议直接使用 docker volume）
2. Grafana 建议配置好 SMTP email notify，方便之后可以通过邮件进行告警
3. 要提前提供好 `GeoLite2-City.mmdb` 给 Alloy，以方便之后步骤匹配 IP 的地理坐标

-----
## 配置 Loki
给 Loki 的配置文件写入以下内容：
```yaml
auth_enabled: false

server:
  http_listen_port: 3100

common:
  path_prefix: /var/lib/loki
  storage:
    filesystem:
      chunks_directory: /var/lib/loki/chunks
      rules_directory: /var/lib/loki/rules
  replication_factor: 1
  ring:
    kvstore:
      store: inmemory

schema_config:
  configs:
    - from: 2020-10-24
      store: tsdb
      object_store: filesystem
      schema: v13
      index:
        prefix: index_
        period: 24h
```
1. 这里 Loki 和 Grafana、Alloy 都配置在同一个 docker network 中，故这里不配置加密或验证。如果在 k8s 环境或者公网环境中，建议配置好加密或者验证
2. Loki 的端口为默认的 `3100`，之后会用到

-----
## 配置 Grafana 连接到 Loki
在 Connections ‣ Add new connections 中，添加 Loki 数据源，并且在 Connection Url 中填写 `http://loki:3100`。

测试并保存连接。

-----
## 配置 Alloy
给 Alloy 的配置文件写入以下内容：
```hcl
loki.write "local_loki" {
  endpoint {
    url = "http://loki:3100/loki/api/v1/push"
  }
}

loki.source.syslog "syslog_firewall" {
  listener {
    address = "0.0.0.0:8091"
    idle_timeout = "60s"
    label_structured_data = true
    labels = {
      job = "syslog",
      app = "filterlog",
    }
  }
  forward_to = [loki.process.firewall_ips.receiver]
}

loki.source.syslog "syslog_ids" {
  listener {
    address = "0.0.0.0:8092"
    idle_timeout = "60s"
    label_structured_data = true
    labels = {
      job = "syslog",
      app = "suricata",
    }
  }
  forward_to = [loki.process.ids_ips.receiver]
}

loki.process "firewall_ips" {
  forward_to = [loki.relabel.hostname_labels.receiver]

  stage.regex {
    expression = ",(?P<srcip>([0-9]+\\.[0-9\\.]+)|([0-9a-fA-F]*:[0-9a-fA-F:]+)),(?P<dstip>([0-9]+\\.[0-9\\.]+)|([0-9a-fA-F]*:[0-9a-fA-F:]+)),"
  }

  stage.geoip {
    source = "srcip"
    db = "/etc/alloy/GeoLite2-City.mmdb"
    db_type = "city"
  }

  stage.labels {
    values = {
      src_city_name = "geoip_city_name",
      src_country_name = "geoip_country_name",
      src_location_latitude = "geoip_location_latitude",
      src_location_longitude = "geoip_location_longitude",
    }
  }

  stage.geoip {
    source = "dstip"
    db = "/etc/alloy/GeoLite2-City.mmdb"
    db_type = "city"
  }

  stage.labels {
    values = {
      dst_city_name = "geoip_city_name",
      dst_country_name = "geoip_country_name",
      dst_location_latitude = "geoip_location_latitude",
      dst_location_longitude = "geoip_location_longitude",
    }
  }
}

loki.process "ids_ips" {
  forward_to = [loki.relabel.hostname_labels.receiver]

  stage.json {
    expressions = {
      srcip = "src_ip",
      dstip = "dest_ip",
    }
  }
  
  stage.geoip {
    source = "srcip"
    db = "/etc/alloy/GeoLite2-City.mmdb"
    db_type = "city"
  }

  stage.labels {
    values = {
      src_city_name = "geoip_city_name",
      src_country_name = "geoip_country_name",
      src_location_latitude = "geoip_location_latitude",
      src_location_longitude = "geoip_location_longitude",
    }
  }

  stage.geoip {
    source = "dstip"
    db = "/etc/alloy/GeoLite2-City.mmdb"
    db_type = "city"
  }

  stage.labels {
    values = {
      dst_city_name = "geoip_city_name",
      dst_country_name = "geoip_country_name",
      dst_location_latitude = "geoip_location_latitude",
      dst_location_longitude = "geoip_location_longitude",
    }
  }
}

loki.relabel "hostname_labels" {
  forward_to = [loki.write.local_loki.receiver]

  rule {
    action        = "replace"
    target_label  = "hostname"
    replacement   = "OPNSense.example.com"  # don't work, need investigation
  }
}
```
几个重要的 Label，会被之后的 Dashboard 所用：
1. 必须要有 `hostname`，配置文件中放在了 `loki.relabel "hostname_labels"`。因为在个人测试中 Alloy 死活读不出 `__syslog_connection_hostname` 或者 `__syslog_message_hostname`，所以这里我就写死了（因为我只有一个机器需要监控）。~~如果有有缘人可以帮我调查一下。~~这里的 `hostname` 会被之后的 Dashboard 进行筛选数据来源
2. 必须要有 `app` 并且为 `filterlog` 或 `suricata` 的其中之一。这里通过两个不同的端口：`8901` 给 filterlog，`8902` 给 suricata。之后会被 Dashboard 判断来自哪个应用
3. 为了展示地图数据要有经纬度：`src_location_latitude` `src_location_longitude` `dst_location_latitude` `dst_location_longitude`
4. 为了能够匹配 IP 的地理位置，要给 Alloy 提供 `/etc/alloy/GeoLite2-City.mmdb`

-----
## 配置 OPNsense 发送 syslog
### 配置 IDS/IPS
这里已经默认你已经设置好了 IDS/IPS （即启用了 suricata，下载了规则集，并正确设置好了端口）。

打开 `Enable eve syslog output`（`Enable syslog alerts` 可以不用打开），将结构化的日志推送到 OPNsense 的 syslog 中；

在 System ‣ Settings ‣ Logging ‣ Remote 中，新增以下条目：
| Setting | Value |
| --------------------- | ----------------------------------------------- |
| Enabled               | True                                            |
| Transport             | TCP(4)                                          |
| Applications          | suricata (suricata)                              |
| Levels                | Info 及以上                                     |
| Hostname              | Alloy 所在地址                                  |
| Port                  | 8092                                            |
| rfc5424               | True                                            |

1. 协议建议选 IPv4 TCP，你也可以选择 IPv4 UDP，但是我测试了死活发送不出去
2. `rfc5424` 务必要选，不然发不出去
3. 如果半天没有日志，就去 Interface Diagnostics 那边抓 LAN 口的 8092 的包，看有没有在发。一般情况下保存生效就会发，但是有社区反馈这个功能可能有点 buggy，如果没有包就重启一下 OPNsense
4. 不用担心会把一堆不要的日志发送给 Loki，之后分析会仅分析结构化的日志。这里勾选这么多是确保 eve log 会发送出去，但是我也一下子找不到 eve log 是哪个级别的了。**千万不要勾选 debug，会日志爆炸的！**

### 配置 Firewall
还是在 System ‣ Settings ‣ Logging ‣ Remote 中，新增以下条目：
| Setting | Value |
| --------------------- | ----------------------------------------------- |
| Enabled               | True                                            |
| Transport             | TCP(4)                                          |
| Applications          | filter (filterlog)                              |
| Levels                | Info 及以上                                     |
| Hostname              | Alloy 所在地址                                  |
| Port                  | 8091                                            |
| rfc5424               | True                                            |

1. 同样，按照其他人说法，只要 `Info` 级别日志就行，但是这里是全勾选。**千万不要勾选 debug，会日志爆炸的！**

-----
## 配置 Grafana Dashboard
这里就不赘诉怎么搭这些面板的了。灵感来源于 [OPNsense & IDS/IPS](https://grafana.com/grafana/dashboards/17547-opnsense-ids-ips/) 和 [pfSense/OPNsense Filter](https://grafana.com/grafana/dashboards/22722-pfsense-opnsense-filter/)，Firewall 面板是在别人基础上改的，IDS/IPS 面板是依据别人的设计思路照着 Firewall 面板抄的。如果你想学习如何搭建的面板，可以自己进编辑模式查看查询语句和设置。

由于我自己是已经提前修改过了，所以 Label filter 应该是对应得上的。如果你的 Alloy 步骤有修改成你自己的 Label，这里可以直接一键替换 json 中内容再导入到 Grafana。

{{< button href="/article/opnsense-firewall-observation-with-grafana/dashboard/dashboard-firewall.json" target="_blank" rel="noopener noreferrer">}}
点此打开 Firewall Dashboard 文件
{{< /button >}}
<br/>
<br/>
{{< button href="/article/opnsense-firewall-observation-with-grafana/dashboard/dashboard-ids.json" target="_blank" rel="noopener noreferrer">}}
点此打开 IDS/IPS Dashboard 文件
{{< /button >}}

点击按钮会在新标签中打开对应 json 文件内容。复制所有内容并粘贴在 Grafana 导入中，就可以导入这两个 Dashboard。
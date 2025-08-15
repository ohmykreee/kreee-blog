---
title: "Docker Learning Notes"
date: 2021-03-01T15:44:08+08:00
draft: false
tags: ['Selfhosted', 'Learning', '2021']
categories: ['Learning']
summary: "But now I'm really bored + there are still many software based on Docker (or only provide Docker installation tutorials, which is annoying), so I plan to deploy the core services directly on the server, and put some unimportant things in Docker."
---

{{< alert icon="language">}}
The English version is translated by AI (Gemini 2.5 Pro Preview). If you want to view the original content, please switch to Chinese version.
{{< /alert >}}

---

I didn't plan to use Docker to configure services at first: although Docker can indeed save the trouble of configuring the environment, I always feel uncomfortable somewhere (mistake).
Actually, it's because the server doesn't run for a long time and will be shut down/restarted from time to time, and I have to restart it in Docker.
And it is said that there are security risks (in fact, other software will have security risks if configured improperly 233)
But now I'm really bored + there are still many software based on Docker (or only provide Docker installation tutorials, which is annoying), so I plan to deploy the core services directly on the server, and put some unimportant things in Docker.
Now, let's begin!

-----
## Install Docker
> Based on https://mirrors.tuna.tsinghua.edu.cn/help/docker-ce/

If it is a fresh installation (and using Minimal installation), Docker is not pre-installed. If you have it, please uninstall it first.
Check if Docker is present:
```bash
rpm -qa | grep Docker
```
Uninstall Docker:
```bash
yum remove docker docker-common docker-selinux docker-engine
```
Install dependencies:
```bash
yum install -y yum-utils device-mapper-persistent-data lvm2
```
Download repo file:
```bash
wget -O /etc/yum.repos.d/docker-ce.repo https://download.docker.com/linux/centos/docker-ce.repo
```
Replace the software repository address (here is TUNA)
(When will our school also have an open source software mirror library?)
```bash
sed -i 's+download.docker.com+mirrors.tuna.tsinghua.edu.cn/docker-ce+' /etc/yum.repos.d/docker-ce.repo
```
Install Docker:
```bash
yum makecache fast
yum install -y docker-ce
```
Start Docker:
```bash
systemctl start docker
```

-----
## Using Docker
List all containers:
```bash
docker ps -a
```
Start a container (using container ID):
```bash
docker start *containerID*
```
Similarly, stop `stop`, restart `restart`, clear `rm`, view mapped ports `port`, view logs `logs`.

Create a container and run it in the background and enter the background container:
```bash
docker run -itd --name *yourname* *container*
docker exec -it *containerID*
```

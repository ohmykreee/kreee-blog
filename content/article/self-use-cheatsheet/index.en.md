---
title: "Self-use Cheatsheet"
date: 2021-06-06T19:53:42+08:00
draft: false
categories: ['Learning']
tags: ['Selfhosted', 'Learning', '2021']
summary: "A self-use cheatsheet to record commands that are needed but easily forgotten. Constantly updating..."
---

{{< alert icon="language">}}
The English version is translated by AI (Gemini 2.5 Pro Preview). If you want to view the original content, please switch to Chinese version.
{{< /alert >}}

---

A self-use cheatsheet to record commands that are needed but easily forgotten.
Constantly updating...

-----

## Git
### Initialize
```bash
git init
```
### Associate with a remote repository
```bash
git remote add origin <remote address>
git -M main # Switch the default branch to main (master is no longer used)
git pull <local> <remote>
```
### Commit changes
```bash
git add <file>
git commit -m 'descriptions'
git push origin main
```
### Branch management
```bash
git branch <branch name>            # Create <branch name> branch
git checkout <branch name>          # Switch to <branch name> branch
git switch <branch name>            # Switch to <branch name> branch
git checkout -b <branch name>       # Create and switch to <branch name> branch
git switch -c <branch name>         # Create and switch to <branch name> branch
git branch                          # View existing branches (* indicates the current branch)
git merge <branch name>             # Merge <branch name> to the current branch (usually operated under the master branch)
git branch -d <branch name>         # Delete a branch (local)
git push <local> --delete <remote>  # Delete a branch (remote)
```
### Submodules
```bash
git submodule add <submodule address> <local folder> # Add a submodule, use --force to force the use of existing local files
git submodule foreach git pull    #Submodule update
```

-----
## Linux (Ubuntu) operations
### Change the Java version of the current environment
```bash
sudo update-alternatives --config java
```

### Create a user without a shell
According to [nobody - Ubuntu Wiki](https://wiki.ubuntu.com/nobody), it is not recommended to set the running permission of the program to `nobody:nogroup`, but to create a new user group.

(I can't be lazy anymore, sob)

(Method from [How can I create a non-login user? - superuser](https://superuser.com/questions/77617/how-can-i-create-a-non-login-user))
```bash
sudo useradd -r <username>
```
This will create a user with the group name and user name both as `<username>`, and without a user directory.

-----
## Certbot
### dns-challenge self-signed
```bash
certbot certonly --manual --preferred-challenges dns --email xxxxxx.xxxxx@outlook.com --agree-tos -d *.ohmykreee.top
```

-----
## pppoe-setup
### Set up dialing
```bash
pppoe-setup # Start interactive operation
```
### Connect and disconnect
```bash
ifup ppp0
ifdown ppp0
```
### Status
```bash
ifconfig ppp0
pppoe-status
```

-----
## docker
### List containers
```bash
docker ps -a
```
### Manage containers
```bash
docker start/stop/restart/rm/port/logs <container>
```
### Run a container in the background
```bash
docker run -itd --name <name> <container>  # -it: Use interactive mode and allocate a pseudo-terminal
docker exec -it <container>                # -d: Run the container in the background and return the container ID
```

---
title: "模拟键盘输入"
date: 2021-06-26T10:40:42+08:00
draft: false

categories: ['Code']
tags: ['Python', 'Study', 'Code Sharing', '2021']
author: "Kreee"
noSummary: false

resizeImages: false
---
懂的都懂这是干啥用的。

<!--more-->

`requirements.txt` ：
```plaintext
pynput==1.7.3
six==1.16.0
```
大佬建议直接用 `requirements.txt` 安装依赖。

安装方法（建议使用Pycharm）：   
新建项目，将代码复制粘贴。   
然后在下面的 Terminal 标签页里运行：
```plaintext
pip install pynput
```

-----
话不多说，直接上代码：
```python
import pynput
import time

# Setting are here:
timeOfSleep = 5
timeOfKeyStroke = 0.01

f = open('input.txt', 'w+')
f.close()
input('Please edit the input.txt file. When ready, press ENTER...')

inputFile = open('input.txt', 'r')
inputContents = inputFile.read()
inputFile.close()
simKeys = list(inputContents)

print('Will execute key stroke after {} secs...'.format(timeOfSleep))
time.sleep(timeOfSleep)
ctr = pynput.keyboard.Controller()
for i in simKeys:
    ctr.press(i)
    time.sleep(timeOfKeyStroke)
    ctr.release(i)

input('Finished!' + '\n' + 'Warning: text in input.txt will be deleted! Press ENTER to continue...')

f = open('input.txt', 'r+')
f.truncate()
f.close()

```
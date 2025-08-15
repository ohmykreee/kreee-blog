---
title: "Simulating Keyboard Input"
date: 2021-06-26T10:40:42+08:00
draft: false
categories: ['Code']
tags: ['Python', 'Study', 'Code Sharing', '2021']
summary: "Those who know, know what this is for."
---

{{< alert icon="language">}}
The English version is translated by AI (Gemini 2.5 Pro Preview). If you want to view the original content, please switch to Chinese version.
{{< /alert >}}

---

Those who know, know what this is for.

`requirements.txt`:
```plaintext
pynput==1.7.3
six==1.16.0
```
Experts suggest installing dependencies directly using `requirements.txt`.

Installation method (Pycharm is recommended):
Create a new project and copy and paste the code.
Then run in the Terminal tab below:
```plaintext
pip install pynput
```

-----
Without further ado, here's the code:
```python
import pynput
import time

# Setting are here:
timeOfSleep = 5
timeOfKeyStroke = 0.01

f = open('input.txt', 'w+')
f.close()
input('Please edit the input.txt file. When ready, press ENTER...')

inputFile = open('input.txt', 'r', encoding='utf-8')
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

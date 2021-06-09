---
title: "Python 期末编程题题库"
date: 2021-06-04T14:24:37+08:00

categories: ['Study']
tags: ['Python', 'Study', '2021']
author: "Kreee"
noSummary: false

resizeImages: false
---
（据说）Python 期末考的编程题会从这里面抽。   
有些没有答案的题目是临时写的，如果写的很烂欢迎反馈。   
愿人间没有挂科人。

<!--more-->

1. 从键盘输入三个数值，分别赋值给num1, num2和num3，并求它们的平均值。
```python
# by Kreee

num1 = eval(input('请输入第一个数字：'))
num2 = eval(input('请输入第二个数字：'))
num3 = eval(input('请输入第三个数字：'))

averNum = (num1 + num2 + num3) / 3
print('这三个数的平均数为：{}'.format(averNum))
```

-----
2. 输入一个三位数，输出它的逆序数，例如：输入123，输出321。
```python
# by Kreee

getInput = int(input('请输入一个三位整数：'))

numBit1 = getInput % 10
numBit2 = getInput // 10 % 10
numBit3 = getInput // 100 % 10
outNum = str(numBit1) + str(numBit2) + str(numBit3)

print('该三位数的逆序数为：{}'.format(outNum))
```

-----
3. 输入一个华氏温度，输出对应的摄氏温度。
```python
# by Kreee

TempStr = input('请输入华氏度：')
if TempStr[-1] in ['F', 'f', '℉']:
    C = (eval(TempStr[0: -1]) - 32) / 1.8
    print('转换后的温度是{:.2f}℃'.format(C))
else:
    C = (eval(TempStr) - 32) / 1.8
    print('转换后的温度是{:.2f}℃'.format(C))
```

-----
4. 使用键盘输入一个 Unicode 字符，显示出这个字符对应的 Unicode 编码值。
```python
# by Kreee

getInput = input('请输入一个字符：')
outOrd = ord(getInput)
print('字符 {} 的 Unicode 编码值为：{}'.format(getInput, outOrd))
```

-----
5. 在密码学中，恺撒密码（英语：Caesar cipher），或称恺撒加密、恺撒变换、变换加密，是一种最简单且最广为人知的加密技术。它是一种替换加密的技术，明文中的所有字母都在字母表上向后（或向前）按照一个固定数目进行偏移后被替换成密文。例如，当偏移量是3的时候，所有的字母A将被替换成D，B变成E，以此类推。这个加密方法是以罗马共和时期恺撒的名字命名的，当年恺撒曾用此方法与其将军们进行联系。请使用键盘输入偏移量，并使用偏移量对键盘输入对单个大写英文字母进行加密。如偏移量为3，输入英文字母为Z，则输出为C。
```python
# by 张忆文（文忆天下）

offset = int(input("输入的偏移量为:"))
inputChar = input("输入单个大写英文字母为：")
outputCharValue = (ord(inputChar) - ord("A") + offset) % 26
outputChar = chr(ord("A") + outputCharValue)
print("经过凯撒加密之后，输出的字符为:" + outputChar)
```
```python
# by Kreee

getShift = input('请输入偏移量（整数）：')
getInput = input('请输入待加密内容(单个英文字母）：')

# 检查用户输入
if getShift.isdigit() == False:
    print('输入不符合规范：偏移量不是整数！')
    exit(1)
if len(getInput) != 1:
    print('输入不符合规范：未输入单个字符！')
    exit(1)

# 计算密码
getShift = int(getShift)
inOrd = int(ord(getInput))
if 65 <= inOrd <= 90:
    outOrd = inOrd + getShift
    if outOrd > 90:
        outChr = chr(outOrd - 90 + 64)
    else:
        outChr = chr(outOrd)
elif 97 <= inOrd <= 122:
    outOrd = inOrd + getShift
    if outOrd > 122:
        outChr = chr(outOrd - 122 + 96)
    else:
        outChr = chr(outOrd)
else:
    print('输入不符合规范：非英文字母！')
    exit(1)
print('转换后的字符为： {}'.format(outChr))
```

-----
6. 使用 `random.randint(a, b)` 方法，随机生成三个100以内的自然数，求三个数的和。
```python
# by Kreee

import random

num1 = random.randint(0, 100)
num2 = random.randint(0, 100)
num3 = random.randint(0, 100)
averNum = (num1 + num2 + num3) / 3

print('随机产生的三个数为 {}, {}, {}, 它们的平均数为{}'.format(num1, num2, num3, averNum))
```

-----
7. 使用 `round(x, y)` 函数，可以将浮点数x保留y位小数。使用键盘，输入两个非零数，求这两个数的商，结果保留两位小数。输出的时候，请注意使用“➗”（十进制Unicode编码：10135）作为连接符表示除号。
```python
# by Kreee

num1 = eval(input("请输入第一个数："))
num2 = eval(input("请输入第二个数："))

outNum = round(num1 / num2, 2)

print(str(num1) + chr(10135) + str(num2) + '=' + str(outNum))
```

-----
8. 使用 `time.time()` 方法能够得到目前的时间点，距离1970年1月1日0时0点0分0秒已经过去了多少秒。已知，1970年1月1日星期四，使用计算机计算得出：   
（1）今天距离1970年1月1日，过了多少天   
（2）今天是星期几。   
```python
# by Kreee

import time

currTime = time.time()
dayPassed = int(currTime // (60 * 60 * 24))
weekPassed = int(dayPassed % 7)
if weekPassed > 3:
    currWeek = weekPassed - 3
else:
    currWeek = weekPassed + 4

print('今天距离1970年1月1日，过了 {} 天，今天是星期{}'.format(dayPassed, currWeek))
```

-----
9. 解一元二次方程组，ax** 2 + bx  + c = 0，时，有三种可能情况，分别为：   
1、 有两个不等实根   
2、 有两个相等实根   
3、 无实根。   
请使用键盘输入a, b, c的值，并输出一元二次方程的解。   
```python
# by 张忆文（文忆天下）

a, b, c = eval(input("输入一元二次方程的 a,b,c 的值以逗号隔开："))
if a == 0:
    if b == 0:
        if c == 0:
            print("该方程有任意解")
        else:
            print("该方程无解")
    else:
        print("该方程有唯一解且解为x1={}".format(-c/b))
else:
    delta = b ** 2 - 4 * a * c
    if delta < 0:
        print("ax**2+bx+c=0 这个方程无实数解")
    elif delta == 0:
        root = (-b) / (2 * a)
        print("ax**2+bx+c=0 这个方程有两个相等的根，其值为x1=x2={:.2f}".format(root))
    else:
        root1 = ((-b) + delta ** 0.5) / (2 * a)
        root2 = ((-b) - delta ** 0.5) / (2 * a)
        print("ax**2+bx+c=0 这个方程有两个不同的根: x1 = {:.2f}，其值为x2={:.2f}".format(root1, root2))
```

-----
10. 空气污染指数api的取值与对应的空气质量关系如下：0～50为优， 51～99为良，100～199为轻度污染，200～299为中度污染，300以上为重污染。请编写程序，从键盘输入api值，并输出api值所对应的空气质量。
```python
# by Kreee

getApiNum = int(input('请输入空气污染指数：'))

if getApiNum <= 50:
    outResult = '优'
elif 51 <= getApiNum <= 99:
    outResult = '良'
elif 100 <= getApiNum <= 199:
    outResult = '轻度污染'
elif 200 <= getApiNum <= 299:
    outResult = '中度污染'
elif 300 <= getApiNum:
    outResult = '重度污染'

print('空气质量为：{}'.format(outResult))
```

-----
11. 蔡勒（Zeller）公式，是一个计算星期的公式，随便给一个日期，就能用这个公式推算出是星期几。蔡勒（Zeller）公式为：   
> w = (y + [y / 4] + [c / 4] - 2c + [26(m + 1) / 10] + d - 1) % 7   

其中：   
w：代表星期几；w对7取模得：0-星期日，1-星期一，2-星期二，3-星期三，4-星期四，5-星期五，6-星期六   
c：世纪数（注：一般情况下，在公式中取值为已经过的世纪数，也就是年份除以一百的结果，c应该等于所在世纪的编号，如公元2021年，c就等于20）   
y：世纪的年数（一般情况下是年份的后两位数，如公元2021年，y就等于21）   
m：月份（m大于等于3，小于等于14，即在蔡勒公式中，某年的1、2月要看作上一年的13、14月来计算，比如2003年1月1日要看作2002年的13月1日来计算）   
d：日   
[ ]代表取整，即只要整数部分。   
请使用计算机编写程序，输入年、月、日，输出对应星期几。   
```python
# by 张忆文（文忆天下）

year = int(input("输入年份："))
month = int(input("输入月份："))
day = int(input("输入日："))
m = month

if month < 3:
    m = month + 12
    year = year - 1

c = year // 100
y = year % 100
d = day
w = (y + (y // 4) + (c // 4) - 2 * c + (26 * (m + 1) // 10) + d - 1) % 7

if(w == 1):
    message = "星期一"
elif (w == 2):
    message = "星期二"
elif (w == 3):
    message = "星期三"
elif (w == 4):
    message = "星期四"
elif (w == 5):
    message = "星期五"
elif (w == 6):
    message = "星期六"
else:
    message = "星期日"
print("输入{}年{}月{}日,输出{}".format(year, month, day, message))
```

-----
12. 输入两个圆的圆心坐标及这两个圆对应的半径，求这两个圆之间的关系，是内含、内切，相交、外切还是分离？
```python
# by 张忆文（文忆天下）

x1, y1 = eval(input("输入一个圆的圆心坐标:"))
r1 = eval(input("输入圆的半径:"))
x2, y2 = eval(input("输入另一个圆的圆心坐标:"))
r2 = eval(input("输入圆的半径:"))

# distance 代表两个圆心坐标的距离
distance = ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5

# 对圆的关系进行判断
if distance < abs(r1 - r2):
    print("这两个圆的关系是：内含")
elif distance == abs(r1 - r2):
    print("这两个圆的关系是：内切")
elif distance < r1 + r2:
    print("这两个圆的关系是：相交")
elif distance == r1 + r2:
    print("这两个圆的关系是：外切")
else:
    print("这两个圆的关系是：分离")
```

-----
13. 剪刀、石头布、是一种划拳游戏。剪刀赢布、布赢石头、石头赢剪刀。假设使用三个整数0、1、2来分别代表石头、剪刀、布，计算机随机生成三个整数（0、1、2）中的一个，用户使用键盘输入（0、1、2）中的一个整数，程序判断是计算机赢了，还是用户赢了，还是平局。
```python
# by 张忆文（文忆天下）

import random

computer = random.randint(0,2)
you = int(input("石头(0), 剪刀(1), 布(2)："))
message = "电脑出的是："

if computer == 0:
    message = message + "石头(0)，你出的是："
    if you == 0:
        message = message + "石头(0)，是平局！"
    elif you == 1:
        message = message + "剪刀(1)，你输了！"
    else:
        message = message + "布(2)，你赢了！"
elif computer == 1:
    message = message + "剪刀(1)，你出的是："
    if you == 0:
        message = message + "石头(0)，你赢了！"
    elif you == 1:
        message = message + "剪刀(1)，是平局！"
    else:
        message = message + "布(2)，你输了！"
else:
    message = message + "布(2)，你出的是："
    if you == 0:
        message = message + "石头(0)，你输了！"
    elif you == 1:
        message = message + "剪刀(1)，你赢了！！"
    else:
        message = message + "布(2)，是平局！"

print(message)
```
```python
# by Kreee

import random

getInput = int(input('划拳游戏：石头（整数0）剪刀（整数1）布（整数2）：'))
getRandom = random.randint(0, 2)
flag = ''
outUser = ''
outCom = ''

if getInput == 0:
    outUser = '石头(0)'
    if getRandom == 0:
        outCom = '石头(0)'
        flag = 'tie'
    elif getRandom == 1:
        outCom = '剪刀(1)'
        flag = 'user'
    elif getRandom == 2:
        outCom = '布(2)'
        flag = 'com'
elif getInput == 1:
    outUser = '剪刀(1)'
    if getRandom == 0:
        outCom = '石头(0)'
        flag = 'com'
    elif getRandom == 1:
        outCom = '剪刀(1)'
        flag = 'tie'
    elif getRandom == 2:
        outCom = '布(2)'
        flag = 'user'
elif getInput == 2:
    outUser = '布(3)'
    if getRandom == 0:
        outCom = '石头(0)'
        flag = 'user'
    elif getRandom == 1:
        outCom = '剪刀(1)'
        flag = 'com'
    elif getRandom == 2:
        outCom = '布(2)'
        flag = 'tie'
else:
    print('非法输入！')

if flag == 'user':
    print('电脑出的是：{}，你出的是：{}，你赢了！'.format(outCom, outUser))
elif flag == 'com':
    print('电脑出的是：{}，你出的是：{}，你输了！'.format(outCom, outUser))
elif flag == 'tie':
    print('电脑出的是：{}，你出的是：{}，平局！'.format(outCom, outUser))
```

-----
14. 某公司进行绩效分配的时候，需要编制一个计算机程序帮助计算奖金。假设一个部门经理的全部门拿到了500万元以上的订单，则部门经理获得总订单额度的1%作为个人绩效奖励，如果没有达到这个额度，则只能获得订单额度的0.5%作为个人绩效奖励；一个普通员工如果能够拿到50万元以上的订单，则该员工获得订单额度的2%作为个人绩效奖励，如果没有达到这个目标，则该员工仅获得订单额度的1%作为个人绩效奖励。编制一个程序，使用键盘输入必要参数，计算出某公司员工的绩效。
```python
# by 张忆文（文忆天下）

position = input("输入职位，经理或普通员工:")
order = eval(input("输入订单总额(单位：万元)："))

if position == "经理":
    if order > 500:
        bonus = order * 0.01
    else:
        bonus = order * 0.005
else:
    if order > 50:
        bonus = order * 0.02
    else:
        bonus = order * 0.01

print("该员工的职位为{}，绩效奖金为{}万元".format(position, bonus))
```

-----
15. 随机生成一个取值范围介于[0, 51]的整数，用以模拟从52张扑克牌中随机抽取一张扑克牌的操作。在本程序中，需要在用牌花色（黑桃、红心、梅花、方片）和牌面（“A”， “2”， “3”， “4”， “5”， “6”， “7”， “8”， “9”， “10”， “J”， “Q”， “K”）在控制台显示出随机抽到的牌。
```python
# by 张忆文（文忆天下）

import random

card = random.randint(0, 51)
message = "你抽到的牌是："

# suit 代表花色，黑桃(0)、红桃(1)、梅花(2)、方片(3)，输出花色
suit = card % 4
if suit == 0:
    message = message + "黑桃"
elif suit == 1:
    message = message + "红桃"
elif suit == 2:
    message = message + "梅花"
else:
    message = message + "方片"

# 接下来输出牌面
cardnumber = (card % 13 + 1)
if cardnumber == 1:
    message = message + "A"
elif cardnumber == 11:
    message = message + "J"
elif cardnumber == 12:
    message = message + "Q"
elif cardnumber == 13:
    message = message + "K"
else:
    message = message + str(cardnumber)

print(message)
```

```python
# by Kreee

import random
getRandom = random.randint(0, 51)

pokerList = []
for suit in ['黑桃', '红桃', '梅花', '方片']:
    for num in ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']:
        pokerList.append(suit + num)

print('你抽到的牌是：{}'.format(pokerList[getRandom]))
```

-----
16. 我国使用的是阶梯电价制度。按照用电的电量情况可以分为三个档次：   
第一档，电量每户每月210度及以下   
第二档，电量每户每月210-400度之间   
第三档，电量每户每月400度以上。   
一档、二档、三档就是根据不同用电量规定的电价，用电量大，电价就高，比如第一档电量每户每月执行电价，每度0.5469元，第二档电量每户每月在第一档电价基础上，每度加价0.05元，即每度0.5969元，第三档电量每户每月在第一档电价基础上，每度加价0.3元，即每度0.8469元。   
如：某用户一个月用电800度，则计算公式可以表达为：   
> 电费 = 第一档用电量（210度）* 第一档电价+第二档用电量（400 - 210度）* 第二档电价+第三档用电量（800 - 400度）* 第三档电价   

使用键盘输入某用户的一个月用电量，求该用户需要缴纳多少电费。   
```python
# by Kreee

getInput = eval(input('请输入这个月所用电度数：'))

if getInput <= 210:
    outMoney = getInput * 0.5469
elif 210 < getInput <= 400:
    outMoney = 210 * 0.5469 + (getInput - 210) * 0.5969
elif 400 < getInput:
    outMoney = 210 * 0.5469 + (400 - 210) * 0.5969 + (getInput - 400) * 0.8469

print('这个月的电费为：{}'.format(outMoney))
```

-----
17. 输出100以内所有7的倍数。
```python
# by Kreee

outNum = 7
i = 1
while outNum < 100:
    print(outNum, end=' ')
    i = i + 1
    outNum = 7 * i
```

-----
18. 输出以下由“*”组成的图形:   

（1）
```
*
**
***
****
*****
```
（2）
```
    *
   **
  ***
 ****
*****
```
（3）
```
    *
   ***
  *****
 *******
*********
```
     
```python
# by Kreee
# ps：想改又不愿意改，累了，就这样

print('（1）')
for i in range(1, 6):
    printLine = '*' * i
    print(printLine)

print('（2）')
for j in range(1, 6):
    printLine = ' ' * (5 - j) + '*' * j
    print(printLine)

print('（3）')
for k in range(1, 6):
    printLine = ' ' * (5 - k) + '*' * (2 * k - 1)
    print(printLine)
```

-----
19. 使用键盘输入10个数，求这10个数的平均数。
```python
# by 张忆文（文忆天下）

number = 10
count, sum = 0, 0

while count < number:
    num = eval(input("输入一个数: "))
    sum += num
    count += 1

print("十个数的平均数是：" + str(sum / number))
```

```python
# by Kreee

def CalAverage(Inputnum):
    getResult = 0.0
    for i in Inputnum:
        getResult = getResult + i
    return getResult / len(Inputnum)


print(CalAverage(eval(input('输入一组数，用逗号隔开：'))))
```

-----
20. （1）假设某门面出租，在租赁合同中规定的首年租金为100000块，租金每年涨5%。在控制台打印出10年时间，每一年租金会分别涨到多少钱？   
（2） 如果某打工人想租下了该店面，花费了30万进行装修，开始通过销售服装获取收入。第一个月刨除房租、水电、人工开销，能有收入5000块。生意越来越好做，假设能够勉强维持每月收入7%递增，那需要多久的辛勤劳动，就能收回成本？   
本题中，所有金额保留两位小数。   
```python
# by 张忆文（文忆天下）

rental, year = 100000, 1
income, month, deposit = 10000, 1, 300000

while year <= 10:
    print("第{}年的租金为￥{:.2f}".format(year, rental))
    rental *= 1.05
    year += 1

while deposit > 0:
    deposit = deposit - income
    month += 1
    income *= 1.07

print("第{}月后能够收回投资".format(month))
```

```python
# by Kreee

# 计算门面租金
for i in range(0, 10):
    rent = 100000.00 * pow(1.05, i)
    print('第{}年的租金为：{:.2f}'.format(i + 1, rent))

# 计算劳动月数
getMonth = 0
addMoney = 0
while addMoney < 300000:
    addMoney = addMoney + 10000 * pow(1.07, getMonth)
    getMonth = getMonth + 1
print('第{}个月能够收回投资。'.format(getMonth + 1))
```

-----
21. 输出以下由数字组成的图形:   

（1）
```
1
12
123
1234
12345
123456
```
（2）
```
654321
 54321
  4321
   321
    21
     1
```
（3）
```
     1
    12
   123
 12345
123456
```

```python
# by Kreee
print('（1）')
result1 = ''
for i in range(1, 7):
    for num in range(1, i + 1):
        if num == i:
            result1 = result1 + str(num) + '\n'
        else:
            result1 = result1 + str(num)
print(result1)

# 方法很屎，没力气想其他更好的方法了，就这样
print('（2）')
result2 = ''
for j in range(6, 0, -1):
    result2 = result2 + ' ' * (6 - j)
    for num in range(j, 0, -1):
        if num == 1:
            result2 = result2 + str(num) + '\n'
        else:
            result2 = result2 + str(num)
print(result2)

print('（3）')
result3 = ''
for k in range(1, 7):
    result3 = result3 + ' ' * (6 - k)
    for num in range(1, k + 1):
        if num == k:
            result3 = result3 + str(num) + '\n'
        else:
            result3 = result3 + str(num)
print(result3)
```

-----
22. 使用键盘输入一个年份，并在控制台输出这一年，每个月1日是星期几。
```python
# by Kreee

def zeller(year, month, date):
    if month <= 2:
        month = month + 12
        year = year - 1
    week = (date + 26 * (month + 1) // 10 + year % 100 + year % 100 // 4 + year // 100 // 4 + year // 100 * 5 - 1) % 7
    if week == 1:
        weekDay = "星期一"
    elif week == 2:
        weekDay = "星期二"
    elif week == 3:
        weekDay = "星期三"
    elif week == 4:
        weekDay = "星期四"
    elif week == 5:
        weekDay = "星期五"
    elif week == 6:
        weekDay = "星期六"
    elif week == 0:
        weekDay = "星期日"
    return weekDay


getYear = int(input('请输入一个年份：'))
for i in range(1, 13):
    outWeek = zeller(getYear, i, 1)
    print('{} 年的 {} 月 1 日是{}'.format(getYear, i, outWeek))
```

-----
23. 写一个程序，键盘输入一个十进制数，将十进制数转换为二进制数，输出到控制台。
```python
# by Kreee

getInput = eval(input('请输入需要转换为二进制的整数：'))
outBinary = ''

if getInput == 0:
    outBinary = '0'
else:
    divResult = getInput
    while divResult != 1:
        if divResult % 2 == 0:
            outBinary = '0' + outBinary
            divResult = divResult / 2
            continue
        else:
            outBinary = '1' + outBinary
            divResult = divResult // 2
            continue
    outBinary = '1' + outBinary

print(outBinary)
```

-----
24. 如果一个正整数等于除了他本身之外的所有正因子的和，那么这个数被称为是完全数。如：6 = 3 * 2 * 1 = 3 + 2 + 1，因此6是一个完全数。求10000以内所有的完全数。
```python
# by 张忆文（文忆天下）

for i in range(1, 10000):
    sum = 0
    for j in range(1, i // 2 + 1):
        if i % j == 0:
            sum = sum + j
    if sum == i:
        print(i, end=" ")
```

```python
# by Kreee

perfectNum = []
getInput = 10000

for num in range(1, getInput + 1):
    divisor = []
    for i in range(1, num):
        if (num / i) % 1 == 0:
            divisor.append(i)
    addDivisor = 0
    for j in divisor:
        addDivisor = addDivisor + j
    if addDivisor == num:
        perfectNum.append(num)

for k in perfectNum:
    print(k, end=" ")
```

-----
25. 定义一个名为 `isLeapYear(year)` 的函数，参数为一个年份，如果该年份是闰年，则返回值为True，否则，返回值为False。在同一源文件中，使用键盘输入年份，验证该函数是否能够正确返回该年份是否为闰年。
```python
# by 张忆文（文忆天下）

def isLeapYear(year):
    if year % 4 == 0 and year % 100 != 0 or year % 400 == 0:
        return True
    else:
        return False


year = int(input("输入一个年份："))
print(isLeapYear(year))
```

-----
26. 定义一个名为 `zeller(year, month, date)` 的函数，参数为年、月、日。通过这个函数计算并返回该日期是星期几。在同一源程序中，使用键盘输入年、月、日，验证该函数是否能正确计算出输入的日期为星期几。
```python
# by 张忆文（文忆天下）

def zeller(year, month, date):
    if month <= 2:
        month += 12
        year -= 1
    weekDay = (date + 26 * (month + 1) // 10 + year % 100 + year % 100 // 4 + year // 100 // 4 + year // 100 * 5 - 1) % 7
    return weekDay


year, month, date = eval(input("一次输入年，月，日："))
weekDay = zeller(year, month, date)
print(weekDay)
```

-----
27. 定义一个名为 `isPrime(number)` 的函数，参数为一个正整数。通过使用这个函数，能够判断一个正整数，是否为素数，是素数则返回True，不是素数则返回False。在同一源程序中，使用键盘输入一个正整数，验证该函数是否能够正确判断输入数为素数。
```python
# by Kreee

def isPrime(number):
	# 质数判断方法见下一题。
    for factor in range(2, number // 2 + 1):
        if number % factor == 0:
            return False
        else:
            return True


getInput = int(input('请输入一个正整数：'))
ifPrime = isPrime(getInput)
if ifPrime:
    print('正整数 {} 是质数。'.format(getInput))
else:
    print('正整数 {} 不是质数。'.format(getInput))
```

-----
28. 定义一个名为 `primeNumbers(number)` 的函数，参数为一个正整数。通过使用这个函数，能够输出小于number的所有素数，输出的时候，每行10个素数。在同一源文件中，使用键盘输入一个正整数，验证该函数的输出结果。
```python
# by 张忆文（文忆天下）

def primeNumbers(number):
    message = str(number) + "以内的质数有：\n"
    count = 0
    # 外层循环，从2开始，到number结束
    for num in range(2, number):
        # 使用一个标志，这个标志为True，假设number是质数
        flag = True
        # 内层循环从2开始，到num//2结束，寻找有没有num的因数
        for factor in range(2, num // 2 + 1):
            # 如果num可以被2到num//2之间的某个自然数整除
            if num % factor == 0:
                # 将标志设为False，意义为：number不是质数
                flag = False
        # 如果内层循环结束后，没有找到任何因数，标志保持True状态
        # 说明num的确是一个质数
        if flag:
            count = count + 1
            # 将这个质数记录到message中。
            if count % 10 == 0:
                message = message + str(num) + "\n"
            else:
                message = message + str(num) + "\t"
    print(message)


number = int(input("请输入一个正整数："))
primeNumbers(number)
```

-----
### 客官，都看到最后了，何不来一张福瑞图呢👍 （误）   
![](/images/python-questions-bonus.jpg)
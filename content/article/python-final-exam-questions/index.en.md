---
title: "Python Final Exam Programming Questions"
date: 2021-06-04T14:24:37+08:00
draft: false
categories: ['Study']
tags: ['Python', 'Study', '2021']
summary: "(It is said that) the programming questions for the Python final exam will be drawn from here. Some of the questions without answers were written temporarily. If they are poorly written, please feel free to give feedback. May there be no one who fails the exam in the world."
---

{{< alert icon="language">}}
The English version is translated by AI (Gemini 2.5 Pro Preview). If you want to view the original content, please switch to Chinese version.
{{< /alert >}}

---

(It is said that) the programming questions for the Python final exam will be drawn from here.
Some of the questions without answers were written temporarily. If they are poorly written, please feel free to give feedback.
May there be no one who fails the exam in the world.

1. Enter three values from the keyboard, assign them to num1, num2, and num3 respectively, and find their average.
```python
# by Kreee

num1 = eval(input('Please enter the first number:'))
num2 = eval(input('Please enter the second number:'))
num3 = eval(input('Please enter the third number:'))

averNum = (num1 + num2 + num3) / 3
print('The average of these three numbers is: {}'.format(averNum))
```

-----
2. Enter a three-digit number and output its reverse. For example, if you enter 123, the output is 321.
```python
# by Kreee

getInput = int(input('Please enter a three-digit integer:'))

numBit1 = getInput % 10
numBit2 = getInput // 10 % 10
numBit3 = getInput // 100 % 10
outNum = str(numBit1) + str(numBit2) + str(numBit3)

print('The reverse of the three-digit number is: {}'.format(outNum))
```

-----
3. Enter a Fahrenheit temperature and output the corresponding Celsius temperature.
```python
# by Kreee

TempStr = input('Please enter Fahrenheit temperature:')
if TempStr[-1] in ['F', 'f', '℉']:
    C = (eval(TempStr[0: -1]) - 32) / 1.8
    print('The converted temperature is {:.2f}℃'.format(C))
else:
    C = (eval(TempStr) - 32) / 1.8
    print('The converted temperature is {:.2f}℃'.format(C))
```

-----
4. Use the keyboard to enter a Unicode character and display the Unicode encoding value corresponding to this character.
```python
# by Kreee

getInput = input('Please enter a character:')
outOrd = ord(getInput)
print('The Unicode encoding value of the character {} is: {}'.format(getInput, outOrd))
```

-----
5. In cryptography, the Caesar cipher, also known as Caesar encryption, Caesar transformation, or transformation encryption, is one of the simplest and most widely known encryption techniques. It is a substitution cipher technique in which all letters in the plaintext are replaced with ciphertext after being shifted backward (or forward) by a fixed number in the alphabet. For example, when the offset is 3, all letters A will be replaced with D, B will become E, and so on. This encryption method is named after Caesar in the Roman Republic period. Caesar used this method to communicate with his generals. Please use the keyboard to enter the offset and use the offset to encrypt a single uppercase English letter entered from the keyboard. For example, if the offset is 3 and the input English letter is Z, the output is C.
```python
# by Zhang Yiwen (Wen Yi Tian Xia)

offset = int(input("Enter the offset:"))
inputChar = input("Enter a single uppercase English letter:")
outputCharValue = (ord(inputChar) - ord("A") + offset) % 26
outputChar = chr(ord("A") + outputCharValue)
print("After Caesar encryption, the output character is:" + outputChar)
```
```python
# by Kreee

getShift = input('Please enter the offset (integer):')
getInput = input('Please enter the content to be encrypted (a single English letter):')

# Check user input
if getShift.isdigit() == False:
    print('Input does not meet the specification: the offset is not an integer!')
    exit(1)
if len(getInput) != 1:
    print('Input does not meet the specification: a single character was not entered!')
    exit(1)

# Calculate the password
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
    print('Input does not meet the specification: not an English letter!')
    exit(1)
print('The converted character is: {}'.format(outChr))
```

-----
6. Use the `random.randint(a, b)` method to randomly generate three natural numbers within 100, and find the sum of the three numbers.
```python
# by Kreee

import random

num1 = random.randint(0, 100)
num2 = random.randint(0, 100)
num3 = random.randint(0, 100)
averNum = (num1 + num2 + num3) / 3

print('The three randomly generated numbers are {}, {}, {}, and their average is {}'.format(num1, num2, num3, averNum))
```

-----
7. Use the `round(x, y)` function to keep y decimal places for the floating-point number x. Use the keyboard to enter two non-zero numbers, find the quotient of these two numbers, and keep the result to two decimal places. When outputting, please note that "➗" (decimal Unicode encoding: 10135) is used as a connector to represent the division sign.
```python
# by Kreee

num1 = eval(input("Please enter the first number:"))
num2 = eval(input("Please enter the second number:"))

outNum = round(num1 / num2, 2)

print(str(num1) + chr(10135) + str(num2) + '=' + str(outNum))
```

-----
8. The `time.time()` method can get the current time point, how many seconds have passed since 0:00:00 on January 1, 1970. It is known that January 1, 1970 was a Thursday. Use a computer to calculate:
(1) How many days have passed since January 1, 1970?
(2) What day of the week is it today?
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

print('{} days have passed since January 1, 1970, and today is {}'.format(dayPassed, currWeek))
```

-----
9. When solving a quadratic equation ax** 2 + bx + c = 0, there are three possible situations:
1. Two unequal real roots
2. Two equal real roots
3. No real roots.
Please use the keyboard to enter the values of a, b, and c, and output the solution of the quadratic equation.
```python
# by Zhang Yiwen (Wen Yi Tian Xia)

a, b, c = eval(input("Enter the values of a, b, and c of the quadratic equation, separated by commas:"))
if a == 0:
    if b == 0:
        if c == 0:
            print("This equation has any solution")
        else:
            print("This equation has no solution")
    else:
        print("This equation has a unique solution and the solution is x1={}".format(-c/b))
else:
    delta = b ** 2 - 4 * a * c
    if delta < 0:
        print("The equation ax**2+bx+c=0 has no real solution")
    elif delta == 0:
        root = (-b) / (2 * a)
        print("The equation ax**2+bx+c=0 has two equal roots, and its value is x1=x2={:.2f}".format(root))
    else:
        root1 = ((-b) + delta ** 0.5) / (2 * a)
        root2 = ((-b) - delta ** 0.5) / (2 * a)
        print("The equation ax**2+bx+c=0 has two different roots: x1 = {:.2f}, and its value is x2={:.2f}".format(root1, root2))
```

-----
10. The relationship between the value of the air pollution index api and the corresponding air quality is as follows: 0-50 is excellent, 51-99 is good, 100-199 is light pollution, 200-299 is moderate pollution, and above 300 is heavy pollution. Please write a program to enter the api value from the keyboard and output the air quality corresponding to the api value.
```python
# by Kreee

getApiNum = int(input('Please enter the air pollution index:'))

if getApiNum <= 50:
    outResult = 'Excellent'
elif 51 <= getApiNum <= 99:
    outResult = 'Good'
elif 100 <= getApiNum <= 199:
    outResult = 'Light pollution'
elif 200 <= getApiNum <= 299:
    outResult = 'Moderate pollution'
elif 300 <= getApiNum:
    outResult = 'Heavy pollution'

print('The air quality is: {}'.format(outResult))
```

-----
11. Zeller's formula is a formula for calculating the day of the week. Given any date, you can use this formula to calculate the day of the week. Zeller's formula is:
> w = (y + [y / 4] + [c / 4] - 2c + [26(m + 1) / 10] + d - 1) % 7

where:
w: represents the day of the week; w modulo 7 gives: 0-Sunday, 1-Monday, 2-Tuesday, 3-Wednesday, 4-Thursday, 5-Friday, 6-Saturday
c: century number (note: in general, the value in the formula is the number of centuries that have passed, that is, the result of dividing the year by one hundred, c should be equal to the number of the century, such as in 2021 AD, c is equal to 20)
y: the year of the century (usually the last two digits of the year, such as in 2021 AD, y is equal to 21)
m: month (m is greater than or equal to 3 and less than or equal to 14, that is, in Zeller's formula, January and February of a certain year should be calculated as the 13th and 14th months of the previous year, for example, January 1, 2003 should be calculated as the 13th month and 1st day of 2002)
d: day
[ ] represents taking the integer part, that is, only the integer part.
Please use a computer to write a program, enter the year, month, and day, and output the corresponding day of the week.
```python
# by Zhang Yiwen (Wen Yi Tian Xia)

year = int(input("Enter the year:"))
month = int(input("Enter the month:"))
day = int(input("Enter the day:"))
m = month

if month < 3:
    m = month + 12
    year = year - 1

c = year // 100
y = year % 100
d = day
w = (y + (y // 4) + (c // 4) - 2 * c + (26 * (m + 1) // 10) + d - 1) % 7

if(w == 1):
    message = "Monday"
elif (w == 2):
    message = "Tuesday"
elif (w == 3):
    message = "Wednesday"
elif (w == 4):
    message = "Thursday"
elif (w == 5):
    message = "Friday"
elif (w == 6):
    message = "Saturday"
else:
    message = "Sunday"
print("Enter {} year {} month {} day, output {}".format(year, month, day, message))
```

-----
12. Enter the center coordinates of two circles and the corresponding radii of these two circles, and find the relationship between these two circles, whether it is contained, internally tangent, intersecting, externally tangent, or separated?
```python
# by Zhang Yiwen (Wen Yi Tian Xia)

x1, y1 = eval(input("Enter the center coordinates of a circle:"))
r1 = eval(input("Enter the radius of the circle:"))
x2, y2 = eval(input("Enter the center coordinates of another circle:"))
r2 = eval(input("Enter the radius of the circle:"))

# distance represents the distance between the centers of the two circles
distance = ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5

# Judge the relationship of the circles
if distance < abs(r1 - r2):
    print("The relationship between these two circles is: contained")
elif distance == abs(r1 - r2):
    print("The relationship between these two circles is: internally tangent")
elif distance < r1 + r2:
    print("The relationship between these two circles is: intersecting")
elif distance == r1 + r2:
    print("The relationship between these two circles is: externally tangent")
else:
    print("The relationship between these two circles is: separated")
```

-----
13. Scissors, rock, paper is a game of finger-guessing. Scissors beats paper, paper beats rock, rock beats scissors. Assuming that three integers 0, 1, and 2 are used to represent rock, scissors, and paper respectively, the computer randomly generates one of the three integers (0, 1, 2), and the user enters one of the integers (0, 1, 2) from the keyboard. The program determines whether the computer wins, the user wins, or it is a tie.
```python
# by Zhang Yiwen (Wen Yi Tian Xia)

import random

computer = random.randint(0,2)
you = int(input("Rock(0), Scissors(1), Paper(2):"))
message = "The computer played: "

if computer == 0:
    message = message + "Rock(0), you played: "
    if you == 0:
        message = message + "Rock(0), it's a tie!"
    elif you == 1:
        message = message + "Scissors(1), you lose!"
    else:
        message = message + "Paper(2), you win!"
elif computer == 1:
    message = message + "Scissors(1), you played: "
    if you == 0:
        message = message + "Rock(0), you win!"
    elif you == 1:
        message = message + "Scissors(1), it's a tie!"
    else:
        message = message + "Paper(2), you lose!"
else:
    message = message + "Paper(2), you played: "
    if you == 0:
        message = message + "Rock(0), you lose!"
    elif you == 1:
        message = message + "Scissors(1), you win!!"
    else:
        message = message + "Paper(2), it's a tie!"

print(message)
```
```python
# by Kreee

import random

getInput = int(input('Finger-guessing game: Rock (integer 0) Scissors (integer 1) Paper (integer 2):'))
getRandom = random.randint(0, 2)
flag = ''
outUser = ''
outCom = ''

if getInput == 0:
    outUser = 'Rock(0)'
    if getRandom == 0:
        outCom = 'Rock(0)'
        flag = 'tie'
    elif getRandom == 1:
        outCom = 'Scissors(1)'
        flag = 'user'
    elif getRandom == 2:
        outCom = 'Paper(2)'
        flag = 'com'
elif getInput == 1:
    outUser = 'Scissors(1)'
    if getRandom == 0:
        outCom = 'Rock(0)'
        flag = 'com'
    elif getRandom == 1:
        outCom = 'Scissors(1)'
        flag = 'tie'
    elif getRandom == 2:
        outCom = 'Paper(2)'
        flag = 'user'
elif getInput == 2:
    outUser = 'Paper(3)'
    if getRandom == 0:
        outCom = 'Rock(0)'
        flag = 'user'
    elif getRandom == 1:
        outCom = 'Scissors(1)'
        flag = 'com'
    elif getRandom == 2:
        outCom = 'Paper(2)'
        flag = 'tie'
else:
    print('Illegal input!')

if flag == 'user':
    print('The computer played: {}, you played: {}, you win!'.format(outCom, outUser))
elif flag == 'com':
    print('The computer played: {}, you played: {}, you lose!'.format(outCom, outUser))
elif flag == 'tie':
    print('The computer played: {}, you played: {}, it's a tie!'.format(outCom, outUser))
```

-----
14. When a company distributes performance, it needs to compile a computer program to help calculate bonuses. Assuming that a department manager's entire department has received orders of more than 5 million yuan, the department manager will receive 1% of the total order amount as a personal performance bonus. If this amount is not reached, he can only receive 0.5% of the order amount as a personal performance bonus; if an ordinary employee can get an order of more than 500,000 yuan, the employee will receive 2% of the order amount as a personal performance bonus. If this goal is not reached, the employee will only receive 1% of the order amount as a personal performance bonus. Write a program to enter the necessary parameters from the keyboard to calculate the performance of a company's employees.
```python
# by Zhang Yiwen (Wen Yi Tian Xia)

position = input("Enter the position, manager or ordinary employee:")
order = eval(input("Enter the total order amount (unit: 10,000 yuan):"))

if position == "manager":
    if order > 500:
        bonus = order * 0.01
    else:
        bonus = order * 0.005
else:
    if order > 50:
        bonus = order * 0.02
    else:
        bonus = order * 0.01

print("The employee's position is {}, and the performance bonus is {} ten thousand yuan".format(position, bonus))
```

-----
15. Randomly generate an integer in the range [0, 51] to simulate the operation of randomly drawing a card from 52 playing cards. In this program, you need to display the randomly drawn card on the console with the suit (spades, hearts, clubs, diamonds) and face ("A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K").
```python
# by Zhang Yiwen (Wen Yi Tian Xia)

import random

card = random.randint(0, 51)
message = "The card you drew is: "

# suit represents the suit, spades(0), hearts(1), clubs(2), diamonds(3), output the suit
suit = card % 4
if suit == 0:
    message = message + "Spades"
elif suit == 1:
    message = message + "Hearts"
elif suit == 2:
    message = message + "Clubs"
else:
    message = message + "Diamonds"

# Next, output the face of the card
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
for suit in ['Spades', 'Hearts', 'Clubs', 'Diamonds']:
    for num in ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']:
        pokerList.append(suit + num)

print('The card you drew is: {}'.format(pokerList[getRandom]))
```

-----
16. Our country uses a tiered electricity price system. According to the amount of electricity used, it can be divided into three tiers:
The first tier, the electricity consumption is 210 kWh or less per household per month.
The second tier, the electricity consumption is between 210-400 kWh per household per month.
The third tier, the electricity consumption is more than 400 kWh per household per month.
The first, second, and third tiers are the electricity prices stipulated according to different electricity consumption. The larger the electricity consumption, the higher the electricity price. For example, the electricity price for the first tier is 0.5469 yuan per kWh. The electricity price for the second tier is 0.05 yuan per kWh higher than the first tier, which is 0.5969 yuan per kWh. The electricity price for the third tier is 0.3 yuan per kWh higher than the first tier, which is 0.8469 yuan per kWh.
For example, if a user consumes 800 kWh of electricity in a month, the calculation formula can be expressed as:
> Electricity bill = first-tier electricity consumption (210 kWh) * first-tier electricity price + second-tier electricity consumption (400 - 210 kWh) * second-tier electricity price + third-tier electricity consumption (800 - 400 kWh) * third-tier electricity price

Use the keyboard to enter a user's monthly electricity consumption, and find out how much electricity bill the user needs to pay.
```python
# by Kreee

getInput = eval(input('Please enter the electricity consumption for this month:'))

if getInput <= 210:
    outMoney = getInput * 0.5469
elif 210 < getInput <= 400:
    outMoney = 210 * 0.5469 + (getInput - 210) * 0.5969
elif 400 < getInput:
    outMoney = 210 * 0.5469 + (400 - 210) * 0.5969 + (getInput - 400) * 0.8469

print('The electricity bill for this month is: {}'.format(outMoney))
```

-----
17. Output all multiples of 7 within 100.
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
18. Output the following graphics composed of "*":

(1)
```
*
**
***
****
*****
```
(2)
```
    *
   **
  ***
 ****
*****
```
(3)
```
    *
   ***
  *****
 *******
*********
```

```python
# by Kreee
# ps: I want to change it but I don't want to change it, I'm tired, so be it

print('(1)')
for i in range(1, 6):
    printLine = '*' * i
    print(printLine)

print('(2)')
for j in range(1, 6):
    printLine = ' ' * (5 - j) + '*' * j
    print(printLine)

print('(3)')
for k in range(1, 6):
    printLine = ' ' * (5 - k) + '*' * (2 * k - 1)
    print(printLine)
```

-----
19. Use the keyboard to enter 10 numbers and find the average of these 10 numbers.
```python
# by Zhang Yiwen (Wen Yi Tian Xia)

number = 10
count, sum = 0, 0

while count < number:
    num = eval(input("Enter a number: "))
    sum += num
    count += 1

print("The average of the ten numbers is: " + str(sum / number))
```

```python
# by Kreee

def CalAverage(Inputnum):
    getResult = 0.0
    for i in Inputnum:
        getResult = getResult + i
    return getResult / len(Inputnum)


print(CalAverage(eval(input('Enter a set of numbers, separated by commas:'))))
```

-----
20. (1) Assuming that a storefront is for rent, the rent for the first year stipulated in the lease contract is 100,000 yuan, and the rent increases by 5% every year. Print out on the console how much the rent will increase to each year for 10 years?
(2) If a worker wants to rent the store, he spends 300,000 yuan on decoration and starts to earn income by selling clothes. In the first month, after deducting rent, water and electricity, and labor costs, he can have an income of 5,000 yuan. The business is getting better and better. Assuming that the monthly income can barely maintain a 7% increase, how long will it take to work hard to recover the cost?
In this question, all amounts are reserved to two decimal places.
```python
# by Zhang Yiwen (Wen Yi Tian Xia)

rental, year = 100000, 1
income, month, deposit = 10000, 1, 300000

while year <= 10:
    print("The rent for the {}th year is ￥{:.2f}".format(year, rental))
    rental *= 1.05
    year += 1

while deposit > 0:
    deposit = deposit - income
    month += 1
    income *= 1.07

print("The investment can be recovered after the {}th month".format(month))
```

```python
# by Kreee

# Calculate the storefront rent
for i in range(0, 10):
    rent = 100000.00 * pow(1.05, i)
    print('The rent for the {}th year is: {:.2f}'.format(i + 1, rent))

# Calculate the number of working months
getMonth = 0
addMoney = 0
while addMoney < 300000:
    addMoney = addMoney + 10000 * pow(1.07, getMonth)
    getMonth = getMonth + 1
print('The investment can be recovered in the {}th month.'.format(getMonth + 1))
```

-----
21. Output the following graphics composed of numbers:

(1)
```
1
12
123
1234
12345
123456
```
(2)
```
654321
 54321
  4321
   321
    21
     1
```
(3)
```
     1
    12
   123
 12345
123456
```

```python
# by Kreee
print('(1)')
result1 = ''
for i in range(1, 7):
    for num in range(1, i + 1):
        if num == i:
            result1 = result1 + str(num) + '\n'
        else:
            result1 = result1 + str(num)
print(result1)

# The method is very bad, I don't have the energy to think of other better methods, so be it
print('(2)')
result2 = ''
for j in range(6, 0, -1):
    result2 = result2 + ' ' * (6 - j)
    for num in range(j, 0, -1):
        if num == 1:
            result2 = result2 + str(num) + '\n'
        else:
            result2 = result2 + str(num)
print(result2)

print('(3)')
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
22. Use the keyboard to enter a year, and output on the console what day of the week the 1st of each month of this year is.
```python
# by Kreee

def zeller(year, month, date):
    if month <= 2:
        month = month + 12
        year = year - 1
    week = (date + 26 * (month + 1) // 10 + year % 100 + year % 100 // 4 + year // 100 // 4 + year // 100 * 5 - 1) % 7
    if week == 1:
        weekDay = "Monday"
    elif week == 2:
        weekDay = "Tuesday"
    elif week == 3:
        weekDay = "Wednesday"
    elif week == 4:
        weekDay = "Thursday"
    elif week == 5:
        weekDay = "Friday"
    elif week == 6:
        weekDay = "Saturday"
    elif week == 0:
        weekDay = "Sunday"
    return weekDay


getYear = int(input('Please enter a year:'))
for i in range(1, 13):
    outWeek = zeller(getYear, i, 1)
    print('The 1st of {} in {} is {}'.format(i, getYear, outWeek))
```

-----
23. Write a program to enter a decimal number from the keyboard, convert the decimal number to a binary number, and output it to the console.
```python
# by Kreee

getInput = eval(input('Please enter an integer to be converted to binary:'))
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
24. If a positive integer is equal to the sum of all its positive divisors except itself, then this number is called a perfect number. For example: 6 = 3 * 2 * 1 = 3 + 2 + 1, so 6 is a perfect number. Find all perfect numbers within 10000.
```python
# by Zhang Yiwen (Wen Yi Tian Xia)

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
25. Define a function named `isLeapYear(year)` with a year as a parameter. If the year is a leap year, the return value is True, otherwise, the return value is False. In the same source file, use the keyboard to enter a year to verify whether the function can correctly return whether the year is a leap year.
```python
# by Zhang Yiwen (Wen Yi Tian Xia)

def isLeapYear(year):
    if year % 4 == 0 and year % 100 != 0 or year % 400 == 0:
        return True
    else:
        return False


year = int(input("Enter a year:"))
print(isLeapYear(year))
```

-----
26. Define a function named `zeller(year, month, date)` with year, month, and day as parameters. Use this function to calculate and return the day of the week for that date. In the same source program, use the keyboard to enter the year, month, and day to verify whether the function can correctly calculate the day of the week for the entered date.
```python
# by Zhang Yiwen (Wen Yi Tian Xia)

def zeller(year, month, date):
    if month <= 2:
        month += 12
        year -= 1
    weekDay = (date + 26 * (month + 1) // 10 + year % 100 + year % 100 // 4 + year // 100 // 4 + year // 100 * 5 - 1) % 7
    return weekDay


year, month, date = eval(input("Enter year, month, and day at once:"))
weekDay = zeller(year, month, date)
print(weekDay)
```

-----
27. Define a function named `isPrime(number)` with a positive integer as a parameter. Use this function to determine whether a positive integer is a prime number. If it is a prime number, it returns True, otherwise it returns False. In the same source program, use the keyboard to enter a positive integer to verify whether the function can correctly determine whether the input number is a prime number.
```python
# by Kreee

def isPrime(number):
	# See the next question for the prime number judgment method.
    for factor in range(2, number // 2 + 1):
        if number % factor == 0:
            return False
        else:
            return True


getInput = int(input('Please enter a positive integer:'))
ifPrime = isPrime(getInput)
if ifPrime:
    print('The positive integer {} is a prime number.'.format(getInput))
else:
    print('The positive integer {} is not a prime number.'.format(getInput))
```

-----
28. Define a function named `primeNumbers(number)` with a positive integer as a parameter. Use this function to output all prime numbers less than number, with 10 prime numbers per line. In the same source file, use the keyboard to enter a positive integer to verify the output result of the function.
```python
# by Zhang Yiwen (Wen Yi Tian Xia)

def primeNumbers(number):
    message = "The prime numbers within " + str(number) + " are:\n"
    count = 0
    # Outer loop, from 2 to number
    for num in range(2, number):
        # Use a flag, this flag is True, assuming number is a prime number
        flag = True
        # Inner loop from 2 to num//2, looking for factors of num
        for factor in range(2, num // 2 + 1):
            # If num can be divided by a natural number between 2 and num//2
            if num % factor == 0:
                # Set the flag to False, meaning: number is not a prime number
                flag = False
        # If the inner loop ends and no factors are found, the flag remains True
        # This means that num is indeed a prime number
        if flag:
            count = count + 1
            # Record this prime number in the message.
            if count % 10 == 0:
                message = message + str(num) + "\n"
            else:
                message = message + str(num) + "\t"
    print(message)


number = int(input("Please enter a positive integer:"))
primeNumbers(number)
```

-----
### Sir, you've seen it all, why not have a furry picture 👍 (mistake)
![](python-questions-bonus.jpg)

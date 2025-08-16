---
title: "wolf-bites-tweets 2.0.0 Development Notes"
date: 2021-10-27T22:59:38+08:00
draft: false
categories: ['Learning']
tags: ['JavaScript', 'Backend', 'GitHub', 'Learning', '2021']
summary: "Why rewrite and develop v2.0.0 when wolf-bites-tweets v1 already exists?"
---

{{< alert icon="language">}}
The English version is translated by AI (Gemini 2.5 Pro Preview). If you want to view the original content, please switch to Chinese version.
{{< /alert >}}

---

## The Root of All Evil
Continued from: [wolf-bites-tweets and wolf-chews-tweets Development Notes](/en/article/notes-of-developing-wbt-and-wct/)

Project address: [https://github.com/ohmykreee/wolf-bites-tweets](https://github.com/ohmykreee/wolf-bites-tweets)

Why rewrite and develop v2.0.0 when wolf-bites-tweets v1 already exists? There are two reasons:
1. To save the ten or so seconds spent on building the docker image, and the sense of security of running it directly. (?)
2. I'm new to JavaScript and want to experience the process of developing a backend with Node.js.

-----
## Set up a proxy
For reasons that everyone understands, the entire development needs to be done in a proxy environment.

But here's the problem: when I was writing in Python, I used a third-party library to execute the GET command, and I only needed to pass environment variables to set up the proxy. However, when developing a JavaScript actions package, there is a principle to try not to introduce third-party packages (the reason will be mentioned later), so the GET method can only be completed using the built-in library. As a result, when writing, I couldn't get the program to go through the locally established proxy from the code level: either `hostname not resolved` or `connect reject from 127.0.0.1:443`; I also tried to introduce a third-party library to solve it, but it was also unsuccessful.

Finally, I couldn't bear it anymore and used Clash's TAP mode:
[Clash TUN and TAP mode - EdNovas's small station](https://ednovas.xyz/2021/02/15/clashtun/) is very detailed, and with the [official documentation](https://docs.cfw.lbyczf.com/contents/tap.html), you can easily set up a global proxy. The general process is also mentioned here:
1. On the `General` page, next to `TAP Device`, click `Manage`, and then click `Install`;
2. On the `Settings` page, in the `Profile Mixin` section, next to `YAML`, click `Edit`, and copy the configuration file from the official documentation into it;
3. Go back to `General`, turn off `System Proxy`, and turn on `Mixin`.
If everything goes well, the network should show that it is connected to clash-tap.

-----
## `@actions/core` package
It is said to be the officially recommended toolkit, but after the entire project was developed, I only want to say one thing: **I am really speechless about it**.

First of all, the `core.setFailed()` method, judging from its name, should be a function that throws an error and ends the program at the same time, right? As a result, during local testing, I found that the program did not end as expected. I went to look at the source code, and **a big speechless event happened**: the entire `core.setFailed()` method is just one line of `core.error()` plus one line of setting the exit code to 1, and that's it. It doesn't involve exiting the program at all. Does that mean I have to manually `exit()` after using `core.setFailed()`? Then why don't I just use `core.error()` plus `exit(1)`, and I can also customize the exit code?

Secondly, all `core.notice()`, `core.warning()`, and `core.error()` methods will not output content to the debugging console during local testing, which makes local testing very painful. In the end, I developed a local-run function for local testing, and by the way, I also added a new function to the program.

Finally, **the most speechless event happened**. As an officially recommended toolkit, you should have installed it in the environment in advance, right? As a result, no. In addition, the actions package will not execute `npm install --production` before running, which means that either you don't introduce third-party packages, or you prepare the third-party packages in the node_modules folder in advance. The final solution was to add two lines to `.gitignore`:
```plaintext
/node_modules/*/
!/node_modules/@actions/
```
A reminder, the first line cannot be changed to `node_modules/`, otherwise the entire node_modules folder will not be tracked, and the second line of exclusion rules will naturally not take effect. Using the original line will track the node_modules folder while not tracking all the files (folders) under it, and the second line of rules will take effect.

(What's even more speechless is that because of the last big speechless event, my main branch has a string of dirty commits. And if you want to truly test the actions package, you must create a Release instead of testing it directly in the current project repository, so these dirty commits are inevitable, which is very annoying)

-----
## http GET
I directly used the implementation method here: [HTTP GET Request in Node.js Express - Stack Overflow](https://stackoverflow.com/questions/9577611/http-get-request-in-node-js-express)

In fact, it would have been fine to just copy and paste, but in JavaScript, operations that involve long-term occupation such as network and I/O are asynchronous by default. For a novice who has never been exposed to asynchrony, this is a more troublesome problem.

(I heard that the Axios library is very good, I will definitely try it next time)

-----
## Asynchronous! Asynchronous! Asynchronous!
I have long heard of the great name of asynchrony, and I heard that asynchrony is a killer for newbies. Today I finally saw its true face.

Asynchrony is a hurdle that must be overcome when writing JavaScript programs, because many methods are performed asynchronously. The most critical point of the asynchronous problem is **how to determine when an asynchronous method has finished running** and get the return value. There are two mainstream processing methods: the old-style callbacks method and the async/await method that was recently introduced:

### callbacks method
Reference document: [What are callbacks? - Node.js](https://nodejs.org/en/knowledge/getting-started/control-flow/what-are-callbacks/)
```javascript
function processData (callback) {
  fetchData(function (err, data) {
    if (err) {
      console.log("An error has occurred. Abort everything!");
      return callback(err);
    }
    data += 1;
    callback(data);
  });
}
```
In this example code, the `callback` variable and the function passed to the `fetchData()` method both use the callbacks method. The essence of understanding callbacks is to **pass a method as a variable to an asynchronous method**, and after the asynchronous method ends and gets the data, it is passed back to the method that was originally passed to it. It sounds very confusing, doesn't it? But if you really understand it, you will feel that this solution is wonderful:
```javascript
let data
processData(function beCalled (result) {
    data = result
})
console.log(data)
```
First, the `processData()` method is called in the above code, and the method named `beCalled()` (in actual application, it can be unnamed and directly omitted) and written with `data = result` is passed to `processData()`; `beCalled()` has a new name in `processData()`: `callback()`. After the operation is completed in `processData()` and the `callback()` method is called, the data in the variable `data` will be passed back to `beCalled()` and passed to the `result` variable of the `beCalled()` method. This completes a callback.

### async/await method
The async/await function was only recently introduced, and its purpose is to make you feel "at home" when writing asynchronous code.

First, declare `async` before the method where you want to use this function. **A method that has not declared async cannot use the await function**.

Then you can happily use `await`! The function of `await` is actually very simple: the Promise followed by `await` will only continue the program after it has finished running and returned a value, otherwise it will stop at that line of code:
```javascript
async function fun_with_async () {
    ...

    let a = await this_is_a_promise()

    ...
}
```
And Promise is a special method that will return the value obtained by the method and the running result. There are three running states: pending, fulfilled, and rejected. As for how to write a Promise, you can ~~just copy it from the documentation~~: [Promise - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

And the advanced usage of async/await and how to make the program run more efficiently can also be learned here: [Making asynchronous programming easier with async and await - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await)

In summary, it can be seen that `return` is rarely used when writing some complex methods in JavaScript programming, and callbacks are used more often (after all, asynchrony is a good thing, but it is a bit troublesome to handle). In actual application, you can also consider using the callbacks method and the async/await method at the same time (for example, me, I would like to call it putting all my life's learning into it (mistake)).

-----
## Set environment variables
It is mainly used for debugging. If it is used in the local-run function, it is a bit more troublesome than passing parameters directly.

The method for GitHub actions to convert input into environment variables (directly cut from the source code): `INPUT_${name.replace(/ /g, '_').toUpperCase()}`

For example, `bearer-token` will be converted to `INPUT_BEARER-TOKEN`.

-----
## Get the passed parameters
[How to parse command line arguments - Node.js](https://nodejs.org/en/knowledge/command-line/how-to-parse-command-line-arguments/)

I think the original document has already explained it very clearly, so I will just briefly mention it here:
1. `process.argv` will directly return an array composed of the parameters that follow;
2. The third-party package yargs can greatly simplify this step.

-----
## A little trick for string concatenation
After being enclosed in backticks, use `${variable name}` to replace the variable value, and spaces will be preserved.

It is very similar to the `format()` method in Python. Mom no longer has to worry about me painfully connecting strings with plus signs.

-----
## for in and for of
`for in` is for objects;
`for of` is for arrays.

If you use it incorrectly, it will not be executed directly.

-----
## Write to file
[How do I write files in Node.js? - Node.js](https://nodejs.org/en/knowledge/file-system/how-to-write-files-in-nodejs/)

The original document has also been explained in great detail. It's just that you need to pay a little attention to asynchrony. If you have understood asynchrony before, there is not much pressure to read this document.

-----
## ~~The party concerned~~ speaks
From the beginning of the project on October 13th to the launch of wolf-bites-tweets v2.0.0 on November 2nd, which marked the official end of the project, it took more than 20 days. 20 days is not long or short. Although the pressure from my studies and the tasks arranged by the department during these days did not give me a lot of time to do this project, and I encountered many difficulties and troubles when writing this project, I still enjoyed the whole process.

I don't know why, but I still like the process of solving problems: from using search engines to find information, to finding the cause of a bug, to thinking of a solution that suits me based on existing information and other people's solutions. This process is indeed very tiring, and outsiders may think that I am doing some "useless things", but who knows? Or is it because I am "working hard" to realize a small need of my own, and I am really doing something for myself, not for others or for a living. Isn't this a kind of fun?

It is indeed a challenge to go from getting started with JavaScript to writing a simple project in 20 days. I also admit that there are many imperfections in the project I wrote, and I have a lot to learn. The journey of learning is still long, and I encourage you to do the same.

> In the end, it's still Python that loves me.
> -- Kreee

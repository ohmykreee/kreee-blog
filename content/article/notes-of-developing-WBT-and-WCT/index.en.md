---
title: "wolf-bites-tweets and wolf-chews-tweets Development Notes"
date: 2021-10-19T12:29:53+08:00
draft: false
categories: ['Learning']
tags: ['Python', 'JavaScript', 'Frontend', 'GitHub', 'Learning', '2021']
summary: "Also known as: How to make GitHub servers bald."
---

{{< alert icon="language">}}
The English version is translated by AI (Gemini 2.5 Pro Preview). If you want to view the original content, please switch to Chinese version.
{{< /alert >}}

---

~~Also known as: How to make GitHub servers bald~~

## The Root of All Evil
It all started back then: ~~on a dark and stormy night~~, when I was translating the 404 page of my blog, looking at the empty page, a thought suddenly came to my mind: wouldn't it be nice if there was a small widget here that randomly displayed the tweets I liked (and by the way, showed my strange xp).

So I started digging. To achieve this small function, I plan to make two projects: wolf-bites-tweets and wolf-chews-tweets (don't ask me how I came up with this name). The former is to use the ~~free~~ GitHub action server to get my Twitter like list every week through the official Twitter API (and also do the function of getting the tweet list, in case I also produce content in the future), and I plan to implement it with Python, which I am most familiar with; the latter is to use the data obtained by the former to display randomly selected tweets on the webpage.

Since this is my first time involved in front-end development, and I have not been involved in JavaScript before, the most important and difficult part of this journey is the wolf-chews-tweets project, and this blog post is mainly about this front-end project. How should I put it, I have to fill the pit I dug myself, crying, right 😂?

-----
## Foreword
> It is a bad habit to declare variables without type annotations.
> -- An unknown polemicist

> Oh no, what if I get used to it?
> -- A painful beginner

### 1. Please double check before opening a PR!!
Yes, a very painful lesson, a very, very painful lesson.

When the wolf-bites-tweets project came to 1.0.5, I opened a PR from main <-- dev-1.0.5. It was very fast, and I merged it immediately after opening it. After everything was done, I suddenly found that I **forgot to update the README and merged the PR**. In retrospect, I could have just added a commit to update the README in main, but I made a series of suffocating operations and directly brought main to a very strange state.

Finally, **under duress**, I took a "nuclear" operation (good children don't learn): Hard reset plus Force push:
```bash
git reset --hard commit_id
git push origin HEAD --force
```
The consequence is that the records of the commits that you want to undo later will be lost.

But you have to learn the correct operation, right? Afterwards, I went to Google to find this discussion: [How to revert multiple git commits? - Stack overflow](https://stackoverflow.com/questions/1463340/how-to-revert-multiple-git-commits)

If there is a branch that looks like this, and you want to undo the commits until the state of A:
```plaintext
 Z <-- A <-- B <-- C <--D     <-- main <-- HEAD
```
If there are no merge operations in these commits, you can use `git revert`:
```bash
git revert --no-commit A..HEAD
# or use:
# git revert --no-commit B^..HEAD
# or if you are afraid of making mistakes, you can revert step by step:
# git revert --no-commit D
# git revert --no-commit C
# git revert --no-commit B
git commit -m "the commit message for all of them"
```
Finally it will become:
```plaintext
Z <-- A <-- B  <-- C <-- D <-- [(BCD)^-1]     <-- main <-- HEAD
```
Another way is to use `git checkout` to restore, which is suitable for commits containing merge operations:
```bash
git stash # stash local changes, if any
git checkout -f A -- . # checkout to the specified commit on the local file
git commit -a
```
Finally it will become:
```plaintext
Z <-- A <-- B <-- C <-- D <-- A'     <-- main <-- HEAD
```

-----
## Wolf-Bites-Tweets v1
Project repository: [https://github.com/ohmykreee/wolf-bites-tweets](https://github.com/ohmykreee/wolf-bites-tweets)

In fact, it is a relatively simple Python program. It was written very quickly. It took about two nights to write the first version 1.0.0, and it took a few more days to ~~water~~ two more versions.

There is not much technical content (meaning that many things are copied from other projects). One of the pitfalls is that in version 1.0.0, a problem about copying list/dict variables was involved:

In Python, if you want to give the content of a list to another variable, ~~when you want to do some fancy things~~, like this:
```python
this_is_a_list = another_list
```
In fact, after this operation, there is only one list in Python with two different names, `this_is_a_list` and `another_list`. **If you make some changes to one of the variables, the other variable will also change accordingly.** ~~It's so stupid, isn't it?~~

The correct operation should be to use Deep copy:
```python
import copy

this_is_a_list = copy.deepcopy(another_list)
```
In this way, there will be two independent and non-interfering lists.

This operation has been deprecated in version 1.0.5 and later, because `get_tweets.py` has changed from the `pop` operation of deleting elements (and in retrospect, that method seems to have a bug, if you are interested, you can look back at that version) to the `append` operation of adding elements.

-----
## Wolf-Chews-Tweets
Project repository: [https://github.com/ohmykreee/wolf-chews-tweets](https://github.com/ohmykreee/wolf-chews-tweets)

I am going to write two implementation methods: one is to insert the official Twitter widget, and the other is to use a ready-made wheel [nolimits4web
/
swiper](https://github.com/nolimits4web/swiper) to write a component that directly displays pictures.
### Configure the development environment
Yes, it was very painful and I took a little detour.

> Who told you to use Windows for development?
> -- Unknown polemicist

The mvn used is the [nvm-windows](https://github.com/coreybutler/nvm-windows) project. The points to note are:
1. The installation directory cannot contain spaces, which means it cannot be installed in the `Program Files` folder. It is recommended to put it in `C:\nvm\` or `D:\nvm\`, otherwise you will get a mysterious garbled error (it is estimated that the software is not adapted to the Chinese environment). The Node link file directory is also best placed in this kind of root directory folder.
2. You can use the `nvm node_mirror <node_mirror_url>` and `nvm npm_mirror <npm_mirror_url>` commands to add mirrors to speed up downloads.
3. When executing `nvm use <node_version>`, you will encounter the error `exit code 1 a bunch of garbled characters`. The solution is to open a terminal with administrator privileges and then execute the command.
4. After Node is installed for the first time, the built-in terminal of VS Code may not be able to use the `node` and `npm` commands. The reason is not yet clear (maybe the system environment variables are not synchronized?). Restart to solve it.

There is another big pit in VS Code:
If you want to use Microsoft's own son Edge browser to debug Javascript code in VS Code, it actually has a built-in debugger for Microsoft Edge. I **thought** that this debugger was "out of the box": when debugging starts, it will start a built-in local server, and then open the browser to start debugging. But the fact is that it does not have the function of a local server, and you have to set up a local server yourself, otherwise you will get an error that you don't know what it means at first glance:
```plaintext
crbug/1173575, non-JS module files deprecated.
```
Fortunately, there is a ready-made [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) plugin in the VS Code plugins. After starting it, just change the port after `url` in `.vscode/launch.json` to the open port.

I can only say that this wave, this wave of Microsoft has deceived my pure feelings (fog).

### Using Custom Elements
I am going to use custom elements to call and generate the content I want.
> Reference: [Using custom elements - MDN Web Docs](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_custom_elements)

The usage is roughly to use the `window.customElements.define` command to declare a custom element, and then define a class to define the behavior of this custom element.

But I want to say that the example code in the reference article uses the `constructor()` method, which I think is not a good method in some cases:
```javascript
class WolfChewsElement extends HTMLElement {
  constructor() {
    // Must call super first
    super();

    // The functional code of the element is written here
    ...
  }
}
```
Before this, I want to remind you: when the browser renders an HTML file, it also reads the file in order from beginning to end; that is to say, the reading and execution of the code in the HTML file are affected by the order of position.

Back to this problem, the `constructor()` method is to define a class with a method, and it is executed **immediately** when this class is created, that is to say, when the browser reads this line of code, it will immediately execute the code in `constructor()`. So the problem comes: if your `constructor()` method has code that reads the properties in your custom element, and the DOM has not been established when this code is executed, **it will not be able to read the property content and return undefined**.

At the same time, in Chrome version 76.0.3809.132 (official version) (64-bit), if you have the behavior of reading the properties in the custom element in the `constructor()` method, and you do not add the `defer` attribute to the `script` tag when referencing the js file in HTML, the browser will directly return undefined. So what is this `defer`? This attribute tells the browser that this code should be executed after the entire page is loaded. (Reference article: [Why do I have to defer customElement definitions? - Stack Overflow](https://stackoverflow.com/questions/52176168/why-do-i-have-to-defer-customelement-definitions))

A better method should be to use `connectedCallback()`, that is, it is called when the custom element is first inserted into the document DOM node:
```javascript
class WolfChewsElement extends HTMLElement {
  connectedCallback() {
    // Write the code here
    ...
  }

  this_is_a_function() {
    ...
  }
}
```
For other methods, you can refer to here: [Web Components - MDN Web Docs](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components)
> Lifecycle callbacks
> Special callback functions defined in the class definition of a custom element, which affect its behavior:
> - connectedCallback: Called when the custom element is first connected to the document DOM.
> - disconnectedCallback: Called when the custom element is disconnected from the document DOM.
> - adoptedCallback: Called when the custom element is moved to a new document.
> - attributeChangedCallback: Called when an attribute of the custom element is added, removed, or changed.

(By the way, I will attach my method of reading the properties of custom elements here. Although the method is not my original creation, this method can be said to be very good, and it can also read optional parameters very well:)
```javascript
// fetch value
const config = {}
const keys = ['url', 'method', 'index', 'container_id']
for (let i = 0; i < this.attributes.length; i = i + 1) {
    if (keys.includes(this.attributes[i].name)) {
        config[this.attributes[i].name] = this.attributes[i].value
    }
}
```

### Cross-origin issue
I originally wanted to use Twitter's API: `statuses/oembed` to directly obtain the HTML code of the embedded twitter, but I encountered a cross-origin error.

Simply put, cross-origin (Cross-Origin Resource Sharing) is a situation that occurs when you want to use `XMLHttpRequest` to access resources under another domain name under one domain name.

By default, the browser rejects cross-origin by default, because there is a possibility of cross-origin attacks (unless the request header is added when the request is sent: `Access-Control-Allow-Origin: *` to allow all sources). **At the same time**, the other party's server also needs to allow cross-origin, otherwise this cross-origin access cannot be completed.

But the current situation is that all Twitter APIs do not support cross-origin access. The official statement is that it is recommended that Twitter APIs only be used in the back-end. There is no alternative but to use Twitter's `widgets.js` to render Twitter. The disadvantage is that it adds Twitter's own analysis framework, and it seems that it cannot be turned off.

For more information, you can read this article: [Cross-Origin Resource Sharing (CORS) - MDN Web Docs](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)

### Random integer generation
```javascript
/**
* Returns a random integer between min and max
* Using Math.round() will give you a non-uniform distribution!
* Both min and max can be randomed
*/
_getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
```
Directly copied from Stack Overflow: [Javascript Random Integer Between two Numbers -Stack Overflow](https://stackoverflow.com/questions/10134237/javascript-random-integer-between-two-numbers), as for the principle, I haven't figured it out yet (who made my math so bad).
> Ctrl + C, Ctrl + V, work done!
> -- Someone's rant

### http_get method
```javascript
_httpGet (theUrl) {
    try{
        var xmlHttp = new XMLHttpRequest()
        xmlHttp.open( "GET", theUrl, false ) // false for synchronous request
        xmlHttp.send( null )
        return xmlHttp.responseText
    } catch (e) {
        throw this._throwException('http request', e)
    }
}
```
Also directly copied from Stack Overflow: [HTTP GET request in JavaScript? - Stack Overflow](https://stackoverflow.com/questions/247483/http-get-request-in-javascript), I added a try{} and ~~the act of taking off my pants to fart (meaning I caught an error and threw it out)~~.

### Clear all child nodes in a parent node
Three methods, I don't think any of them are very elegant. (Reference article: [Remove all child elements of a DOM node in JavaScript - Stack Overflow](https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript))

1. `parent.textContent = ''`
This method is used in the project. Because there was only one text node in the original parent node, I estimate that this method will work. I haven't tried the situation where the parent node contains some strange things.

2. `parent.innerHTML = ''`
The destructive power is extremely great, and there is nothing in the parent node directly, but the execution speed is a little slower than the one above. It is not very useful in some cases.

3. Loop execution of `parentNode.removeChild()`
Although this looks the most elegant, I always feel that this kind of ~~violent~~ loop looks strange somewhere.
```javascript
while (parentNode.firstChild) {
    parentNode.removeChild(parentNode).lastChild);
}
```
### Make the entire div a hyperlink
It can be said to be a very good trick. It is not easy to say specifically, so I will directly put the link: [Make a div into a link - Stack Overflow](https://stackoverflow.com/questions/796087/make-a-div-into-a-link)

### Use Grunt to complete some automation
> Reference: [Getting started - GruntJS](https://gruntjs.com/getting-started)

At present, I only think of automation to reduce the project files, so the entire configuration will become very simple.

Before this, you need to install the global `grunt-cli`, whose function is to call up the grunt in the project and run it, so that you only need to run `grunt <task name>` to run the corresponding task:
```bash
npm install -g grunt-cli
```

Then install `grunt`, `grunt-contrib-uglify` and `grunt-contrib-cssmin` in the project:
```bash
npm install grunt --save-dev
npm install grunt-contrib-uglify --save-dev
npm install grunt-contrib-cssmin --save-dev
```
After installation, you can consider adding `node_modules` to `.gitignore` if you do not directly modify the package.

Directly use the official example `Gruntfile.js`, and then modify it yourself:
```javascript
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'wolf-chews.js',
                dest: 'wolf-chews.min.js'
            }
        },
        cssmin: {
            build: {
                src: 'wolf-chews.css',
                dest: 'wolf-chews.min.css',
            }
        }
    });

    // Load the plugins.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // Default task(s).
    grunt.registerTask('build', ['uglify', 'cssmin']);

  };
```

If you want to use GitHub Action to automatically execute the `grunt` command later, you can set the test command in `package.json`:
```
"scripts": {
    "test": "node -e \"var g = require('grunt'); g.cli.tasks = ['build']; g.cli()\""
},
```
In this way, you don't need to install `grunt-cli` in the Action process and just execute `npm test`.

Write `publish-to-npm.yml` to use GitHub Action to help me complete these tasks and publish them on npm:
```yaml
name: Publish to NPM

on:
  push:
    branches:
      - main

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - uses: actions/setup-node@v1
        with:
          node-version: 10
      - run: npm install
      - run: npm test
      - run: rm -rf .vscode .github
      - uses: JS-DevTools/npm-publish@v1
        with:
          token: ${{ secrets.NPM_TOKEN }}
          dry-run: false
```

-----
So, this big pit has come to an end for now.

You can see the implementation of this function on the [404 page](/404.html)!

-----
Do you think this is the end?

~~On another dark and stormy night~~, when I was lying in bed, a thought suddenly came to my mind: since you know Javascript, why don't you rewrite Wolf-bites-tweets in Javascript.

So, next preview: the development of Wolf-Bites-Tweets v2.0 (Node.js)

> Keep digging, keep filling.
> -- Kreee

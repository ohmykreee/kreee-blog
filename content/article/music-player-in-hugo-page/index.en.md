---
title: "Embedding a Music Player (APlayer) in Hugo"
date: 2021-06-07T11:10:33+08:00
draft: false
categories: ['Learning']
tags: ['Hugo', 'Selfhosted', 'Learning', '2021']
summary: "It's the music player that's pinned to the top. Want it? It only takes three short steps!"
---

{{< alert icon="language">}}
The English version is translated by AI (Gemini 2.5 Pro Preview). If you want to view the original content, please switch to Chinese version.
{{< /alert >}}

---

It's the music player that's pinned to the top.
Want it? It only takes three short steps!

## 0. Before we start
* Hugo version used: 0.83.1, higher versions should also work.
* Player used: [APlayer](https://github.com/DIYgod/APlayer), a player widget that everyone is using and I have to use, and it looks okay.
* Parser used: [MetingJS](https://github.com/metowolf/MetingJS), very powerful, supports many music platforms. I often use the NetEase Cloud Music platform.

## 1. Add dependencies
Although it's only four short words, this step is a nightmare for many newbies (including me) (mistake).

First of all, this thing varies depending on the template used. Some templates are better made (like mine, I have to say that Germans are really rigorous), and will reserve settings for adding `.css` and `.js` in the configuration file; while some templates will only provide `.css`, or even none.
So this is a big problem. For some people, adding dependencies is a matter of adding three sentences in the settings file, while for others it is an unreachable shore (mistake).

For those whose template configuration file has a place reserved for adding `.css` and `.js`, you only need to add the css dependency `https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.css` and the js dependencies `https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.js` `https://cdn.jsdelivr.net/npm/meting@2/dist/Meting.min.js`.

For those who **cannot directly add dependencies in the configuration file**, you need to overwrite the template file:
Find the file `/themes/<your theme name>/layouts/_default/baseof.html`, copy it to `/layouts/_default/baseof.html`, and modify the latter:
Copy and paste the following code between the `<head>` and `</head>` areas:
```html
<!-- require APlayer -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.css">
<script src="https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.js"></script>
<!-- require MetingJS -->
<script src="https://cdn.jsdelivr.net/npm/meting@2/dist/Meting.min.js"></script>
```
{{< alert >}}
**Note** If your template is imported via submodule and rendered and published in a non-local environment (such as GitHub Action), it is best to repeat the above steps after each template update to ensure that no strange problems occur.
{{< /alert >}}

After finishing, how to check if the dependencies are loaded successfully?
Just start the Hugo built-in server, open the webpage, and press the ~~noble~~ `F12` button to open the developer tools. If everything goes well, you can see two outputs in the console:
```plaintext
   APlayer v1.10.1 af84efb  http://aplayer.js.org

   MetingJS v2.0.1  https://github.com/metowolf/MetingJS
```
If not? Then it's your turn to have a headache 😏
Don't be too anxious, I also had a headache for an afternoon before I figured it out. After all, the point of playing with this thing is to tinker, isn't it?

## 2. **(Optional)** Define shortcodes
Of course, you can completely skip this step. You only need to insert this line where you want to add the music player:
```html
<meting-js server="netease" type="playlist" id="769332917"></meting-js>
```
The meaning of the relevant parameters can be found in the [official documentation](https://github.com/metowolf/MetingJS) for a detailed introduction, so I won't go into details here.

Then let's talk about our shortcodes. Why do we need shortcodes? In fact, it is to facilitate us to insert music at the fastest speed when writing articles.
As usual, I also strongly recommend that you go directly to the [official documentation: Shortcodes](https://gohugo.io/content-management/shortcodes/) to learn how to write shortcodes. The following is how I write my shortcodes.

First, create a new file `/layouts/shrotcodes/aplayer.html`, the file name is the name of your shortcodes.
Then, write in the file:
```plaintext
<meting-js server="{{ .Get "server" }}" type="{{ .Get "type" }}" id="{{ .Get "id" }}"></meting-js>
```
It's very simple, isn't it? Among them, `.Get` is a method that can get the passed parameters, which I believe everyone can see at a glance. In fact, you can also use a judgment statement to complete the shortcodes that can pass parameters even if the parameter name is not declared. You can write it by referring to the official sample code. Since I don't have this requirement, I just wrote this line.
After finishing, you only need to use the just-defined shortcodes where you want to insert it in the article:
```plaintext
# Remember to add two {{ in front, I didn't expect that shortcodes would be triggered in the code block
<aplayer server="netease" type="playlist" id="769332917">}}
```
to achieve the same effect as the previous HTML statement.

## 3. Change Goldmark settings
Do you think it's over here? But I said it takes three steps. The last step is also a legacy issue of the Hugo version update.
If you are stubborn and go directly to deploy the webpage; after you finish deploying, you will find that the place where the music player should appear is blank.
Don't panic, join me, press the ~~noble~~ `F12` button to open the developer tools, and use the element inspector to select the place where the player should appear. Then, you will see a line of words in the code viewer:
```html
<!-- raw HTML omitted -->
```
Okay, I won't keep you in suspense. The problem is that the new renderer Goldmark does not render HTML code by default, not even with shortcodes.

**So**, there are two solutions:
1. Change the settings of the Goldmark renderer so that it can render HTML code. You only need to add the following content in the `[markup]` part of the configuration file (taking `config.toml` as an example, please refer to the syntax of the corresponding file for other formats):
```toml
  [markup.goldmark]
    [markup.goldmark.renderer]
      unsafe = true
```
2. If you are the old school style, you can directly switch to the old renderer. Add the following content in the `[markup]` part of the configuration file (taking `config.toml` as an example, please refer to the syntax of the corresponding file for other formats):
```toml
  defaultMarkdownHandler = "blackfriday"
```

## 4. Summary
So, the possible reasons why the player component does not work are divided into these three types:
1. The css and js dependencies were not successfully added **(most likely)**;
2. The Goldmark settings were not changed;
3. Other stupid errors such as wrong code or incorrect parameters.

If everything goes well, you can also fill your blog with music! Enjoy!

{{<aplayer server="netease" type="song" id="29550185">}}

---
title: "Automatically Render and Publish Web Pages Using GitHub Actions"
date: 2021-06-07T10:21:29+08:00
draft: false
categories: ['Learning']
tags: ['GitHub', 'Learning', '2021']
summary: "So, adhering to the principle that the essence of human technological progress is laziness, I will learn GitHub Actions to achieve a one-stop service for web page rendering and publishing."
---

{{< alert icon="language">}}
The English version is translated by AI (Gemini 2.5 Pro Preview). If you want to view the original content, please switch to Chinese version.
{{< /alert >}}

---

## Why?
According to GitHub Pages policy, a GitHub account can only have one personal homepage and multiple project homepages. My personal homepage quota is given to the server's Landing Page, so this blog can only be published in the name of a project homepage.
However, there is a problem. Unlike personal homepages, project homepages are hosted on the `gh-pages` branch. So if it is completely manual, I need to render the webpage locally and then manually push it to the `gh-pages` branch.
So, adhering to the principle that the essence of human technological progress is ~~laziness~~, I will learn GitHub Actions to achieve a one-stop service for web page rendering and publishing.
So, let's begin!

Without further ado, here is `/.github/workflows/publish-site.yml`:
```yml
name: Publish site to GitHub Pages

on:
  push:
    branches:
      - main

jobs:

  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repo
        uses: actions/checkout@master
        with:
          submodules: true

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: 'latest'
          # extended: true
          
      - name: Build
        run: hugo
          
      - name: Deploy to GitHub Pages
        if: success()
        uses: crazy-max/ghaction-github-pages@v2
        with:
          target_branch: gh-pages
          build_dir: public
          fqdn: blog.ohmykreee.top
          dry_run: false
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Workflow File Analysis
In fact, I strongly recommend that you go to the [official documentation](https://docs.github.com/cn/actions) to learn the relevant syntax + look at the example files. The following is my learning achievement (half-baked), analyzing this GitHub Action workflow file.
### Trigger Conditions
> [Official documentation: Events that trigger workflows](https://docs.github.com/cn/actions/reference/events-that-trigger-workflows)
```yml
on:
  push:
    branches:
      - main
```
It is clear at a glance: it is triggered when there is a new push event on the `main` branch.

### Step 1: Check out the repository
```yml
      - name: Checkout Repo
        uses: actions/checkout@master
        with:
          submodules: true
```
There is a key here: the `submodules` parameter **must** be passed as `true`, because if your Hugo project uses a template, and the template file is also hosted on GitHub, then the template must be set as a SubModule when creating and pushing the project.
However, by default, `git pull` will not pull the files in the SubModules (and you also need to manually update the SubModules' files), which will lead to the lack of template files in the project files to be rendered on the GitHub Action server if the existence of SubModules is not declared, and then it will be gone.

### Step 2: Prepare the environment
> [This package's Action marketplace homepage](https://github.com/marketplace/actions/hugo-setup)
```yml
      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: 'latest'
          # extended: true
```
It is clear at a glance, set up the Hugo environment. You can pass parameters to specify the Hugo version and whether to use the extended version.

### Step 3: Start rendering the webpage
```yml
      - name: Build
        run: hugo
```
It is also clear at a glance, execute the `hugo` command.

### Step 4: Push to the `gh-pages` branch and publish
> [This package's Action marketplace homepage](https://github.com/marketplace/actions/github-pages)
> [Official documentation: Context and expression syntax for GitHub Actions](https://docs.github.com/cn/actions/reference/context-and-expression-syntax-for-github-actions)
> [Official documentation: Authentication in a workflow](https://docs.github.com/cn/actions/reference/authentication-in-a-workflow)
```yml
      - name: Deploy to GitHub Pages
        if: success()
        uses: crazy-max/ghaction-github-pages@v2
        with:
          target_branch: gh-pages
          build_dir: public
          fqdn: blog.ohmykreee.top
          dry_run: false
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
It is still clear at a glance (is it over yet?), if the previous step does not return an error, push the generated files to the `gh-pages` branch.
The parameters that can be passed are:
* `target_branch`: target branch;
* `build_dir`: folder to be uploaded;
* `fqdn`: CNAME file content, used for custom domain names;
* `dry_run`: for testing, run but do not push code.

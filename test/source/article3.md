---
title: 'Hexo plugin : hexo-generator-slideshare'
date: 2017-03-28 23:25:47
tags:
- hexo
- blog
- javascript
- open-source
categories:
- hexo
- open-source
coverImage: 'hexo.jpg'
coverCaption: "Hexo logo"
coverMeta: out
coverSize: partial
autoThumbnailImage: yes
thumbnailImage: 'hexo.jpg'
thumbnailImagePosition: left
---

Hi I have developed a rather small plugin for the great static site generator hexo [hexo](http://hexo.io).

<!-- more -->

If you still don't know Hexo is a static site generator written in javascript that allows you to build fast blogs without the burden to instantiate a full CMS like Wordpress.

This website is powered up by Hexo. Since I am writing sometimes Slideshare presentations, I have decided to build a small plugin to display Slideshare presentations.

The plugin code source is available there [Github repo](https://github.com/sleroy/hexo-generator-slideshare).

To install the plugin, simply write the command inside your Hexo blog folder :

```
npm install hexo-generator-slideshare --save

```

And then your site is ready to embed slideshare presentations by adding the following tag :

```
{% slideshare slideshareID %}

```

More informations are available on :
- [npm](https://www.npmjs.com/package/hexo-generator-slideshare)
- [readme](https://github.com/sleroy/hexo-generator-slideshare)

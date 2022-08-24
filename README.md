# Lib-windowswap

Do you know [WindowSwap](https://www.window-swap.com) ? It's this website that started during the pandemic, where people share videos of whats happening around their window.

This repo does the same thing, except that it's free and it casts those videos to your chromecast (or compatible player).

## Huge security and privacy issue

If you take a look at the sources [https://www.window-swap.com/main.77d8f9088b0c46e986db.js](https://www.window-swap.com/main.77d8f9088b0c46e986db.js) you can find all the datas this website uses (the videos) but here's the problem...

It also lists the user's webcam location and their email. Very useful for burglars and marketers. You can also find the dump here : [lib/feeds.js](lib/feeds.js) *STARTING LINE 686*

## What can I do about it ?

From their T&C available here [https://docs.google.com/document/d/17Ods6fr6qZohNAAwQEIkQzitbJJZaVSOqls8rdMfmcI/edit?usp=sharing](https://docs.google.com/document/d/17Ods6fr6qZohNAAwQEIkQzitbJJZaVSOqls8rdMfmcI/edit?usp=sharing)

>If you wish to delete your personal information from the Service you can email us at qunaliaa@gmail.com

## How to use

If you use a Raspberry Pi, execute preinstall.sh and postinstall.sh

```
npm run start
```

This script will cast a random video to your tv
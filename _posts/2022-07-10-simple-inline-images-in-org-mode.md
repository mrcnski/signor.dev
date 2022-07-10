---
title: "Simple Inline Images In Org-Mode"
date: 2022-07-10
categories: emacs org-mode
description: Recently I wanted to display some inline images in org-mode. I couldn't find a simple explanation for how to do it online, so I'm writing my own.
---

Recently I wanted to display some inline images in `org-mode`. I couldn't find a simple explanation for how to do it online, so I'm writing my own. I'll keep it short.

[org-download](https://github.com/abo-abo/org-download) was the prevailing recommendation that I found. However, that package is not recommended for use by this author. It is confusing, hard to configure, and abandoned by the maintainer.
{: .note }

It turns out that you don't need any fancy packages to accomplish this, just two lines of configuration.

## Configuration

First, add these lines to your config file:

{% highlight elisp linedivs %}
;; Inline images.
org-startup-with-inline-images t
org-image-actual-width nil
{% endhighlight %}

The first line will load existing inline images when you open an org file. (When you add inline images later, you'll still have to run `M-x org-redisplay-inline-images` or reload the file.)

The second line allows you to specify your own width for images, so that they don't take up the whole screen.

## Adding Images

To add an image, just use this format in your org file:

```
[[./images/horses.jpeg]]
```

The path between the brackets is relative to your org file.

Run `M-x org-redisplay-inline-images` (or just reload the file) and you should see this:

{% include image.html name="inline-images/no-width.png" width="400" alt="What the?!" caption="What the?!" %}

It's way too big! Try this instead:

```
#+ATTR_ORG: :width 300
[[./images/horses.jpeg]]
```

Now it works:

{% include image.html name="inline-images/width.png" width="400" alt="These Icelandic horses were kindly pet by the author." caption="These Icelandic horses were kindly pet by the author." %}

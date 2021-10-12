---
title: "Memory Management In Unsafe Rust"
date: 2018-08-18
categories: c emacs org-mode presentations rust
description: "This is a presentation I gave to my coworkers at MaidSafe."
---

View the full presentation [here](/files/unsafe-rust.html).

This is a presentation I gave to my coworkers at [MaidSafe](https://maidsafe.net). It was meant to be a broad overview of Rust unsafe code and FFI design, and includes the motivations as well as the background concepts necessary to understand the design of the FFI API I implemented for [parsec](https://github.com/maidsafe/parsec). I wanted it to be understandable to beginners but still useful to experts -- I hope I succeeded in that rather lofty goal :)

You can view the source file for the presentation [here](https://github.com/m-cat/unsafe-rust). It's a plaintext org-mode file.

It was my first time creating a presentation within Emacs itself. My original intention was to create the outline for the presentation in org-mode and then make the slides in Google Slides, images and formatting and all, but that turned out to be a tedious process for the amount of content in this presentation. It was much easier to do it all in org-mode.

The benefits of this approach are:

- It's easy to write up the entire presentation quickly using Emacs keybindings and org-mode features. Moving around headings is a breeze. You can change the whole structure of the presentation in a few seconds.
- You don't need to fiddle about with WYSIWYG formatting. You can just use the formatting markup available in org-mode.
- You have the entire presentation available as plaintext instead of a proprietary format. That makes it easy to read/edit on any machine, sync/backup, export to other formats, etc.

The downsides are:

- It's hard to tell whether the amount of content under one heading will fit on a single slide until you actually preview it. It's especially hard if you have images or diagrams.
- It's tedious to do manual formatting if you wanted to.
- The presentation doesn't look as aesthetically nice as a typical Google Slides presentation (but it's not impossible to beautify it if you had the time).

If you care more about the content of the presentation (or you have a lot of content), then the pros far outweigh the cons.

Anyway, enjoy :)

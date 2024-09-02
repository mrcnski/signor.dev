---
title: "GPG In Emacs"
date: 2020-04-10
categories: emacs cryptography
toc: true
description: "As Emacs users, our best choice for editing encrypted files is EasyPG."
post-no: 3
related: [4]
---

* Table of contents.
{:toc}

I recently decided to keep a private journal. I wanted my journaling to be efficient and comfortable, so of course I've been doing it in Emacs. Even though I do minimal editing, writing in a stream-of-consciousness style, I feel at home in Emacs.

I also wanted journal entries to be private, so I thought I'd encrypt them. I didn't want to risk getting hacked and my dark inner secrets spilling out into the world. I also use Dropbox to keep a cloud copy of all my data, and I wanted to stuff my journal in there for convenience. This meant I had extra reason to secure it with encryption.

As Emacs users, our best choice for editing encrypted files is [EasyPG](https://epg.osdn.jp/). It's not the greatest or the most intuitive tool, and it's based on GnuPG which is itself a nightmare of UX design. However, after some annoying initial setup, EasyPG is convenient. This is a guide to that annoying initial setup.

## What is EasyPG?

EasyPG is like cherry ice cream in a cone[^ice-cream], in the sense that it lets you access encrypted data transparently. When you visit a file such as `secret.txt.gpg`, EasyPG -- or `epa` -- I don't get the acronym, either -- will automatically decrypt it and open it as it it were a regular text file. Spiffy, eh? When you save, bada bing, bada boom: `epa` encrypts it for you automatically!

[^ice-cream]: Or vanilla, if you prefer.

The backbone of EasyPG is GnuPG. Expanding on the dessert analogy, GnuPG is like an oatmeal raisin cookie.

## What's GnuPG?

Read the wiki page.

## Generating your GPG keys

The first step to using EasyPG is to generate your GPG keys. Hold it right there! Make sure you have `gnupg` installed before you take another step. On OSX, you'll want to use [Homebrew](http://brew.sh/), and then type out `brew install gnupg` in eshell or shell or fish or zsh. GnuPG is the backbone of EasyPG.

Make sure you're using a recent `gnupg` version -- I'm on `2.2.17` at the time of this writing. My `epa` setup (see below) will probably not work with `gnupg 2.0`, and it will definitely not work with `< 2.0`.
{: .note}

So, generating your GPG key. What you wanna do here is type out the following.

```bash
gpg --full-generate-key
```

Now do this:

1. Select the default key kind.
1. Select the keysize you want. Higher is more secure.
1. Make a *never-expiring key*.
1. Type in your real, full name and email.
1. Type in a password.

And bada bing, bada boom you've generated a key in the `~/.gnupg/` directory!

**Be very cautious here not to make any mistakes. This is a serious program, made for serious users. It is NOT for kids.**
{: .note}

Remember your password! **This is the password you will use when decrypting with `epa`.**
{: .note}

When picking a password, length counts. I'm a fan of the [diceware](https://en.wikipedia.org/wiki/Diceware) technique for generating long, yet easy-to-remember passwords. (With my `epa` setup (see later), `epa` will cache your password for a while; you don't have to type it in every time.)
{: .note}

### Securing your GPG key

This is an important point: you **mustn't** lose the generated key in `~/.gnupg/`. **Both this key and the password will be required to decrypt your files.** What I did personally is I moved this directory to Dropbox and created a symlink to it in my home directory[^genius]. I regularly make backups of my Dropbox folder. This way the key is stored on my computer, in the cloud and on my own external disks.

[^genius]: This is how I manage all of my important dot-files, actually. I plan on writing a short blog post about that.

## Setting up EasyPG

Okay, great, we got past the part with GnuPG. We'll never have to touch this program again. I hope you created never-expiring keys.

Now let's set up EasyPG. EasyPG is a built-in Emacs package. If you're not using Emacs, you just wasted your time reading this post. Thanks for the page hit. Sucker.

Let's set up EasyPG. Here is the config I put in my Emacs init.

{% highlight elisp linedivs %}
;; Don't bring up key recipient dialogue.
(require 'epa-file)
(setq epa-file-select-keys nil)
(setq epa-file-encrypt-to '("<YOUR EMAIL HERE>"))
{% endhighlight %}

This first snippet makes it so you don't have to provide your email address every time, I think. And something about a "key recipient dialogue"? I have no clue.

Optionally, you may wish to increase the password expiry time to something longer and a bit more convenient, like 15 minutes.

{% highlight elisp linedivs %}
;; Increase the password cache expiry time.
(setq password-cache-expiry (* 60 15))
{% endhighlight %}

I'm not actually sure if this does anything, since half of these settings seem to be deprecated.

This variable has no effect if you use GPG2, which automatically runs `gpg-agent` to cache the password. You'll have to set [one of the options](https://www.gnupg.org/documentation/manuals/gnupg/Agent-Options.html) like `default-cache-ttl` in `~/.gnupg/gpg-agent.conf`.
{: .update}

This next part might not be needed for you. I think it depends on your Emacs version. If you get an error like `inappropriate ioctl for device`, please include this fix (from [here](https://colinxy.github.io/software-installation/2016/09/24/emacs25-easypg-issue.html)):

{% highlight elisp linedivs %}
;; Fix EasyPG error.
;; From https://colinxy.github.io/software-installation/2016/09/24/emacs25-easypg-issue.html.
(defvar epa-pinentry-mode)
(setq epa-pinentry-mode 'loopback)
{% endhighlight %}

That's pretty much it, I guess. The EasyPG setup is pretty finicky and I honestly just cobbled together something that seems to work fine.

## Test Drive

1. Open up Emacs and create a file called `test.txt.gpg`.
1. Enter some arbitrary text, like `Vim is an inferior text editor`
1. Save it. A dialogue box pops up.
1. Go to the line with your email and hit `m`. Navigate to the `[OK]` button and hit enter. Yes, the user experience for this part is abominable.
1. Kill the buffer. Open the file again.
1. Enter the password that you used when setting up your GnuPG key.
1. You can now save, close, and reopen the file multiple times without having to enter your password. You can edit other GPG files completely transparently as well, as long as your password cache doesn't expire.

If something didn't go as expected, make sure you followed this guide down to the button. If you deviated at all, I can't really help you, because I have no idea what I'm doing, and I'm not your personal tech support guy.

## Footnotes

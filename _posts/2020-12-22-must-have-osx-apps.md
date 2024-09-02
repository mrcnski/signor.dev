---
title: "Must-Have OSX Apps"
date: 2020-12-22
categories: osx
toc: true
description: "Did you know there are OSX apps you didn't know you needed? You probably didn't, or maybe you did but you didn't know why."
---

* Table of contents.
{:toc}

Did you know there are OSX apps you didn't know you needed? You probably didn't, or maybe you did but you didn't know why.

{% include image.html name="must-have-osx-apps/view.jpeg" alt="View" width="504" %}

## Alfred

[[ Download ]](https://www.alfredapp.com/)
{: .post-meta}

First up on our list is **Alfred**, a classic OSX app that many readers will surely have at least heard about. It lets you quickly open apps, make web searches, open files, and more -- all with only a few keystrokes and without having to use the mouse.

You can download (or easily create) plugins to search Youtube and imdb, as I've done, but that is only the beginning. One of my favorite use cases is copying a URL, pressing CMD + space to launch Alfred, pasting the URL, and having it open in the default browser. I can do the same by opening Firefox first and focusing the address bar with CMD + L, but the above is a bit faster.

I also frequently use Alfred when programming. Paired with Dash, it lets you search the docs of many languages, again in only a few keystrokes.

## Magnet

[[ Download ]](https://apps.apple.com/us/app/magnet/id441258766?mt=12)
{: .post-meta}

Up next is **Magnet**, a simple window manager that requires no configuration, has never given me issues, and does exactly what I need it to. I like the default keybindings and I use it all the time to make applications take up the whole screen, or to snap an app to the left or right half of the screen.

There are probably more featureful window managers but I have no need for them, and so Magnet wins my full **Mrcnski Windows Manager Recommendation**.

{% include image.html name="must-have-osx-apps/magnet.png" alt="Magnet" width="233" %}

## Carbon Copy Cloner

[[ Download ]](https://bombich.com/)
{: .post-meta}

What is the next incredible recommendation, you ask? Why, it is **Carbon Copy Cloner**, another Mac mainstay. CCC is a very powerful disk backup app featuring many options for defining schedules, configuring what you want backed up, and so on.

It's not the most user-friendly app, but after a one-time set-up of my schedule it has continued to run faithfully as long as my external disk is connected. CCC is only one part of my backup strategy, of course, which also includes Time Machine and a cloud sync service (pCloud currently), but that is a blog post for another topic.

{% include image.html name="must-have-osx-apps/ccc.png" alt="CCC" width="880" %}

## Rest

[[ Download ]](http://resttimer.com/en)
{: .post-meta}

**Rest**! You haven't heard of this one, have you? I use Rest to impose breaks on a schedule. Every 40 minutes my screen goes black for five minutes, during which I rest my eyes and mind,  move around a bit and reset my posture, and so on. I'm a programmer, but I don't plan on letting this profession destroy my health by the time I'm 40. Get some Rest!

## Swiftbar

[[ Download ]](https://swiftbar.app/)
{: .post-meta}

**Swiftbar** is a massive upgrade on the classic but unmaintained Bitbar. Bitbar is an application that lets you include the output of shell scripts in your menu bar. For example, the Spotify plugin displays the currently-playing song on Spotify, and even allows you to pause, play, and skip songs without opening Spotify itself.

Bitbar was so buggy that I just stopped using it completely until I found out about Swiftbar. All Bitbar [plugins](https://github.com/matryer/bitbar-plugins) are also compatible with Swiftbar -- personally I use the [World Time](https://github.com/matryer/bitbar-plugins/blob/master/Time/worldclock.1s.sh) and [Spotify](https://github.com/matryer/bitbar-plugins/blob/master/Music/spotify.10s.sh) plugins (the latter of which I made significant contributions to, and which therefore gets my **The Mrcnski Best Bitbar Plugin Award**).

{% include image.html name="must-have-osx-apps/swiftbar.png" alt="Swiftbar" %}

Here's my World Time configuration:

{% highlight sh linedivs %}
ZONES="America/Los_Angeles America/New_York Europe/London Europe/Warsaw"
echo "🌍 "
echo '---'
echo -e "$(date -u +'%H:%M')\\tUTC"
echo '---'
for zone in $ZONES; do
  echo -e "$(TZ=$zone date +'%H:%M')\\t${zone}"
done
{% endhighlight %}

## SensibleSideButtons

[[ Download ]](https://github.com/archagon/sensible-side-buttons)
{: .post-meta}

Here's another life-changing one: **SensibleSideButtons**. This lets you use mouse side buttons to go forward and back in most applications, including browsers like Firefox. I looked long and hard for something like this that "just works", and SSB is it. I never have to fiddle with it for it has never failed me. Get it and donate the man a couple buckaroos!

## Dozer

[[ Download ]](https://github.com/Mortennn/Dozer)
{: .post-meta}

By now we've accumulated quite a bit of icons in the menu bar, eh? Let's clean those up with **Dozer**. This is truly one heck of an app, in that it lets you hide less-frequently-used icons, and show them when you need them with a click. I've tried a couple of these "menu bar cleanup" apps and this is my favorite, so make Uncle Mrcnski happy and get it yourself!

## KeePassXC

[[ Download ]](https://keepassxc.org/)
{: .post-meta}

Worth a mention is **KeePassXC**, one of the first programs I always install on new computers. It's a very nice password manager and is actively developed. It doesn't really have much to do with OSX, though, except for the integration with TouchID. After unlocking a database once, it can be unlocked subsequent times by pressing Enter and using TouchID. This is really useful since I set my database to lock itself after a minute of inactivity for the extra security, which I urge you to adopt as a **Mrcnski Best Practice**.

{% include image.html name="must-have-osx-apps/keepassxc.png" alt="KeePassXC" width="718" %}

## Conclusion

That's it for my OSX App must-haves. I know you want more, but I am an App Minimalist. When I use something, you know it's *really* worth using. I'm not sponsored and don't make money from this blog -- these recommendations come from the heart. In fact, I recommend you delete all bookmarks to every other blog except mine. I write many life-changing posts, so stay tuned for more.

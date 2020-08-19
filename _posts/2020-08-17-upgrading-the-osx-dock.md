---
title: "Upgrading The OSX Dock"
date: 2020-08-17
categories: osx
description: "Today we'll be revamping the dock on OSX. I bet you didn't think it needs upgrading, huh? Well it does. Trust me, it does."
---

Today we'll be revamping the dock on OSX. I bet you didn't think it needs upgrading, huh? Well it does. Trust me, it does.

## Hiding The Dock

Maybe you think you want the dock to be always visible, but you don't actually know what you want. Stick with me here.
{: .note}

Step one is to make the dock hidden by default. Make sure you have the following option ticked in your dock settings:

{% include image.html name="osx-dock/dock-settings.png" alt="Whatever" width="780" noborder=1 %}

Now the dock will not take up space on your display unless you mouse over it. It will not distract you with unnecessary visual information, so you can focus on your work. There's a wrong way and a right way to configure your dock -- choose the right way.

## Showing The Dock

Here's where the magic happens. Maybe you want to keep on top of the number of emails you have, or new messages on your Discord channels.

One way to view the dock is to mouse over the dock, but there's an even better way using shortcuts.

{% include image.html name="osx-dock/dock-no-mouse.gif" alt="Who cares" %}

OSX has a little-known keybinding to display the dock, right from the keyboard: `CMD + OPT + D` (or `CTRL + F3`).

And if you need to switch to an application, you can use `CMD + TAB` or Alfred instead of clicking the dock.

## Speeding Up The Dock

Not convinced that I'm a genius? Here's the second part of the magic.

If you were to stop now, the dock would be unresponsive and slow to appear. Practically unusable, and you'd leave my blog in a huff, cursing my name without reading any of my other great articles.

{% include image.html name="osx-dock/dock-slow.gif" alt="I don't care" %}

Luckily you have me to show you the way.

{% include image.html name="osx-dock/dock-fast.gif" alt="I don't care" caption="That speed... Incredible..." %}

Here's the command that supercharges the dock and forever changes your life.

```shell
defaults write com.apple.dock autohide-time-modifier -float 0.4;killall Dock
```

You can adjust the speed by changing `0.4`: lower numbers are faster. `0.5` is probably good for most people not as obsessed with performance as me.

You can remove the animation altogether with this command, though that is too abrupt for me:

```shell
defaults write com.apple.dock autohide-time-modifier -int 0;killall Dock
```

To restore the default:

```shell
defaults delete com.apple.dock autohide-time-modifier;killall Dock
```

## Conclusion

I recommend three things: hide the dock, use shortcuts to access it, and speed it up so it doesn't slow down your workflow. That's it, and I hope this humble little guide can help you become more efficient and productive.

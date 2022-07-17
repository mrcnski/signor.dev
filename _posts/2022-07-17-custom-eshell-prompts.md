---
title: "Emacs: Custom Eshell Prompts"
date: 2022-07-17
categories: emacs productivity
description: So the other day I was curious if I could add the current timestamp to my eshell prompt.
---

The other day I was curious if I could add the current timestamp to my eshell
prompt. After some [Kagi](https://kagi.com/)'ing I found [this
page](https://www.emacswiki.org/emacs/EshellPrompt) and started writing my own
prompt! (Using the example under "A fancy prompt" as a starting point.)

## Before

{% include image.html name="eshell-prompt/before.png" alt="Before." width="500" %}

## After

{% include image.html name="eshell-prompt/after.png" alt="After." width="500" %}

## My Config

Here's my config, which you can use as a jumping-off point.

{% highlight elisp linedivs %}
(defun with-face (str &rest face-plist)
  (propertize str 'face face-plist))
(defun custom-eshell-prompt ()
  (let* (
         ;; Get the git branch.
         (git-branch-unparsed
          (shell-command-to-string "git rev-parse --abbrev-ref HEAD 2>/dev/null"))
         (git-branch
          (if (string= git-branch-unparsed "")
              ""
            ;; Remove the trailing newline.
            (substring git-branch-unparsed 0 -1)))
         )
    (concat
     ;; Timestamp.
     (with-face
      (format-time-string "[%a, %b %d | %H:%M:%S]\n" (current-time))
      :inherit font-lock-builtin-face)
     ;; Directory.
     (with-face (concat (eshell/pwd) " ") :inherit font-lock-constant-face)
     ;; Git branch.
     (unless (string= git-branch "")
       (with-face (concat "[" git-branch "]") :inherit font-lock-string-face))
     "\n"
     ;; Prompt.
     ;; NOTE: Need to keep " $" for the next/previous prompt regexp to work.
     (with-face " $" :inherit font-lock-preprocessor-face)
     " "
     )))
(setq eshell-prompt-function 'custom-eshell-prompt)
(setq eshell-highlight-prompt nil)
{% endhighlight %}

### Note about the format

Note that if you want `eshell-previous-prompt` and `eshell-next-prompt` (which
the author suggests binding to `M-{` and `M-}`) to keep working, you need a
space before the `$` symbol in your prompt.

If you want to change this format, you can still edit the regex that eshell uses
to find the prompts. The helpdoc for `eshell-prompt-function` says as much:

> Make sure to update ‘eshell-prompt-regexp’ so that it will match your prompt.

## Bonus

As I was writing this post I found out about [this
project](https://github.com/zwild/eshell-prompt-extras). Looks like it doesn't
support timestamps though, and not sure if it gives you much fine-grained
customization.

[Another bonus.](https://www.reddit.com/r/emacs/comments/6f0rkz/my_fancy_eshell_prompt/)

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

## Dec 2022 Update

Recently I found [this StackOverflow
post](https://emacs.stackexchange.com/a/33408/15023) and got some useful
improvements from it, including:

- Make all prompt components read-only, so that the prompt cannot be deleted as
  regular text.
- Try to abbreviate-file-name of current directory as per `eshell` defaults,
  e.g. display `~` instead of `/path/to/user/home`.
- Choose between prompts # and $ depending on user privileges, as per Bourne and
eshell defaults.

My updated `custom-eshell-prompt` function is:

{% highlight elisp linedivs %}
;; Bits taken from https://emacs.stackexchange.com/a/33408/15023.
(defun custom-eshell-prompt ()
  "My custom eshell prompt."
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
    (mapconcat
     (lambda (list)
       ;; Make all prompt components read-only, so that the prompt cannot be
       ;; deleted as regular text. Allow text inserted before the prompt to
       ;; inherit this property, as per eshell defaults.
       (propertize (car list)
                   'read-only      t
                   'font-lock-face (cdr list)
                   'front-sticky   '(font-lock-face read-only)
                   'rear-nonsticky '(font-lock-face read-only)))

     `(
       ;; Timestamp.
       (,(format-time-string "[%a, %b %d | %H:%M:%S]\n" (current-time)) :foreground "#68a5e9")
       ;; Directory.
       ;;
       ;; Try to abbreviate-file-name of current directory as per `eshell'
       ;; defaults, e.g. display `~' instead of `/path/to/user/home'.
       (,(concat "[" (abbreviate-file-name (eshell/pwd)) "] ") :inherit font-lock-constant-face)
       ;; Git branch.
       (,(if (string= git-branch "") "" git-branch) :inherit font-lock-preprocessor-face)
       ("\n")
       ;; Prompt.
       ;;
       ;; NOTE: Choose between prompts # and $ depending on user privileges,
       ;; as per Bourne and eshell defaults.
       (,(if (zerop (user-uid)) " # " " $ ") :foreground "#fffe0a"))
     ""))
  )
{% endhighlight %}

## Bonus

As I was writing this post I found out about [this
project](https://github.com/zwild/eshell-prompt-extras). Looks like it doesn't
support timestamps though, and not sure if it gives you much fine-grained
customization.

[Another bonus.](https://www.reddit.com/r/emacs/comments/6f0rkz/my_fancy_eshell_prompt/)

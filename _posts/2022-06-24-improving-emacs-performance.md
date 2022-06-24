---
title: "Improving Emacs Performance"
date: 2022-06-24
categories: emacs productivity
description: Making the best editor even better.
---

My [Emacs config](https://github.com/m-cat/init.el) has grown considerably over
the years. I love finding new packages to improve my workflow, and
MELPA/`use-package` together make packages really easy to install.

But this is bad news if you want a fast and productive editing experience. A few
weeks ago, some dastardly sluggishness when editing Rust code forced me to
finally sit down and address the problem. Here are some Bytedude Tips I've
collected from the process.

## Tips

- It helps a lot to cut down on frills you don't need. Disable things like syntax checking as you type or make them run on save instead.
- Get rid of large, hefty packages like `helm` and use simpler ones, like `vertico`.
- Prefer built-in packages like `flymake` to third-party ones like `flycheck`.
- Increase the GC threshold and set it to run when you tab out or go idle:
{% highlight elisp linedivs %}
(add-hook 'after-init-hook
          #'(lambda ()
              (setq gc-cons-threshold (* 100 1000 1000))))
(add-hook 'focus-out-hook 'garbage-collect)
(run-with-idle-timer 5 t 'garbage-collect)
{% endhighlight %}
- I disabled my fancy modeline and `show-parens` and my experience is smoother. Try disabling one minor mode at a time and see how things feel with each change.
- Also, use `M-x profiler-start` and `profiler-report` to profile runtime.
- There's also `esup` and the [`benchmark-init`](https://github.com/dholm/benchmark-init-el) package for profiling startup, but I don't much care about that.

## Conclusion

As with all things, you will have to strike a balance between performance and
functionality. I still get the occasional GC hiccup, and it bothers me some, but
not enough to sacrifice the formidable 10x productivity increase I get from all
my packages.

---
title: "Setting up Rust Support in Emacs (And Introducing Rant-o-Vision)"
date: 2022-05-23
categories: emacs rust
description: I've been getting back into Rust programming for work, and things have changed in the past two years.
---

I've been getting back into Rust programming for work, and things have changed over the past two years. [racer](https://github.com/racer-rust/racer#disclaimer), which I was using for code completion and jump-to-definition, is no longer actively maintained, while LSP and Rustic have appeared on the scene.

A couple weeks ago I decided to set up a fresh Rust config from scratch. It was harder than it should have been, so I'm documenting the final result for others.

## Getting the Pre-Requisites

The dependencies _should_ be installed by our Emacs package [Rustic](https://github.com/brotzeit/rustic):

> Simply put `(use-package rustic)` in your config and most stuff gets configured automatically.

... but aren't. At least, not on OSX.

So let's start by installing the components we need.

```
rustup component add rust-src rustfmt clippy rls rust-analysis
```

I thought this was all I would need<span class="rant-off">, but of course, that was too naively optimistic of me</span>.

<center><button onclick="toggleRant();">Toggle Rant-o-Vision</button></center>
<script>
let rant = false;
function toggleRant() {
    if (rant) {
        let elems = [ ...document.getElementsByClassName("rant-on") ];
        for (let i = 0; i < elems.length; i++) {
            let elem = elems[i];
            elem.classList.remove("rant-on");
            elem.classList.add("rant-off");
        }
        rant = false;
    } else {
        let elems = [ ...document.getElementsByClassName("rant-off") ];
        for (let i = 0; i < elems.length; i++) {
            let elem = elems[i];
            elem.classList.remove("rant-off");
            elem.classList.add("rant-on");
        }
        rant = true;
    }
}
</script>

It turns out that _rust-analysis_ is not the same as _rust-analyzer_, and you need the second one. And neither `rustup` nor our Rust package actually install it, nor is it available with `cargo install`. In fact, you have to [manually install it](https://rust-analyzer.github.io/manual.html#installation). <span class="rant-off">The Rustic instructions don't mention this, of course, so I had to spend an hour Googling it.</span>

[An issue has been filed](https://github.com/brotzeit/rustic/issues/403) about this<span class="rant-off"> (and summarily ignored)</span>.

## Emacs Config

Now to the Emacs config. I use [`Rustic`](https://github.com/brotzeit/rustic), which purports to be an upgrade to `rust-mode`<span class="rant-off"> and claims to set up dependencies automatically (although it doesn't, which is why we needed the above section)</span>.

```elisp
;; Enhanced Rust mode with automatic LSP support.
(use-package rustic
  :config
  (setq
   ;; eglot seems to be the best option right now.
   rustic-lsp-client 'eglot
   rustic-format-on-save nil
   ;; Prevent automatic syntax checking, which was causing lags and stutters.
   eglot-send-changes-idle-time (* 60 60)
   )
  ;; Disable the annoying doc popups in the minibuffer.
  (add-hook 'eglot-managed-mode-hook (lambda () (eldoc-mode -1)))
  )
```

It doesn't look like much, but it took me hours to get that right.

I use `eglot`, because the alternative, `lsp-mode`, was breaking for some of my <span class="rant-off">(simple)</span> Rust projects<span class="rant-off">, and I couldn't figure out why after a couple of hours of looking into it</span>. `eglot` seemed stable, at least.

```elisp
rustic-lsp-client 'eglot
```

[Here](https://github.com/joaotavora/eglot/issues/180#issuecomment-445576688) is a post from the maintainer of `eglot` explaining why his package is better than `lsp-mode`. I agree with it. <span class="rant-off">Personally, my experience with `lsp-mode` was awful, but YMMV.</span>
{: .update}

Next, I disabled the automatic code checking, which would run as I typed. This was causing a lot of lag and stutters, all of which was seriously interfering with my programming. <span class="rant-off">This should be an easy thing to turn off, but there's no option for it.</span> The best we can do is increase the delay; the code checking still runs on save.

```elisp
eglot-send-changes-idle-time (* 60 60)
```

Finally, I needed to disable the doc popups in the minibuffer as they were <span class="rant-off">_extremely_</span> distracting. <span class="rant-off">Again, it took lots of googling to get this right because there was no obvious way to do this.</span>

```elisp
(add-hook 'eglot-managed-mode-hook (lambda () (eldoc-mode -1)))
```

## Conclusion

<span class="rant-off">Looking back, maybe I should have just stuck with `rust-mode`. But </span>I am happy with the features I have now: code-completion, jump-to-definition, and syntax-checking on save. They work really well, and after some configuration they don't get in the way.

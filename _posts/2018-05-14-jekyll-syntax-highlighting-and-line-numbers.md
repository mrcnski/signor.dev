---
title: "Jekyll: Syntax Highlighting And Line Numbers"
date: 2018-05-14
categories: blogging css jekyll
toc: true
description: "Syntax highlighting that looks nice."
post-no: 2
related: [1]
---

* Table of contents.
{:toc}

Hello! Welcome back to my series of articles about [Jekyll](https://jekyllrb.com). Today's post is for all the programmers out there who want to include source code on their blogs. The topic? Syntax highlighting that looks nice.[^research]

[^research]: I wanted to write about this topic because existing blog posts provided poor or incorrect suggestions. To be fair, the [Jekyll docs](https://jekyllrb.com/docs/home/) barely mention syntax highlighting and the [kramdown docs](https://kramdown.gettalong.org/options.html#option-syntax-highlighter), if you even know they exist, are incomplete and outdated.

I'll assume you're using Jekyll with the default Markdown converter **kramdown** and syntax highlighter **Rouge**. I also talk about Pygments in this article, although I recommend against using it.

## The Basics

First, let's cover the absolute basics. How do you highlight source code? You have several methods at your disposal.

### Highlighted code block

{% highlight rust linedivs %}
let hi = "Hello.";
println!("{}", hi);
{% endhighlight %}

Did you see it?! That, my friends, was a wild *highlighted code block* in its natural habitat. How do you tame this majestic beast? Let me show you:

{% highlight liquid linedivs %}
{% raw %}{% highlight lang %}
[code]
{% endhighlight %}{% endraw %}
{% endhighlight %}

where `lang` is [one of these language codes](https://github.com/jneen/rouge/wiki/List-of-supported-languages-and-lexers). Not so hard, you just need to type out the `highlight` Liquid tag.

"What about GitHub-style code blocks?" No problem. The format looks like this:

{% highlight markdown linedivs %}
```html
<p>Here's some HTML for you.</p>
```
{% endhighlight %}

It's also possible to use three tildes instead of backquotes, because some people like to hold the Shift key.

It doesn't seem like there is any way to generate line numbers using the GitHub format, which is a shame because it's quicker to type and easier to read. So if you want line numbers, you'll have to stick to the ugly Liquid tags -- you can cut down on the typing with something like Yasnippet for Emacs.
{: .note }

### Highlighted inline code

By default, highlighted inline code blocks are not supported in Jekyll. I used a simple plugin to enable them, which I downloaded from [here](https://github.com/bdesham/inline_highlight) and put in my `_plugins` folder. The result looks like this: {% ihighlight rust %}println!("Hello.");{% endihighlight %}. How I did that: {% highlight liquid %}{% raw %}The result looks like this: {% ihighlight rust %}println!("Hello.");{% endihighlight %}.{% endraw %}{% endhighlight %}

The basic format for this Liquid template is

{% highlight liquid %}
{% raw %}{% ihighlight lang %} ... {% endihighlight %}{% endraw %}
{% endhighlight %}

Note that it's `ihighlight` and not `highlight`.

Why mention inline highlighting if you need a plug-in for it? Well, it's useful to have inline code that is also highlighted for the language it's in. But if you use GitHub Pages, you should be aware of the disclaimer at the top of the [Jekyll Plugins](https://jekyllrb.com/docs/plugins/) docs.

## Advanced Syntax Highlighting

Yep, we're going *advanced*. Stay calm, I'll walk you through this.

### Custom styling

Changing the styling for source code can be confusing, and hard to do without affecting another kind of code block. Remember that for each kind of highlighted code block mentioned above, there is a corresponding version that is not highlighted (like `this`).

Let's take a look at each code block's HTML representation.

**Non-highlighted inline code**, which looks like `this`, is the simplest:

{% highlight html linedivs %}
<code>
    [code]
</code>
{% endhighlight %}

**Highlighted inline code** has an additional class:

{% highlight html linedivs %}
<code class="highlight">
    [code]
</code>
{% endhighlight %}

**Non-highlighted code blocks**, which look like this:

```
printf("Hello.");
```

are represented in this way:

{% highlight html linedivs %}
<pre>
    <code>
        [code]
    </code>
</pre>
{% endhighlight %}

**Highlighted code blocks** are the most complex:

{% highlight html linedivs %}
<figure class="highlight">
    <pre>
        <code>
            [code]
        </code>
    </pre>
</figure>
{% endhighlight %}

With this in mind, I use the following scheme to style each kind of code block:

{% highlight scss linedivs %}
/* Applies to all code blocks */
pre, code {}

/* Inline code, no highlight */
code {}

/* Inline code, highlight */
code.highlight {}

/* Block code, no highlight */
pre {
    /* Style the background element */

    code {
        /* Style the code element */
    }
}

/* Block code, highlight */
figure.highlight pre {
    /* Style the background element */
    
    code {
        /* Style the code element */
    }
}
{% endhighlight %}

And that's it in a nutshell. Note that any settings you set in a least-specific selector, like {% ihighlight css %}code {}{% endihighlight %}, will take effect in a more specific selector, like {% ihighlight css %}figure.highlight pre code {}{% endihighlight %}, if you don't override or reset it.

### Highlighter themes

Syntax highlighters like Rouge work by wrapping each source code element in `span` classes. For example, the code block below contains three `span` tags: a red `.kt`, a purple `.n`, and a `.p` with the default color (using my highlighter theme):

{% highlight java %}
int x;
{% endhighlight %}

Here it is in HTML:

{% highlight html %}
<span class="kt">int</span> <span class="n">x</span><span class="o">;</span>
{% endhighlight %}

Since these `span`s have classes, we can easily style them using CSS. Let's change the color of `int` above:

{% highlight css %}
.highlight .kt { color: blue } /* Keyword.Type */
{% endhighlight %}

The result will look like this:
{: #c-example }

{% highlight java %}
int x;
{% endhighlight %}

The `.highlight .kt` syntax is a selector that means "pick any `.kt` class that is a descendant of `.highlight`". So this will work regardless of whether you are using inline-highlighting or block highlighting, which have different HTML representations but are both wrapped in a `.highlight` class (see above).

Of course, you probably want to download a theme rather than make your own. You can find ready-made themes [on GitHub](https://github.com/jwarby/jekyll-pygments-themes). They are compatible with Rouge, despite being made for Pygments (a Python-based syntax highlighter).

The theme used on this site was made by yours truly -- download it [here](https://github.com/mrcnski/nimbus-pygments). It's based on my Emacs theme [Nimbus](https://github.com/mrcnski/nimbus-theme).
{: .note }

### Language-specific highlighting

You can override the highlighting settings per language, which can be pretty useful if you have neuroticism and time on your hands.

For example, with my default highlighting settings, a Liquid code block would look like this:
{: #liquid-example }

{% highlight liquid %}
{% raw %}{% include post.html %}{% endraw %}
{% endhighlight %}

I didn't like the tag openers (`{% raw %}{%{% endraw %}` and `{% raw %}%}{% endraw %}`). Examining the element for `{% raw %}{%{% endraw %}`,[^devtools] I saw it has the class `.p`, which Rouge assigns to punctuation. Usually I don't want to highlight this class, but I made an exception for Liquid:

[^devtools]: Your browser's dev tools can save a lot of time when examining elements.

{% highlight css linedivs %}
/**
 * Language-specific settings
 */

.language-liquid .p {
    color: green;
}
{% endhighlight %}

So it looks like this:

{% highlight liquid %}
{% raw %}{% include post.html %}{% endraw %}
{% endhighlight %}

## Line Numbers

Line numbers. What should have been easy turned out to be a royal pain in the bupkis.[^line] I'll take you along an abbreviated version of the journey I went through so that you understand how I arrived at my current method. If you want to skip the explanation, head over to the [Code](.#the-final-code) section.

[^line]: Apart from looking nice, line numbers are useful for referring to specific lines of code. I've heard some people say that line numbers are unnecessary and distract from the source code. Please, don't be one of those people.

### Goodbye, Rouge Tuesday

The naïve way to turn on line numbers with Rouge is to add the `linenos` parameter to the `highlight` Liquid tag:

{% highlight liquid linedivs %}
{% raw %}{% highlight php linenos %}
...
{% endhighlight %}{% endraw %}
{% endhighlight %}

However, as pointed out [on this page](https://hydejack.com/docs/writing/#adding-code-blocks), this is not a good idea for various reasons. To quote the page:

> DO NOT use Jekyll’s `{ % highlight % }` ... `{ % endhighlight % }` syntax, especially together with the `linenos` option. The generated `table` to render the line numbers does not have a CSS class or any other way of differentiating it from regular tables, so that the styles above apply, resulting in a broken page. What’s more, the output from `highlight` tags [with the linenos option] isn’t even valid HTML, nesting `pre` tags inside `pre` tags, which will in break the site during minification.

So if you stick with the `linenos` option, you have to use unwieldy workarounds to avoid the above problems. The recommendation by the above page is to just use the GitHub-style format, which supports highlighting but not line numbers. Clearly, this format doesn't fit our needs.

Additionally, there was a bug in either Rouge or Jekyll that was completely breaking my pages when I used the `linenos` option. My problem seemed one that was [already reported](https://github.com/jekyll/jekyll/pull/3435) and fixed, and yet I was running into an identical issue despite using the latest Jekyll version.

After bumping my head on this for a while, I decided to give Pygments a try.

### Pygments *(optional section)*

As of this writing, Rouge is the default syntax highlighter for Jekyll. The highlighter used to be a different program called Pygments, but Pygments is written in Python and it was awkward to call it from Jekyll, a Ruby program. Although Jekyll has switched away from Pygments, you can still opt to use it.

To use Pygments, first add the `pygments.rb` gem to `Gemfile`:

{% highlight ruby %}
gem "pygments.rb"
{% endhighlight %}

and then make sure you have these lines in your `_config.yml`:

{% highlight yaml linedivs %}
markdown: kramdown
kramdown:
  syntax_highlighter: pygments
highlighter: pygments
{% endhighlight %}

Code highlighting mostly functions similarly whether you pick Rouge or Pygments, and even color themes work interchangeably between the two. You don't need to update your Liquid tags when switching to Pygments -- the format is still `{% raw %}{% highlight lang linenos %}{% endraw %}`.
{: .note }

Now you can use the `linenos` option. Voila! Beautiful line numbers! But you'd need to do a bit of work to make them look good and not be selectable (i.e. when copying from source code blocks). I won't focus on this solution too much, but if you want to use Pygments, the code later on in the post should be helpful to you.

Using `linenos` with Pygments, the line numbers are placed in `span` blocks like the rest of the highlighted source code. This means that we can't use CSS selectors, such as `:last-of-type`, to select, say, the last line number and give it a bottom border. Keep this in mind before you choose to use this solution.
{: .note }

To get to the point: I wasn't too happy with Pygments. It supports a few more languages than Rouge but doesn't produce as nice-looking or context-aware syntax highlighting. For example, here is some YAML highlighted with Pygments:
{: #yaml-example }

{% highlight yaml linedivs %}
kramdown:
    input: GFM
{% endhighlight %}

Now here is the Rouge version:

{% highlight yaml linedivs %}
kramdown:
    input: GFM
{% endhighlight %}

This may not seem significant in itself, but I found Rouge to produce better output for *every* language I tried. So, I waved bye-bye to `pygments.py` and stuck with Rouge.

### Line anchors *(optional section)*

Now, if I were to use Pygments, I would have the option to output *line anchors*, using a CSS counter to generate line numbers for the anchors on each line. There is a nice blog post by [Drews Ilcock](https://drewsilcock.co.uk/proper-linenumbers) that explains this technique.

In theory, line anchors should allow linking to specific line numbers (that's what anchors are for), but if you have more than one code block then you'll have anchors with duplicate names. Not only does this mean that linking to line numbers would be broken, duplicate anchors are also technically [not valid HTML](https://www.w3.org/TR/html4/struct/links.html#h-12.2.1):

> Anchor names must be unique within a document. Anchor names that differ only in case may not appear in the same document.

Sorry, Drews Ilcock.

### Giving up the gun

Since the Rouge `linenos` parameter was broken and I had ruled out line anchors, I was back at square one. I realized that in order to have both line numbers and good syntax highlighting with Rouge, I would need to do some hacking.

I looked at Rouge's source code to see if there was any way to do something like line anchors, but without the anchors. Internally, Rouge uses something called a *formatter* to, uh, *format* the code as it goes through syntax highlighting. Turns out, Rouge does have a formatter that, instead of generating anchors before each line, wraps each line in its own div. All I had to do was to enable this formatter from the `HTMLLegacy` formatter used by Jekyll by default.

Okay, I won't bore you with more details. All you need is to install [this plugin](https://github.com/mrcnski/highlight-linedivs). Don't worry, it's not a virus. It's safe to install, I swear on my honor. Really!

### The final code

First, make sure you have the [highlight-linedivs](https://github.com/mrcnski/highlight-linedivs) plugin installed. It's important.

Now, any time you want source code to have line numbers, you just need to include the `linedivs` option:

{% highlight liquid linedivs %}
{% raw %}{% highlight lang linedivs %}
...
{% endhighlight %}{% endraw %}
{% endhighlight %}

Easy, right? Time for the CSS code.

{% highlight scss linedivs %}
/* Block code, highlight */
figure.highlight pre {
    /* ... */

    code {
        /* ... */

        /* Use a counter to generate the line numbers */
        counter-reset: code; 

        .div {
            /* Increment the counter for each div */
            counter-increment: code;

            &:before {
                content: counter(code);

                /* Hacky, but necessary. Without these lines, single-digit line 
                /* numbers will not line up with double-digit ones. Change width
                /* to suit your font. */
                width: 16px;
                text-align: right;

                /* Add a nice border */
                display: inline-block;
                padding-right: 0.25em;
                border-right: 1px solid gray;
            }
        }
    }
}
{% endhighlight %}

How does this work? Elementary, dear reader: we generate the line numbers using a CSS counter. Content generated by CSS happens to be unselectable, so the hard part is just alignment and styling.

You may notice on Safari or some older browsers that the line numbers are highlighted when you select the code. That's not supposed to happen with CSS-generated text, but apparently this rule (like many other CSS laws) may not always be followed. This is a visual bug, as the code won't be copied/pasted, but it would be nice to fix it for the benefit of dummies who use Safari:

{% highlight scss linedivs %}
.div {
    /* ... */
    
    &:before {
        /* ... */

        /* For older browsers and Safari */
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
}
{% endhighlight %}

Oh yeah, and if you want to get top and bottom borders for line numbers you'll have to do something like this:

{% highlight scss linedivs %}
div {
    /* ... */
    
    &:before {
        /* ... */
        
        padding-left: 0.625em;
        border-left: 1px solid gray;
    }
    &:first-of-type::before {
        padding-top: 0.25em;
        border-top: 1px solid gray;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
    }
    &:last-of-type::before {
        padding-bottom: 0.25em;
        border-bottom: 1px solid gray;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
    }
}
{% endhighlight %}

Which might look like this:
{: #borders-example }

{% highlight java linedivs %}
int x = 0;
int y = 1;
System.out.println("YAHOOOOO!!!");
{% endhighlight %}

(Notice that I gave enough room for the line numbers to grow when they hit double-digits. (I don't think there's any way for the padding to dynamically grow in CSS.) I also gave the corner borders a radius.) Fancy!

## Language Display

Wow. Did you actually read the whole post up until this point? That's impressive, and kind of sad.

Last tip before I let you go: it's a nice thing to include the name of the programming language along with source code in order to avoid confusing readers. Fortunately, it's pretty easy to do this programmatically with Rouge since it inserts a `data-lang` attribute, containing the name of the language, into the code element. This is all you need to do to access the attribute's value:

{% highlight scss linedivs %}
code {
    /* ... */
    
    &[data-lang]::before {
        content: attr(data-lang);
        
        /* Do styling and positioning */
    }
}
{% endhighlight %}

How you position the language name is up to you. For example, you can use {% ihighlight css %}display: block;{% endihighlight %} which will put the language on its own line.

You can also do what I do and use absolute positioning to place the language name in a specific location relative to the code block itself. If you go with this option, you should position the name relative to the outermost `figure` element:

{% highlight scss linedivs %}
/* Block code, highlight */
figure.highlight {
    position: relative;

    pre {
        /* ... */

        code {
            /* ... */
            
            /* Display language name */
            &[data-lang]::before {
                /* ... */
                
                position: absolute;
            }
        }
    }
}
{% endhighlight %}

If you instead put {% ihighlight scss %}position: relative;{% endihighlight %} under `pre`, then the language name will move when the code is scrolled.

## Conclusion

Hope you enjoyed this brief overview of syntax highlighting in Jekyll. Please leave a comment below if you have any questions or comments! Thank you for your attention -- bye.

## Notes


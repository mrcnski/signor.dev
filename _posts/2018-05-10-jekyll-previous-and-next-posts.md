---
title: "Jekyll: Previous and Next Posts"
date: 2018-05-10
categories: blogging face-offs web-dev
---

What's up? Welcome to a series of articles I'm writing about [Jekyll](https://jekyllrb.com), the static blog generator. I had trouble customizing this blog due to the lack of good Jekyll resources online, so I had no choice but to go into super-genius mode and figure it all out myself. Now I want to share my methods with you.

This post is about the very first thing I implemented for this blog: links to the previous and next posts. I had initially used [David Elbe's method](http://david.elbe.me/jekyll/2015/06/20/how-to-link-to-next-and-previous-post-with-jekyll.html), which for some people might be *good enough*, but has some glaring problems -- I personally wasn't satisfied with it. Since this and other solutions I found on Google were suboptimal, I came up with my own method and I wanted to share it.

## The Goal

At the bottom of each of my posts you'll find links to the previous and next posts. This is what they look like:[^change]

{% include image.html name="next-and-prev.png" alt="Next and previous posts." width="521" %}

Neat, huh? I'll present the code in the next section, while those hungry for knowledge can follow along with the [Explanation](.#explanation). If this isn't exactly what you're looking for, don't worry; my method is easily extensible as it makes use of CSS flexbox.

If you're wondering why it's important to do this correctly, please see [this image](/assets/img/evil-layout-clown.png).[^source]
{: .note }

[^source]: Source: screenshot of [Syntax Highlighting](http://www.leancrew.com/all-this/2010/12/syntax-highlighting/). Viewing this site in a small browser window resulted in hilarious misalignments.

## The Code

I know some of you just want to see the code, so I won't keep you waiting.

The **HTML**, which goes in your post layout:

{% highlight html linedivs %}
{% raw %}<div class="post-nav">
  <div>
    {% if page.previous.url %}
    <a href="{{page.previous.url}}">&laquo;&nbsp;{{page.previous.title}}</a>
    {% endif %}
  </div>
  <div class="post-nav-next">
    {% if page.next.url %}
    <a href="{{page.next.url}}">{{page.next.title}}&nbsp;&raquo;</a>
    {% endif %}
  </div>
</div>{% endraw %}
{% endhighlight %}

And the **CSS:**

{% highlight css linedivs %}
.post-nav {
    /* Insert your custom styling here. Example: 
      
       font-size: 14px;
       margin-bottom: 1em;
    */    
    display: flex;
}
.post-nav div {
    /* flex-grow, flex-shrink, flex-basis */
    flex: 1 1 0;
}
.post-nav-next {
    text-align: right;
}
{% endhighlight %}

Simple, no? But how does this work?

## Explanation

Let me start by demonstrating why David Elbe's solution is subpar. I don't mean to pick on him, but his page was one of the first hits on Google and it's important that people know why they shouldn't use his method. Feel free to visit his article (linking it again [here](http://david.elbe.me/jekyll/2015/06/20/how-to-link-to-next-and-previous-post-with-jekyll.html)) and try out the code. 

You may notice the following:

* The links are set to `display: block;` with a `width` of 50%. This ostensibly aligns the links and stops either one from taking up more than half the page, but it's a bad move: all the whitespace between the two snippets of text acts as part of the links:

[^change]: Note that the appearance of this site may have changed since the screenshots in this post were taken.

{% include image.html name="huge-link.png" alt="Oh dear." width="522"
    caption="Oh dear."
%}

* The CSS is unnecessarily complicated. Compare it to the final CSS of my solution, shown above. If you ignore `font-size` and `margin` (which are optional), it's eight lines versus three. David's solution is hard to understand, brittle, and difficult to modify without it falling apart.

* Since there is no "previous" link on the first page of a blog, the "next" link appears on the left of the page. (This is easily fixed, as a commenter on David's article has pointed out.)

* It doesn't use hard spaces (also an easy fix).

After futilely trying to modify David's solution to fix the "whitespace-link" problem, I looked deep into myself. The answer came to me in a vision: flexbox.

### Flexbox

Flexbox is seriously cool. It works by specifying a *flex container* (i.e. a containing div) as well as *flex items* (i.e. contained divs, which participate in the flex layout). The cool thing about it is the amount of configuration options for the layout, making almost any layout possible -- hence why flexbox is short for "flexible box".

For our purposes, the only flexbox code you need is `display: flex;` for the wrapper div (setting it up as a flex container) and `flex: 1 1 0;` for the inner divs. *That's it!*

{% highlight css linedivs %}
.post-nav {
    display: flex;
}
.post-nav div {
    flex: 1 1 0;
}
{% endhighlight %}

Holy cow! Wait a second, what on Earth does `flex: 1 1 0` mean? Well, these values correspond to `flex-grow`, `flex-shrink`, and `flex-basis` respectively.

Allow me to explain. (You can also visit [this great page](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) for more info).

* `flex-grow` specifies what proportion of available space in the container each item should take, after the initial sizing of the items. For example, if there are two inner divs, with `flex-grow` values of `1` and `2`, the second one will take up two-thirds of any leftover space.

* `flex-shrink` determines how much an item will shrink relative to the others when there is *too little* space for the items.

* `flex-basis` specifies the initial size of a flex item, before applying the two flex factors above. We set it to `0` so that the grow and shrink factors do all the work. If we were to set `flex-basis` to `auto` instead, the initial size would be determined by the length of the links, but I want them to always take up equal space.

Why not set these properties individually instead of using the cryptic `flex: 1 1 0`? Well, this will set the other flex values intelligently, and is the recommended way, I think. I'm not a web developer, okay?

So here's what we get when we align the "next" link. `.post-nav` is the containing div while `.post-nav-next` is the inner div we want on the right.

{% highlight css linedivs %}
.post-nav {
    display: flex;
}
.post-nav div {
    flex: 1 1 0;
}
.post-nav-next {
    text-align: right;
}
{% endhighlight %}

Yawn... it's too easy, actually.

Now that we have the CSS, let's modify David's HTML (renaming some classes while we're at it) so that there are a container div and two contained divs:

{% highlight html linedivs %}
{% raw %}<div class="post-nav">
  <div>
    {% if page.previous.url %}
    <a href="{{page.previous.url}}">&laquo; {{page.previous.title}}</a>
    {% endif %}
  </div>
  <div class="post-nav-next">
    {% if page.next.url %}
    <a href="{{page.next.url}}">{{page.next.title}} &raquo;</a>
    {% endif %}
  </div>
</div> {% endraw %}
{% endhighlight %}

You can use the &larr; and &rarr; [special characters](https://www.w3schools.com/html/html_symbols.asp) instead (`&larr;` and `&rarr;`).

Note that we've already taken care of the alignment issue which David's solution had. On the first page of a blog, his solution wouldn't generate the div for the "previous" link at all, and the "next" link would appear on the left. But here, since the Liquid if-statements are *inside* the divs, the two divs will always exist and be aligned exactly as specified by flexbox, even if we don't generate a previous or next link.

We're done, right? Not quite.

### Adding hard spaces

David Elbe's solution fails to account for the following situation,[^hard] where the arrows end up on a separate line when there is no space for the entire link:

[^hard]: This section is entirely optional -- some people may not mind the arrow on its own line.

{% include image.html name="no-hard-space.png" alt="No hard space" width="474" %}

This is easily fixed by using [hard spaces](https://en.wikipedia.org/wiki/Non-breaking_space), which force the arrows and the adjacent word to be considered as a single "word" of text, preventing a line break. Here's what it looks like once we add the hard-space, the HTML code for which is `&nbsp;`.

{% include image.html name="yes-hard-space.png" alt="Yes hard space" width="474" %}

So this is the final HTML:

{% highlight html linedivs %}
{% raw %}<div class="post-nav">
  <div>
    {% if page.previous.url %}
    <a href="{{page.previous.url}}">&laquo;&nbsp;{{page.previous.title}}</a>
    {% endif %}
  </div>
  <div class="post-nav-next">
    {% if page.next.url %}
    <a href="{{page.next.url}}">{{page.next.title}}&nbsp;&raquo;</a>
    {% endif %}
  </div>
</div>{% endraw %}
{% endhighlight %}

Or is it?

## Advanced Usage

Huh? "Advanced Usage"? What's this about?

Turns out, I lied -- the code I presented above is only a simplified version of what I use. My **HTML** is more like this:

{% highlight html linedivs %}
{% raw %}<div class="post-nav">
  <p>
    {% if page.previous.url %}
    <a href="{{page.previous.url}}">&#8672;&nbsp;{{page.previous.title}}</a>
    {% endif %}
  </p>
  <p>
    {% if page.next.url %}
    <a href="{{page.next.url}}">{{page.next.title}}&nbsp;&#8674;</a>
    {% endif %}
  </p>
</div>{% endraw %}
{% endhighlight %}

And my **CSS** is really:

{% highlight css linedivs %}
.post-nav {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}

.post-nav p {
    flex: 1 1 0;
    width: 45%;
}

.post-nav p:first-child {
    padding-right: 0.5em;
}

.post-nav p:last-child {
    padding-left: 0.5em;
    text-align: right;
}
{% endhighlight %}

What the devil is going on here?

Listen. The first thing I did here was replace the inner divs we had before with `p` tags. Then, instead of giving the second `p` a class like with the second div before, I used the `p:last-child` [selector](https://www.w3schools.com/cssref/css_selectors.asp) to apply `text-align: right`.

*Clapping starts.*

There's more. I added a `width` limit to the `p` tags so that neither link can take up the entire half of the line. I had to add `justify-content` with a value of `space-between` so that the flex row, now consisting of limited-width divs, would take up the whole line. I also stuck some slight padding between the two `p` tags so that they never got right next to each other even when the page was small or the links were big.

*Clapping intensifies.*

Hold on! That's all fine and dandy, but what about when the page is extra small? Well, that's why I added `flex-wrap: wrap`: the "next" link goes below the "previous" link, but only when there is absolutely no space left on the line!

*Clapping builds to a climax.*

Am I amazing or what? Such is the power of neuroticism.

There are all kinds of crazy things you can do now, like putting another link between the two we already have (a link to the top of the page, for instance) and using the `:nth-child()` selector to style and align it. With Flexbox, this kind of control is not just possible, but straightforward.

## Conclusion

Wow! Flexbox is cool, huh? It makes some concise, correct, and awesome solutions possible.

You may be wondering if there are any downsides to Flexbox. Kind of: flex parameters and their interactions can be confusing to the uninitiated, but I think the clarity of our solution compares rather favorably to David's (which uses other convoluted CSS constructs such as floats). There are also plenty of [fantastic guides](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox) out there that will make you a Flex Master in no time.

I hope you enjoyed this post. See you next time!

## Notes

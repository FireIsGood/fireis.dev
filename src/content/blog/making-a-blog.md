---
title: "Making a Blog"
description: "But why?"
pubDate: "2024 04 24"
cover: "@/images/making-a-blog-thumb.jpg"
---

I wanted to make a blog, so I did!

Previously, I tried making [a](https://fireisgood.github.io/astro-testing-site/)
[few](https://fireisgood.github.io/learning-svelte-site/) [websites](https://fireiswebsite.netlify.app/)
[for](https://fireisgood.github.io/fancy-text/) [testing](https://fireisgood.github.io/astro-testing/)
[things](https://fireisgood.github.io/fish-quiz/), but none of them had quite the right vibe and ease of use to be an
actual blog. After checking out the Astro blog template, I found that it did a ton of the back end stuff I was dreading.
It had the basic `content` setup from the new version of Astro as well as some nice type checked frontmatter I hadn't
set up on my previous website setup attempt. There was also the basic markdown blog format which I would have had to
reinvent myself.

## Setting It Up

All that being said, I ran into a differences in style preferences with the version out of the box. The template used
some random global style sheet that I didn't really feel was clean enough and the layout was a bit off from what I
wanted. To fix, this I ripped everything out and started with a base of [Pico CSS](https://picocss.com/)&mdash;my
favorite CSS mini-framework.

From there, I was able to relatively easily just go wild with my styles knowing I had clean and semantic defaults to
rely on. As usual with my website styling, I threw on the basic max width and card-ish setup. This website has a `960px`
max width, though I have used `1080px` or other random widths for other sites. I also decided to try out a newer trick
with the body to force the footer to stick to the bottom of the screen.

## Suffering

The unavoidable problem with CSS is that you will _always_ find some new jank to cut yourself on. Today's lesson was on
the `display: grid` property and its interaction with specifically the `<pre>` block. When I was trying to check on the
included markdown mini tutorial, I found that the block size code blocks were overflowing&mdash;but not where I
expected! For some strange reason, it was pushing the `<body>` to be larger than the window when its parent clearly had
`overflow-x: auto` set!

Oh dear, oh my!

After some quick searching, I found a [CSS Tricks article](https://css-tricks.com/preventing-a-grid-blowout/) with the
solution. As it turned out, the issue was something to do with the fact that the default for each grid direction said
that the minimum size should be `auto`, so content inside would poke out of the viewport. The fix was some evil hack
using `minmax()` to tell it that it can go down to 0 pixels wide if it needs to.

CSS never fails to get you...

```css
body {
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: minmax(0, 1fr); /* Evil grid bug */
}
```

## We Are So Back

After that, it wasn't actually that difficult to clean up the styles and other fun stuff. I added in a theme switcher
that I developed while working on re-styling [Good Questions](https://radian628.github.io/good-questions/). It worked
pretty well, but after I added View Transitions, it broke. I had to set up some event listeners and timeouts in a
slightly janky way to get it back up and working cleanly.

![View Transition example](../../images/view-transition-example.gif)

After setting this up, I spent a while working on cleaning up the UI and adding more comfy features like breadcrumbs and
fixing up the slightly hacky title setup I had.

## Reflection

Overall it wasn't too hard to set up. I would probably recommend this to other mid-level web developers. For a very
basic personal site to new web developers, I would instead recommend learning the basics of setting up your own basic
website starting from the Visual Studio Code emmet preset you get from `!`. It's a decent place to start learning how to
write semantic things and it also just makes me happy to not deal with the feature creep of a framework.

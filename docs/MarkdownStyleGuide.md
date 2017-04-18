# Markdown Style Guide

A loose style guide for using Markdown to write content for vets.gov.

## Our Markdown dialect

vets.gov uses [Jekyll](http://jekyllrb.com) to parse [Markdown](http://daringfireball.net/projects/markdown/) documents into HTML files. Jekyll relies on the [kramdown](http://kramdown.gettalong.org/parser/kramdown.html) Markdown parser and supports an that mixes **GitHub-flavored Markdown** and **PHP Markdown Extra.** 

- [Guide to Kramdown-specific Markdown syntax](http://kramdown.gettalong.org/syntax.html)
- [Original Markdown specification](https://daringfireball.net/projects/markdown/syntax)

## Mixing Markdown and HTML

General rule: **Don't.**

Markdown files _can_ contain HTML. Doing so, however, makes it harder to read and write Markdown by breaking the syntax highlighting of most text editors. 

Kramdown's syntax extensions means that it is _rarely_ necessary to use HTML elements. We should almost _never_ see `<br>` or `<hr>` elements in our Markdown files. Use a single line return or `-----` instead. 

## How-tos

- [Add a call-out box](AddCallOutBox.md)
- [Adding attributes, including `class` and `id`](AddingAttributes.md)
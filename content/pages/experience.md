---
layout: experience.html
body_class: index
title: Vets.gov Experience
---
<div id="experience" class="{{ id }}" role="main">
<div class="splash splash--blog">
<h2 class="va-headingflag"><a href="/experience/">Experience</a></h2>
</div>
<div class="primary">
<div class="row">
<div class="small-12 medium-8 medium-offset-4 large-offset-2 small-centered columns">
<div class="post">
<!-- This loops through the paginated posts -->
{% for post in posts %}
<h3 class="title"><a href="/{{ post.path }}">{{ post.title }}</a></h3>
<div class="meta">
<div class="post-author"><span class="sr-only">Author: </span>{{ post.author }}</div>
<div class="post-date"><span class="sr-only">Post date: </span>{{ post.date | date: '%b %d, %Y' }}</div>
</div>
<div class="post-preview">
<div class="content">

{{ post.excerpt }}

{% if post.tags contains "shortpost" %}
{% else %}
<a href="/{{ post.path }}">Read more...<span class="sr-only"> on this blog post: &ldquo;{{ post.title }}&rdquo;</span></a>
{% endif %}
</div>
</div>
{% endfor %}
</div>
</div>
</div>
</div>
</div>

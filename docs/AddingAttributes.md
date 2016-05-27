# Adding `id` attributes to headings

Our Jekyll instance is configured to auto-generate `id` attributes for section headings -- those lines that begin with `#` through `######`. 

It's possible, however, to override this using syntax similar to what's below:

     # This is a heading {#this-is-an-id}
     
That will generate the following HTML:

	<h1 id="this-is-an-id">This is a heading</h1>

> **NOTE:** _This particular syntax only applies to headings._

## Adding `id` or `class` attributes to headings, paragraphs, lists, or blockquotes

You can also add a `class` or `id` attribute to most headings, paragraphs, lists, and blockquotes. The syntax is slightly different than that for adding an `id` to headings. For example, to add a `class` attribute to a heading use the syntax below.

	## Lorem ipsum dolor sit amet
	{:.divider}
	
This will compile like so.

	<h2 class="divider">Lorem ipsum dolor sit amet</h2>
	
The class or id attribute value: 

- must be **placed on a new line**.
- must **not** be preceded by a blank line.

Adding an `id` attribute value is similar. Just use an `id` instead of a `class`.

	This is an example paragraph to show how we can add an
	id attribute.
	{:#myid}
	
This becomes:

	<p id="myid">This is an example paragraph to show how we 
	can add an id attribute.</p>
	
Yes, it is possible to add multiple `class` attribute values, or `class` and `id` attribute values in one go.

	- List item 1
	- List item 2
	- List item 3
	{:.process .fadein #what-to-do}
	
Becomes:

	<ul class="process fadein" id="what-to-do">
  		<li>List item 1</li>
  		<li>List item 2</li>
  		<li>List item 3</li>
	</ul>
	
## Adding `id` or `class` attributes to list items

To add an attribute to en entire list, use the examples above. To add an attribute to an item _within_ that list, add it to the beginning of the line, after the `-`, `*`, or item number.

	1. {:.step1} Take this first step.
	2. Then take this second step.

Becomes:
	
	<ol>
		<li class="step1">Take this first step.</li>
		<li>Then take this second step.</li>
	</ol>

The same goes for definition list definitions. None of this works for definition terms.

	supercilious
	: {:.def1} having or showing the proud and unpleasant
	 attitude of people who think that they are better or 
	 more important than other people
	
Becomes:
	
	<dl>
		<dt>supercilious</dt>
		<dd class="def1">having or showing the proud and
		unpleasant attitude of people who think that they
		are better or more important than other people</dd>
	</dl>

## Adding `id` or `class` attributes to links, italicized, or bolded text

The syntax outlined above also works for links, bolded, and italicized text with one major difference. There should not be any space or new line characters between the inline element and the attribute list. 

- `**call attention**{:.important}`
-  `[Veterans Administration](http://va.gov/){:.external}`
-  `_A Guide to Doing Things_{.title}`  

Will become:

- `<b class="important">call attention</b>`
- `<a href="http://va.gov/" class="external">Veterans Administration</a>`
- `<em class="title">A Guide to Doing Things</em>`

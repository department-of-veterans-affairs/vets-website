# Add a call out box

Adding a call out box to a Markdown document is easy. In most cases, you should use Markdown definition list syntax. An example follows. Note that any text preceeded by `//` is a comment. Don't include comments in your Markdown file.

	Are you eligible for disability benefits?  // Question or word to define
	: Yes, if you participated in SHAD testing. // Answer or definition
	
	Who is covered
	: You and your survivors
	{:.va-callout}

Add the `.va-callout` class to the end of the call out list, as discussed in [Adding Attributes](AddingAttributes.md).

The syntax here is very specific.

- Answers / definitions should begin with `:`.
- There should be a single line break between the question or term and the answer.

The above example will produce the following HTML.

	<dl>
		<dt>Are you eligible for disability benefits?</dt>
		<dd>Yes, if you participated in SHAD testing.</dd>
		<dt>Who is covered</dt>
		<dd>You and your survivors</dd>
	</dl>

## Adding a bulleted or numbered list to a call out box.

Lists contained within a call out box must be preceded and followed by blank lines, and indented by 4 spaces. This is true whether the list is bulleted or numbered. For example:


    Are you eligible for disability benefits?
    : Yes if:

        -	You participated in Projects 112 or SHAD testing.
    
    Who is covered
    : You and your survivors

This results in the following HTML.

    <dl>
		<dt>Are you eligible for disability benefits?</dt>
		<dd>Yes if:
			<ul>
			  <li>You participated in Projects 112 or SHAD testing.</li>
			</ul>
		</dd>
		<dt>Who is covered</dt>
		<dd>You and your survivors</dd>
	 </dl>
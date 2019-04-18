# Why Is My Build Breaking?

Breaking the Jenkins build is pretty easy to do and also pretty common. Never
fear! It is also easy to fix.


## Finding out why the build is failing

Each pull request page indicates whether your commits have errors that break the build.

![What failing builds look like on GitHub](images/FailingBuild.png)

Next to the failing build message is a _Details_ link. Click it to find out what's causing the failure. It will take you to a page at jenkins.vetsgov-internal. You will need to [configure the SOCKS proxy](https://github.com/department-of-veterans-affairs/vets.gov-team/blob/master/Work%20Practices/Engineering/Internal%20Tools.md) to access this utility. Scroll down that page until you see a failure.

![What a Jenkins CI error looks like](images/JenkinsFail.png)

This will indicate what error, what file, and what line is causing a problem. **Note:** _The exact error text will vary depending on which language you are using_. 

#### A gotcha for content:

If you are adding content via Markdown files, HTML-Proofer will report errors in the _generated HTML files_. You'll need to fix the error in the corresponding Markdown file.

## Why might a build break?

Common causes of a failing build are HTML markup errors, HTML entity errors, and 
broken links. Below are some common error messages, their causes, and their fixes.

| If you see an error like this&#8230; | It's probably caused by&#8230; | To fix, do&#8230;
| --- | --- | --- 
| `Unexpected end tag` | Mismatched tags. Either the end tag is wrong (e.g. `<h4>Heading</h6>`), or the start tag is missing altogether. (e.g. `Heading</h6>`) | Check the corresponding Markdown file for that HTML page. | 
| `htmlParseEntityRef: expecting ';'` | An unescaped character. Some characters need to be escaped in HTML using a _named character reference_. Such characters include `&`, `>`, `"` and `<`. | Use an [named character reference](https://html.spec.whatwg.org/multipage/syntax.html#named-character-references) for the character in question. |
| `*  internally linking to` [path]`, which does not exist` | There's an explicit link to the wrong file. | Fix your URLs to point to the correct HTML path.
 

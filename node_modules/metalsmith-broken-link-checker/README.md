# metalsmith-broken-link-checker

[![npm version][npm-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]
[![Dependency Status][david-badge]][david-url]

[Metalsmith][] plugin to check for internal broken links

## About

Small typos can often result in *unexpected* broken links. This plugin aims to catch them as early as possible.

It checks for *relative* and *root-relative* links which do not have a corresponding file in the Metalsmith pipeline. It (currently) ignores all *absolute* links.

Any broken links will cause an `Error` to be thrown (or a warning to be printed if `options.warn` is set). 

By default, all `href` attributes of `<a>` tags and all `src` attributes of `<img>` tags are checked. 

This plugin uses [cheerio](https://www.npmjs.com/package/cheerio) to find link and image tags and [urijs](https://www.npmjs.com/package/urijs) to manipulate URLs. 

I also wrote a [blog post about what I learned developing this plugin](https://davidxmoody.com/publishing-my-first-npm-package/).

## Example

In your Metalsmith source dir, you have the following file (`dir1/test-file.html`):

```html
<!DOCTYPE html>
<html>
<body>

  <a href="/a.html">(Root-relative link) Error if 'a.html' not in files</a>

  <a href="a.html">(Relative link) Error if 'dir1/a.html' not in files</a>
  <a href="./a.html">(Relative link) Error if 'dir1/a.html' not in files</a>
  <a href="../a.html">(Relative link) Error if 'a.html' not in files</a>

  <a href="/">(Root-relative link to dir) Error if 'index.html' not in files</a>
  <a href="dir2/">(Relative link to dir) Error if 'dir1/dir2/index.html' not in files</a>

  <a href="#fragment">(Hash fragment link) Always valid</a>
  <a href="/dir2/#fragment">(Hash fragment link) Error if 'dir2/index.html' not in files</a>

  <a>Missing href attribute, always broken</a>

  <img src="testimg.jpg" alt="(Relative link) Error if 'dir1/testimg.jpg' not in files">
  <img src="/testimg.jpg" alt="(Root-relative link) Error if 'testimg.jpg' not in files">

</body>
</html>
```

Note that links to directories are allowed if they have a trailing slash (the `index.html` file will be looked for). However links to directories without a trailing slash are not allowed unless the `allowRedirects` option is set.

## Installation

```
$ npm install --save metalsmith-broken-link-checker
```

## CLI Usage

In `metalsmith.json`:

```json
{
  "source": "src",
  "destination": "build",
  "plugins": {
    "metalsmith-broken-link-checker": true
  }
}
```

## JavaScript Usage

```javascript
var Metalsmith = require('metalsmith')
var blc = require('metalsmith-broken-link-checker')

Metalsmith(__dirname)

  // Build your full site here...

  .use(blc(options))

  .build()
```

### Options

#### `allowRegex` (optional, default: *null* )

- Optional regex gets matched against every found URL
- Use it if you want to allow some specific URLs which would otherwise get recognised as broken

#### `allowRedirects` (optional, default: *false* )

- If *false* then links to directories will only be allowed if the link ends with a trailing slash (e.g. `dir1/`)
- If *true* then links to directories will be allowed with or without a trailing slash (e.g. `dir1/` or `dir1`)

#### `allowAnchors` (optional, default: *true* )

- An anchor is an `<a>` tag with a `name` attribute but no `href` attribute (used for jumping to elements on a page with hash fragments)
- For example, with `allowAnchors` set to `true`, the following would be allowed: `<a name="anchor">Anchor text</a>`

#### `checkImages` (optional, default: *true* )

- Specifies whether or not to check `src` attributes of `<img>` tags

#### `checkLinks` (optional, default: *true* )

- Specifies whether or not to check `href` attributes of `<a>` tags

#### `checkAnchors` (optional, default: *false* )

- Specifies whether or not to check the validity of hash fragments in links
- For example `file.html#someid` could link to a valid file but the file content could be missing the `someid` id or name on an element

#### `warn` (optional, default: *false* )

- If *false* then throw an `Error` when encountering the first broken link
- If *true* then print warnings to stderr for every broken link

#### `baseURL` (optional, default: *null* )

- Should start with a slash, e.g. `/base`
- Meant for sites which will be hosted within a subdirectory of another site
- For example, if the output of your Metalsmith build will be hosted at `http://example.com/base/` then links to `/base/dir/file.html` will be valid if `dir/file.html` exists in the metalsmith pipeline

## History

- **1.0.1** Add filenames to warnings
- **1.0.0**
    - CoffeeScript -> JavaScript rewrite
    - Requires Node v6+ to run (breaking change)
    - Add anchor target checking
- **0.1.11** Allow anchors with id attributes
- **0.1.10** Add baseURL option
- **0.1.9** Add CI badges to README
- **0.1.8** Add allowRedirects option
- **0.1.7** Change URIjs to urijs
- **0.1.6** Fix forward slash Windows path bug
- **0.1.5** Add allowAnchors option
- **0.1.4** Normalize file paths for Windows
- **0.1.3** Fail in the correct way for missing href attribute
- **0.1.2** Updated README
- **0.1.1** Updated README
- **0.1.0** First release

[Metalsmith]: https://github.com/metalsmith/metalsmith
[npm-badge]: https://img.shields.io/npm/v/metalsmith-broken-link-checker.svg
[npm-url]: https://npmjs.com/package/metalsmith-broken-link-checker
[travis-badge]: https://travis-ci.org/davidxmoody/metalsmith-broken-link-checker.svg
[travis-url]: https://travis-ci.org/davidxmoody/metalsmith-broken-link-checker
[david-badge]: https://david-dm.org/davidxmoody/metalsmith-broken-link-checker.svg
[david-url]: https://david-dm.org/davidxmoody/metalsmith-broken-link-checker

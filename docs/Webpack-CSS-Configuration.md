# CSS General Info

## Background
- Written in [Sass](http://sass-lang.com/) using the [SCSS](http://sass-lang.com/documentation/file.SASS_REFERENCE.html) syntax
    > There are two syntaxes available for Sass. The first, known as SCSS (Sassy CSS) and used throughout this reference, is an extension of the syntax of CSS. This means that every valid CSS stylesheet is a valid SCSS file with the same meaning. In addition, SCSS understands most CSS hacks and vendor-specific syntax, such as IE's old filter syntax. This syntax is enhanced with the Sass features described below. Files using this syntax have the .scss extension.
- Files resides in [src/sass](https://github.com/department-of-veterans-affairs/vets-website/tree/master/src/sass)
- Frameworks and libraries include:
  - [U.S. Web Design System (USWDS)](https://designsystem.digital.gov/)
    - [GitHub Repo](https://github.com/uswds/uswds)
  - [Foundation](https://foundation.zurb.com/sites/docs/v/5.5.3/)
    - Included only partially, for grid and responsive utilities
    - Using Foundation classes should be avoided as we plan to remove it eventually.
  - [Font Awesome](http://fontawesome.io/)
- Compiled to CSS using Webpack


## Directory structure
- `root/`
  - Site-wide style is defined in `style.scss`
    - Includes global imports, such as our frameworks and libraries
  - Temporary style lives in `_shame.scss`
  - Other files at the root-level are considered page-specific
  - `base/`
    - Contains site-wide styles and overrides that will be imported into `style.scss`
      - `_b-variables.scss` - site-wide colors and units, many of which are from USWDS.
      - `_va.scss` - Site-wide style declarations for global components/elements
      - `_b-breakpoints.scss` - This is used to reconcile naming conflicts and differing responsive breakpoints between USWDS and Foundation.
  - `modules/`
    - Contains site-wide styles for individual components that are generally reusable across the website.
  - Other folders
    - Generally used only for specific applications/pages of the website that are organized in a directory rather than a single file.

# Webpack/Compilation
- Sass is configured and compiled into CSS via Webpack
  - Configuration at `config/webpack.config.js`
- Website is broken into a series of entry files, one of which is the site-wide file, `style.scss`, while the rest are entry points for applications defined as `JSX` files.
- Site-wide style is compiled into `/generated/style.css`, which is linked to in the header of the website and therefore available on all pages.
- An import statement within a JavaScript file is used to include style for a specific application. You should also define your application's entry point in the `entryPoint` map of the Webpack configuration, so that your application's code and style are not included in every page. The key you use to define your application's entry point in that map will also be used as the file name for the generated JavaScript as well as CSS. Files in the content directory can then define an `entryname` property to link to those files.

## Example Application

##### config/webpack.config.js
```js
const entryFiles = {
  // ...
  'my-application': './src/js/my-application/entry.jsx'
  // ...
```

##### content/somewhere/some-application.md
```html
---
title: My Application
layout: page-react.html
entryname: my-application
---
<p> Some content</p>
<div id="react-entry"></div>
```

##### src/js/my-application/entry.jsx
```js
// Our Webpack configuration will use the file extension to determine how to handle that import, which in our case is to compile it into a CSS file.
import '../../sass/my-application.scss';
```

## Static Assets
The `root/assets/` directory is used for storing images, fonts, and other files you may want to have reside outside of the Webpack build system. During build time, the contents of that directory will be moved as-is to the build output, so `root/assets/js/something.js` will be moved to `root/build/development/js/something.js`, which means it can be linked to in the website with `/js/something.js`.

# Roadmap Ahead
- Keep up-to-date with USWDS
  - [What's New](https://designsystem.digital.gov/whats-new/)
- Foundation needs to go entirely. We should opt for the USWDS grid system or Flexbox instead.
- Reduce the shame file

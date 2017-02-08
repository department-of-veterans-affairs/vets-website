# Website Toolchain
The site is built using 2 tools: [Metalsmith](http://www.metalsmith.io/) and
[Webpack](https://webpack.github.io/) and is fully node.js stack.

Metalsmith is used as the top-level build coordinator -- it is effectively a generic
"if file changes here, run this" system -- as well as the static content genertaor. When
Metalsmith sees Javascript, it is delegated to Webpack.  Sass files are "require"ed inside
the Javascript files for the site and processed by Webpack.

## Why Metalsmith?

Metalsmith looked well supported and very flexible. There were no major technical drivers here.

## Why Webpack?

Webpack seems to have become the defacto build toolkit for Javascript and Sass. Most current
documentation around React is based on a Webpack toolchain.
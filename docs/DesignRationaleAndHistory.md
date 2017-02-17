# Design Rationale and History

*tl;dr:* React apps became the primary development churn. Webpack is the most natural tool
which forced Node.js into the system. The site was migrated to Metalsmith from Jekyll for
static content creationg to allow keeping things in one langauge. A single repository was
chosen to facilitate easier code sharing.

The MVP of www.vets.gov was a 100% static content site built using Jekyll and deployed on to
Github Pages. The historical repository layout was constrained by the needs of Github Pages
which required all content to be at the root of the directory structure. Also, Jekyll implied
a Ruby stack. At the time, it was assumed any rich behavior would be written with a standard
monolithic Rails stack where render was handled server side.

With the launch of the Healthcare App, the team pivoted to use React for client side tooling.
Because of the Javascript heavy nature of this development, the Node.js ecosystem centered
around Webpack as the compiler for Javascript became much more natural.

Now we had two languages in the frontend with code separated into multiple repositories.
This started to become a versioning headache. For example, sharing stylesheets between the sites
meant having to package the Sass files twice, once in a Jekyll friendly manner and once in
a Webpack friendly manner. Furthermore, multiple languages meant multiple builds and multiple
pushes making it easy to desynchronize parts of the site.

A decision was made around August 2016 to create a single frontend build for easier code sharing
and more consistent deploys. Metalsmith was chosen as a replacement Jekyll because it was
written in Node.js and seemed reasonably well supported.

Initially the site used grunt as the task runner, but during the migration, it became clear
that Metalsmith itself was enough of a dependency manager and task marshaller to not require
grunt. In fact, grunt caused more problems with file watching.

And thus we ended up with one repository for content and Javascript code where Metalsmith is
the top-level task runner that builds all the static pages from `content/*` and delgates to
Webpack for Javscript and Sass compilation.
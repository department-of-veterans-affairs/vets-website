# vets.gov - beta [![Build Status](https://travis-ci.org/department-of-veterans-affairs/vets-website.svg?branch=master)](https://travis-ci.org/department-of-veterans-affairs/vets-website)

## What is this?

This is the combined frontend repository for www.vets.gov. With this repository, it is possible to
build all of the client-side (ie, anything that gets downloaded to the browser) code for
www.vets.gov with the exception of some high sensitivity endpoints that require server side
interaction such as login.

As it is client side there are no secrets in this repository since, well, public secrets aren't
very secret.

## I want to...

| I want to... | Then you should... |
| ------------ | ------------------ |
| clone the site | `git clone https://github.com/department-of-veterans-affairs/vets-website.git` followed by `cd vets-website`, `git submodule init; git submodule update`, `npm install`. Run `npm install` anytime `package.json` changes. | 
| deploy the site | merge to master for `dev.vets.gov` and `staging.vets.gov`. Merge to production for `www.vets.gov`. Travis will do the deploy on the post merge build. Submit a trivial change to force a re-deploy. |
| update static content that is already on the site. | Find the corresponding file in `content/pages`. Make your edit. Send a PR. |
| add new static content to the site. | Create new files at the right location in `content/pages`. Send a PR. |
| build the site with dev features enabled. | `npm run build` |
| build the production site (dev features disabled). | `npm run build -- --buildtype production` Note the extra `--` is required otherwise npm eats the buildtype argument instead of passing it on. |
| build the site with optimizaitons (minification, chunking etc) on. | Set `NODE_ENV=production` before running build. |
| run the site for local development with hot reloading of javascript, and sass | `npm run watch` then visit `http://localhost:3001/webpack-dev-server/`. You may also set `buildtype` and `NODE_ENV` though setting `NODE_ENV` to production will make incremental builds slow. |
| run all tests | `npm run test` |
| run only unit tests | `npm run test:unit` |
| run only e2e tests | `npm run test:e2e`.  Note, on a fresh checkout, run `npm run selenium:bootstrap` to install the selenium server into `node_modules`. This only needs to be done once per install. |
| run all linters | `npm run lint` |
| run only javascript linter | `npm run lint:js` |
| run only sass linter | `npm run lint:sass` |
| run automated accessibility tests | `npm run build && npm run test:accessibility` |
| test for broken links | Build the site. Broken Link Checking is done via a Metalsmith plugin during build. Note that it only runs on *build* not watch. |
| add new npm modules | `npm install -D my-module` followed by `npm shrinkwrap --dev`. There are no non-dev modules here. |
| get the latest json schema | `git submodule init; git submodule update; cd schema; git checkout master; git pull; cd ..`. Then you can commit the changes, if any.  |

## Directory structure

| Directory | Description |
| ----------| ------------|
| assets | Static assets such as images or fonts. These may get some optimization-style processing done on them, but in general files here are expected to show up directly in the output.  |
| build | Output of the site build. A subdirectory is generated per `buildtype` so `--buildtype=development` appears in `build/development`. This directory is suitable for synchronizing into S3 for deployment |
| config | Contains config files for the site. |
| content/pages | Static content for the site. If a file is added here, it will appear on the website by default. |
| content/layouts | Collection of layouts that can be used by content/pages. Must be html. No Markdown. |
| content/includes | Collection of HTML fragments shared between layouts. Must be html. No Markdown. |
| logs | Directory for log output from build tools. Currently only used by nightwatch and selenium for end-to-end testing. |
| node\_modules | install location of npm modules. Managed by npm. |
| old | Directories from the original Jekyll site that still need to be examined for possibly useful content before being deleted. |
| script | Scripts for building the repostiory. The most commonly used script is `build.js` which runs Metalsmith |
| src | Any source files that require compilation. This is all our Javascript and Sass currently. |
| test | Tests for files inside `src`.  The directory structure of `test` should mirror that of `src`. |

### Where are the Javascript and Sass `vendor` or `libs` directories?

There are none!!

All third-party styles and javascript are handled via npm using package.json. This allows
strong versioning of third-party libraries and makes it impossible for developers to
accidentally modify copies of upstream.

## Toolchain
The site is built using 2 tools: [Metalsmith](http://www.metalsmith.io/) and
[Webpack](https://webpack.github.io/) and is fully node.js stack.o

Metalsmith is used as the top-level build coordinator -- it is effectively a generic
"if file changes here, run this" system -- as well as the static content genertaor. When
Metalsmith sees Javascript, it is delegated to Webpack.  Sass files are "require"ed inside
the Javascript files for the site and processed by Webpack.

### Requirements

The requirements for running this application are Node.js 4.4.7 and npm 3.8.9.

Node.js's version is managed using nvm. Please follow the installation instructions on `nvm`
to ensure you are using the same version of node as others.
You should use Node Version Manager (nvm) to manage the versions of node.js on your local machine.
To install please visit: https://github.com/creationix/nvm
_If you are on a mac and use [homebrew](http://brew.sh/), you can install nvm by typing: brew update && brew install nvm_

Once you have nvm installed you should now install node.js version 4.4.7 by running: 

```bash
nvm install
```

Once you have node.js version 4.4.4 installed install npm version 3.8.9 by running:

```bash
npm i -g npm@3.8.9
```
### Verify your local requirements are set

```bash
node --version // 4.4.7
npm --version  // 3.8.9
```


## How it all works
### Build
The build is abstracted by the command `npm run build` which really just exectues
`scripts/build.js` --  a simple Javscript program that configures Metalscript and Webpack
based on things in `config/`, commandline flags, and the `NODE_ENV` environment variable.

*WARNING: `--buildtype` and `NODE_ENV` are unlrelated!*

`--buildtype` changes what constants are defined which enables/disables features from the code.

`NODE_ENV` changes the optimizations applies such as disabling React PropType checks and
enabling minification + javascript chunking.

(Note: The `NODE_ENV` env variable dependency is a questionable design choice. It should

#### Metalsmith -- Static content builds and top-level file watching.
The `build.js` script relies on [Metalsmith's Javscript
API](https://github.com/metalsmith/metalsmith#api) as the main build script. Metalscript,
at the core, is just a file watcher that runs a set of files through chain of plugins.
Using the Javascript API for Metalscript allows removal of tools like Grunt while also
enabling faster incremental builds because Metalsmith and Webpack can stay in memory.

Metalsmith's behavior is entirely defined by the plugins added, their configuration, and
their ordering.

The primary responsibility of Metalsmith is to process all the pages in `content/` and
static assets under `assets/` to produce output in `build/`.

With the exception of files under `build/${BUILDTYPE}/generated/` that are handled by webpack,
everything else is directly generated by metalsmith-plugins.

Refer to the (thorough) comments inside `build.js` for specifics.

#### Webpack -- Javascript and Sass processing. Outputs `build/generated`
Metalsmith invokes Webpack or [Webpack Dev
Server](https://webpack.github.io/docs/webpack-dev-server.html) depending of it is in
build or watch mode.

Webpack's configuration is stored in `config/webpack.config.js` and declares a set of
loaders which are Webpack's version of plugins. The loaders are used to compile ES2015
to ES5 via Babel, and to process the sass into CSS.

Webpack is configured to handle multiple different entrypoints (see `entry`
in `webpack.config.js`). In general, there should be one entrypoint
`non-react.entry.js` used by most of the static content pages. Each react app
should have their own entrypoint.

Sass and styles are loaded *via Javascript*. Each entrypoint `require()` an appropriate
top-level sass file which the imports the rest of the css dependency tree as needed.
Webpack then generates a separate css bundle for each of these entrypoints allowing
the site to have app-specific css.

### Watch mode
File watching and incremental building is important for developer efficiency, but it's
more complicated because, to be fast, each tool needs to keep its state between runs.
This is actually the driving reason NOT to use grunt or gulp because, fundametnally,
both those task runners would expect to restart either metalsmith or webpack on
file changes.

In our setup, we use the `metalsmith-watch` plugin as well as the
`metalsmith-webpack-dev-server` plugin to do file watching based on the separation of
duties listed earlier. The Webpack Dev Server also serves as the actual web server
endpoint that handles HTTP requests.

When a file chagnes in `content/\*` or `asset/\*`, whether and how it gets rebuilt
is dependent on the `metalsmith-watch` configuration.

If a 404 is incorrectly handled, that's a configuration problem with Webpack Dev Server.

Similarly, everything in `src/\*` is dependent on the webpack configuration.

Quirks:
  * metalsmith-watch cannot do broken link detection during incrementals.
  * Webpack Dev Server uses an in-memory filesystem so nothing shows up in `build/${}/generated`
  * Visit `http://localhost:3001/webpack-dev-server` (no trailing slash!) to see the contents of generated files.

Overall, this runs pretty well.

In a future TODO, hooking ESlint and Sass lint into metalsmith or webpack dev
server would allow them to execute during incremental builds as well.


### Unit Test -- Mocha
All unittests re under `test/\*` and are named with the suffix `.unit.spec.js`.

Unittests are done via `mocha` with the `chai` assertion library run directly via
the mocha test runner without going through karma or PhantomJS. This means they
run very fast.

Unfortunately, it also means there is no true `window` or `document` provided which
breaks `ReactTestUtils`'s simulate calls. To rememdy, a fake `window` and
`document` are provided using `jsdom` and bootstrapped in `test/util/mocha-setup.js`
which is required via `test/mocha.opts`.

With this, most everything (except code that accesses HTML5 `dataset`) is testable
without the overhead of starting a browser.

The `mocha-setup.js` file can be thought of as the init script for mocha tests.

Note that because mocha is running the test files directly, it needs to use
`babel-register` (see `compilers` option in `mocha.opts`) to execute babel on
the unittests. This is why babel configuration is kept in `.babelrc`, so it can
be shared between build and test.

### End-to-end Test -- nightwatch

All end-to-end tests are under `test/\*` and are named with the suffix `.e2e.spec.js`.

Nightwatch is being used for browser-based testing. On the default configuration,
PhantomJS is used as the default browser for faster testing and to prevent
nightwatch from interfering with the developer's UI.

Nightwatch is a wrapper on Selenium. It is configured in `config/nightwatch.js`.
To run a nightwatch test, 3 things need to execute:

  1. A webserver with our site
  2. The selenium server (which will spawn browsers like PhanomJS)
  3. The nightwatch client that talks to the Selenium server

End-to-end tests do not need to be restricted exclusively to selenium style tests
(eg, navigate to this url, click this button, etc). At its core, it just a system
for starting up and controlling web browser.  For mocha tests that we want to
run on real browser, either because the tests is excercising browser quriks or because
the test requries features that jsdom does not provide, putting them into a
`e2e.spec.js` file is completely valid and good.

TODO(awong): Figure out sauce labs integrations. Not all e2e tests should always be
run on all browsers. That's wasteful. How do we determine what should be run on
multiple browsers as opposed to on PhantomJS in Travis?

### Automated Accessibility Testing -- aXe

The automated accessibility tests are contained within the `test/accessibility`
directory. All URLs from the generated sitemap are scanned with aXe
rules for 508 compliance.

Automated accessibility tests are run on the `master`, `staging`, and
`production` branches, but they will only report, not fail, on the `master`
branch.

### Continuous Integration
Continuous integration and deployment is done via
[Travis CI](travis-ci.org/department-of-veterans-affairs/vets-website). All of the configuration
is stored in `.travis.yml`.

The build configuration will depend on the branch being pushed. The `master`
branch and any feature branches will trigger a build with the default build type
(development), while the staging and production branches will use the production
build type.

A push to `master`, `staging`, or `production` will trigger additional automated
accessibility testing. To run these tests locally, use `$ npm run test:accessibility` after
ensuring you've run a current build.

Travis will build with `NODE_ENV=production` and test both "production" and
"development" `BUILDTYPE`.

### Deploy
Because this is a static site, deployment is simply synchronizing the generated artifacts
with a remote s3 bucket.  Travis handles the synchronization by using the
[s3-cli](https://www.npmjs.com/package/s3-cli) commandline tool.

Commits to `master` pushes `buildtype=development` to `dev.vets.gov` and
`buildtype=staging` to `staging.vets.gov`. When absolutely necessary, such as
when testing features against external services before they make their way to
production, the `staging` environment may differ slightly from the `production`
environment. These variations are defined in the `script/webpack.config.js`
file along with the warning statement.

Commits to `production` pushes `buildtype=production` to `www.vets.gov`.

AWS access is granted to travis via the encrypted envrionment variables
`AWS_ACCESS_KEY` and `AWS_SECRET_KEY`. The same access key is reused for all pushed because
there is no trust boundary between the different deploys in Travis CI and in the source
repository.

For exact details, look in the deployment stanza of `.travis.yml`.

## Design Rationale and History.

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

### Why Metalsmith?

Metalsmith looked well supported and very flexible. There were no major technical drivers here.

### Why Webpack?

Webpack seems to have become the defacto build toolkit for Javascript and Sass. Most current
documentation around React is based on a Webpack toolchain.

## More documentation

TODO: Verify if these are still relevant.

- [Why Is My Build Breaking?](docs/WhyIsMyBuildBreaking.md)
- [How Breadcrumbs Work](docs/HowBreadCrumbsWork.md)
- [How URLs are Created](docs/HowURLsAreCreated.md)
- [How Search Works](docs/HowSearchWorks.md)

# vets.gov - beta [![Build Status](https://dev.vets.gov/jenkins/buildStatus/icon?job=department-of-veterans-affairs/vets-website/master)](http://jenkins.vetsgov-internal/job/department-of-veterans-affairs/job/vets-website/job/master/) [![Test Coverage](https://codeclimate.com/github/department-of-veterans-affairs/vets-website/badges/coverage.svg)](https://codeclimate.com/github/department-of-veterans-affairs/vets-website/coverage)

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
| clone the site | `git clone https://github.com/department-of-veterans-affairs/vets-website.git` followed by `cd vets-website`, `npm install`. Run `npm install` anytime `package.json` changes. |
| deploy the site | merge to master for `dev.vets.gov` and `staging.vets.gov`. Merge to production for `www.vets.gov`. Jenkins will do the deploy on the post merge build. Submit a trivial change to force a re-deploy. |
| update static content that is already on the site. | Find the corresponding file in `content/pages`. Make your edit. Send a PR. |
| add new static content to the site. | Create new files at the right location in `content/pages`. Send a PR. |
| build the site with dev features enabled. | `npm run build` |
| build the production site (dev features disabled). | `npm run build -- --buildtype production` Note the extra `--` is required otherwise npm eats the buildtype argument instead of passing it on. |
| build the site with optimizations (minification, chunking etc) on. | Set `NODE_ENV=production` before running build. |
| run the site for local development with automatic rebuilding of Javascript and sass | `npm run watch` then visit `http://localhost:3001/`. You may also set `buildtype` and `NODE_ENV` though setting `NODE_ENV` to production will make incremental builds slow. |
| run the site for local development with automatic rebuilding of code and styles for specific apps | `npm run watch -- --entry disability-benefits,no-react`. Valid application names are in `config/webpack.config.js` |
| run the site for local development with automatic rebuilding of code and styles for static content | `npm run watch:static`. This is equivalent to running `npm run watch -- --entry no-react` |
| run the site so that devices on your local network can access it  | `npm run watch -- --host 0.0.0.0`. Note that we use CORS to limit what hosts can access different APIs, so accessing with a `192.168.x.x` address may run into problems |
| run all tests | `npm run test` |
| run only unit tests | `npm run test:unit` |
| run only e2e tests | `npm run test:e2e` | 
| run only e2e tests for a subset of tests | `npm run test:e2e -- test/edu-benefits/1995/*.e2e.spec.js` (provide file paths) |
| run all linters | `npm run lint` |
| run only javascript linter | `npm run lint:js` |
| run only sass linter | `npm run lint:sass` |
| run automated accessibility tests | `npm run build && npm run test:accessibility` |
| test for broken links | Build the site. Broken Link Checking is done via a Metalsmith plugin during build. Note that it only runs on *build* not watch. |
| add new npm modules | `npm install -D my-module` followed by `npm shrinkwrap --dev`. There are no non-dev modules here. |
| get the latest json schema | Update vets-json-schema in package.json with the latest commit hash, then run `npm update vets-json-schema && npm shrinkwrap --dev` |
| check test coverage | `npm run test:coverage` |

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

*WARNING: `--buildtype` and `NODE_ENV` are unrelated!*

`--buildtype` changes what constants are defined which enables/disables features from the code.

`NODE_ENV` changes the optimizations applies such as disabling React PropType checks and
enabling minification + javascript chunking.

(Note: The `NODE_ENV` env variable dependency is a questionable design choice. It should

#### Metalsmith -- Static content builds and top-level file watching.
The `build.js` script relies on [Metalsmith's Javascript
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
run on real browser, either because the tests is exercising browser quirks or because
the test requries features that jsdom does not provide, putting them into a
`e2e.spec.js` file is completely valid and good.

TODO(awong): Figure out sauce labs integrations. Not all e2e tests should always be
run on all browsers. That's wasteful. How do we determine what should be run on
multiple browsers as opposed to on PhantomJS in Jenkins?

#### E2E Troubleshooting
Try running your `selenium` server manually:
```
$ java -jar <path to GitHub>/vets-website/node_modules/selenium-server/lib/runner/selenium-server-standalone-3.1.0.jar
```
and you should see:
```
04:35:15.862 INFO - Selenium Server is up and running
```
* Selenium requires **Java 8** to run

### Automated Accessibility Testing -- aXe

The automated accessibility tests are contained within the `test/accessibility`
directory. All URLs from the generated sitemap are scanned with aXe
rules for 508 compliance.

Automated accessibility tests are run by Jenkins on PRs for the production build
type.

### Continuous Integration
Continuous integration and deployment is done via
[Jenkins CI](http://jenkins.vetsgov-internal/). All of the configuration
is stored in `Jenkinsfile`. The build runs within docker, which is configured
with the `Dockerfile`. You can run this container locally to debug any failed
builds:

```
  docker build -t vets-website:local .
  docker run -it --rm vets-website:local /bin/bash
  cd /application && npm run build && npm run test
```

Builds are triggered for PRs for all build types. The special branch name
`content/wip/.*`, will fail by default and not run any builds. This is to allow
rapid iteration on WIP content team work before builds are tested.

Tests are run over the production buildtype for all PRs. Tests should not
be tied to the build type. Instead, define a feature flag variable and
test both the enabled and disabled states. While a build type will either enable
or disable the feature in the UI, the tests will still run the feature's code
path despite the environment. This ensures that your component will function in
all builds regardless of the build type. The important distinction is that your
feature is still active within the code base, but the UI is either enabled or
disabled by the feature flag.

To enable or disable the feature in a specific build type, toggle the feature
in `test/util/mocha-setup.js` and `config/webpack.config.js`. See
[`SampleFeature`](src/js/common/components/SampleFeature.jsx) and the associated `__SAMPLE_FEATURE__` env variables for an
example implementation.

## More documentation

- Content
  - [Why Is My Build Breaking?](docs/WhyIsMyBuildBreaking.md)*
  - [How Search Works](docs/HowSearchWorks.md)*
  - [Design Rationale and History](docs/DesignRationaleAndHistory.md)
  - [Website Toolchain](docs/WebsiteToolchain.md)
  - [How to Deploy](docs/HowToDeploy.md)

- React JSON Schemaform
  - [Schemaform Walkthrough](docs/schemaform/walkthrough.md)
  - [Form Config](docs/schemaform/form-config.md)

##### *Verify if these are still relevant.


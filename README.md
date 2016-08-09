# vets.gov - beta [![Build Status](https://travis-ci.org/department-of-veterans-affairs/vets-website.svg?branch=master)](https://travis-ci.org/department-of-veterans-affairs/vets-website)

## Setup for your local environment

### Requirements

- [Git](https://git-scm.com/)
- [Node and NPM](https://nodejs.org/)

If you are using OS X, there is a good chance that you already have these installed. To check:

1. Open Terminal.app (or iTerm, if that's what you're using)
1. Type `which [program]`, e.g.: `which npm` or `which git`

If the output is a path, then that package has been installed. If there is no output, install the appropriate software.

## Installation

### Cloning the repo 

Clone the repo to your local machine using the following.

```shell
$ git clone git@github.com:department-of-veterans-affairs/vets-website.git
```

If you haven't set up SSH or GPG keys, use the HTTPS URL instead.

```shell
$ git clone https://github.com/department-of-veterans-affairs/vets-website.git
```

These commands will add a `vets-website` directory to the current working directory.

If you'd rather this directory not be named `vets-website`, add a new directory name to the command, e.g. 

```shell
$ git clone https://github.com/department-of-veterans-affairs/vets-website.git chocolate
```

This will copy the repo to a `chocolate` directory.

### Installing the build environment

In a terminal window `cd` into the `vets-website` directory, then run:

```shell
$ npm install
```

Installation will take several minutes.

## Running the website locally

- Open a terminal window
- Use the `cd` command to navigate to the `vets-website` directory
- Run site by using:

    ```shell
    npm run watch
    ```
- View the site in your browser at http://localhost:3000/development/


## Deploying the website

Deployment is done by pushing changes to the `production` branch on github.
The most common paradigm is to promote `master` to `production` by doing a
fast-forward merge into the branch. 

## Development

For testing, the following commands are useful:

```shell
npm run lint:js 	# This runs linter on js files excluding src/js/legacy
npm run lint:sass	# This runs linter on sass files based on config/sass-lint.yml
npm run lint		# This will run both js and sass linters

npm run selenium:bootstrap      # This will boot strap selenium which you will need to run Nightwatch

npm run test:e2e	# This runs Nightwatch.js end-to-end tests base on config/nightwatch.js
npm run test:unit	# This runs mocha unit tests
npm run test		# This runs e2e and unit tests

```

## More documentation

- [Why Is My Build Breaking?](docs/WhyIsMyBuildBreaking.md)
- [How Breadcrumbs Work](docs/HowBreadCrumbsWork.md)
- [How URLs are Created](docs/HowURLsAreCreated.md)
- [How Search Works](docs/HowSearchWorks.md)
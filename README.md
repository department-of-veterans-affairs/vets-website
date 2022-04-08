# VA Forms System Core

## Welcome to the VA.gov Forms Library

VA Forms System Core (VAFSC) is the second generation of the `forms library` which is built using React, Formik, and Typescript.

**What is the `forms library`?**

The forms library is the current production system that most forms are built with inside of `vets-website`. This legacy system uses a forked version of React JSON Schema Form (RJSF) and a config based approach to designing and developing forms. Although this system worked well up to this point, VAFSC will be a major improvement by incorporating React components and giving engineers and designers the power back that RJSF did not allow for.

**NPM Package**: [NPM va-forms-system-core](https://www.npmjs.com/package/@department-of-veterans-affairs/va-forms-system-core)

**Github Pages**: [VA Forms System Core Github Pages](https://department-of-veterans-affairs.github.io/va-forms-system-core/)

VAFSC will include but not limited to:

- Routing
- Save In Progress
- Web Components
- Accessibility

## Prerequisites

1. Nodejs/NPM
2. Yarn

## Quick start

Once you have the prerequisites downloaded you are ready to get the project built.

First you need to install all of the packages and their dependancies by running:

- Install

  ```sh
  yarn install
  ```

- Build

  ```sh
  yarn build
  ```

- Watch

  ```sh
  yarn watch
  ```

## Examples

Run the [examples](examples) in this repo with:

```sh
yarn serve-examples
```

To create new example:

- Make an entry file at `examples/my-new-example/index.jsx`
- (Optional) Add a new bullet to the directory listing at `examples/index.jsx`
  to appear on the home page so other developers can quickly go to it

## Documentation

We have documentation in `/docs` that is [hosted using GitHub Pages](https://department-of-veterans-affairs.github.io/va-forms-system-core/).

To update the document references run:

```shell
yarn build
```

To run the Jekyll site locally, run the following commands:

```shell
cd docs
bundle install
bundle exec jekyll serve
```

## Continuous Integration

There are 3 github actions currently but more will be added in the future.

1. codeql-analysis
2. testing
3. npm-publish

## The design document

For more information about the purpose and architecture of this library, check
out the [design document](https://vfs.atlassian.net/wiki/spaces/FLT/pages/2025029667/Forms+System+Design+Document+WIP).

The design document is intended to be a living document, so if you find it
doesn't accurately reflect reality, please open an issue or submit a PR.

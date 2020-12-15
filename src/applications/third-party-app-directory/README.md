# Third Party App Directory

## Development

The third party app directory is built as a React widget that is lazy loaded onto a static template. In order to develop and view changes to the app directory you'll need to run the following [commands](https://github.com/department-of-veterans-affairs/vets-website#building-static-content):

```sh
yarn build:content --pull-drupal
```

After the build process is complete you should run the preview server concurrently with the webpack server

```sh
yarn preview
```

and

```sh
yarn watch
```

Click [this link](http://localhost:3001/preview?nodeId=9615) to preview the app directory

## Running tests

To run all unit tests for the app directory you can run the following:

```sh
yarn test:unit src/applications/third-party-app-directory/**/*.unit.spec.js*
```

## Codeowners

The [lighthouse bilby](https://github.com/orgs/department-of-veterans-affairs/teams/lighthouse-bilby) team owns development of this widget and will be tagged on any pull requests. Their slack channel is #connected-apps.

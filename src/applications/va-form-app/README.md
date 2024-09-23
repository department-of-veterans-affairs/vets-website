# va-form-app Example

[[va-platform-docs](https://depo-platform-documentation.scrollhelp.site/developer-docs/va-forms-library-getting-started-with-the-forms-li)]

```bash
$ yarn new:app
yarn run v1.19.1
$ yo @department-of-veterans-affairs/vets-website && npm run lint:js:untracked:fix

     _-----_     ╭──────────────────────────╮
    |       |    │      Welcome to the      │
    |--(o)--|    │     vets-website app     │
   `---------´   │        generator!        │
    ( _´U`_ )    ╰──────────────────────────╯
    /___A___\   /
     |  ~  |
   __'.___.'__
 ´   `  |° ´ Y `

For a guide on using this Yeoman generator, including example answers for each prompt:
https://department-of-veterans-affairs.github.io/veteran-facing-services-tools/platform/tools/generator/

To follow a basic tutorial on creating and modifying a form application:
https://department-of-veterans-affairs.github.io/veteran-facing-services-tools/forms/form-tutorial-basic

? What's the name of your application? This will be the default page title. Examples: '21P-530 Burials
benefits form' or 'GI Bill School Feedback Tool' VA Form App
? What folder in `src/applications/` should your app live in? This can be a subfolder. Examples: 'burials'
or 'edu-benefits/0993' va-form-app
? What should be the name of your app's entry bundle? Examples: '0993-edu-benefits' or 'feedback-tool'
va-form-app
? What's the root url for this app? Examples: '/gi-bill-comparison-tool' or
'/education/opt-out-information-sharing/opt-out-form-0993' /va-form-app
? Is this a form app? Yes
? Where can I find the vagov-content repo? This path can be absolute or relative to vets-website.
/home/rd/va/vagov-content
? What Slack user group should be notified for CI failures on the `main` branch? Example: '@vaos-fe-dev'
none
? What's your form number? Examples: '22-0993' or '21P-530' XX0011
? What's the Google Analytics event prefix that you want to use? Examples: 'burials-530-' or 'edu-0993-'
va-form-ex-
? What's the respondent burden of this form in minutes? 5
? What's the OMB control number for this form? Example: '2900-0797' XX0011
? What's the OMB expiration date (in M/D/YYYY format) for this form? Example: '1/31/2019' 12/31/2025
? What's the benefit description for this form? Examples: 'education benefits' or 'disability claims
increase' benefits
? Does this form use vets-json-schema? (JSON schemas defined in separate repository) No
? Which form template would you like to start with? WITH_1_PAGE: A form with 1 page - name and date of
birth

     _-----_     ╭──────────────────────────╮
    |       |    │  Don't forget to make a  │
    |--(o)--|    │   markdown file in the   │
   `---------´   │   vagov-content repo at  │
    ( _´U`_ )    │   pages/va-form-app.md!  │
    /___A___\   /╰──────────────────────────╯
     |  ~  |
   __'.___.'__
 ´   `  |° ´ Y `

   create src/applications/va-form-app/manifest.json
   create src/applications/va-form-app/app-entry.jsx
 conflict ../content-build/src/applications/registry.json
? Overwrite ../content-build/src/applications/registry.json? overwrite
    force ../content-build/src/applications/registry.json
   create src/applications/va-form-app/sass/va-form-app.scss
   create src/applications/va-form-app/reducers/index.js
   create src/applications/va-form-app/containers/App.jsx
   create src/applications/va-form-app/routes.jsx
   create src/applications/va-form-app/tests/containers/ConfirmationPage.unit.spec.jsx
   create src/applications/va-form-app/tests/containers/IntroductionPage.unit.spec.jsx
   create src/applications/va-form-app/tests/fixtures/data/minimal-test.json
   create src/applications/va-form-app/tests/fixtures/mocks/local-mock-responses.js
   create src/applications/va-form-app/tests/fixtures/mocks/user.json
   create src/applications/va-form-app/tests/va-form-app.cypress.spec.js
   create src/applications/va-form-app/containers/IntroductionPage.jsx
   create src/applications/va-form-app/containers/ConfirmationPage.jsx
   create src/applications/va-form-app/pages/nameAndDateOfBirth.js
   create src/applications/va-form-app/constants.js
   create src/applications/va-form-app/config/form.js
 conflict src/platform/forms/tests/forms.unit.spec.js
? Overwrite src/platform/forms/tests/forms.unit.spec.js? overwrite
    force src/platform/forms/tests/forms.unit.spec.js
 conflict src/platform/forms/constants.js
? Overwrite src/platform/forms/constants.js? overwrite
    force src/platform/forms/constants.js

No change to package.json was detected. No package manager install will be executed.
------------------------------------
Commands:
Site:      http://localhost:3001/va-form-app
Watch:     yarn watch --env entry=va-form-app
Mock API:  yarn mock-api --responses src/applications/va-form-app/tests/fixtures/mocks/local-mock-responses.js
Unit test: yarn test:unit --app-folder va-form-app --log-level all
------------------------------------
npm WARN lifecycle The node binary used for scripts is /tmp/yarn--1726860074361-0.06817759543513757/node but npm is using /home/rd/.asdf/installs/nodejs/14.15.5/bin/node itself. Use the `--scripts-prepend-node-path` option to include the path for the node binary npm was executed with.

> vets-website@1.0.1 lint:js:untracked:fix /home/rd/va/vets-website
> LIST=`git ls-files --others --exclude-standard | grep "\.js[x]\{0,1\}$"`; if [ "$LIST" ]; then eslint --fix --quiet $LIST; fi

Browserslist: caniuse-lite is outdated. Please run:
  npx browserslist@latest --update-db
  Why you should do it regularly: https://github.com/browserslist/browserslist#browsers-data-updating
Done in 191.53s.
```

## Start it

```bash
$ yarn watch --env entry=static-pages,auth,va-form-app
$ yarn mock-api --responses src/applications/va-form-app/tests/fixtures/mocks/local-mock-responses.js
$ open http://localhost:3001/va-form-app
```

## Form structure and flow

[[va-form](https://design.va.gov/templates/forms/)]

A form within the VA platform consists of the following pages:

```
Landing Page -> Introduction -> Page #1 .. #n -> Review (then submit form) -> Confirmation
```

## formConfig

`config/form.js` defines details for submitting the form.

```js
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/va-form-app`,
  formId: VA_FORM_IDS.FORM_XX0011,
};
```

`config/form.js` defines the content displayed within the form pages.

```js
const formConfig = {
  title: TITLE,
  subTitle: SUBTITLE,
  getHelp,
  footerContent,
}
```

`config/form.js` defines the components to be displayed for each page of the form, and the form schema.

```js
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import nameAndDateOfBirth from '../pages/nameAndDateOfBirth';

const formConfig = {
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  chapters: {
    firstChapter: {
      title: 'Your personal information',
      pages: {
        nameAndDateOfBirth: {
          path: 'name-and-date-of-birth',
          title: 'Name and date of birth',
          uiSchema: nameAndDateOfBirth.uiSchema,
          schema: nameAndDateOfBirth.schema,
        },
      }
    }
  }
};
```

Idea: move `path` and `title` properties/values to default export of `pages/[pageName].js`

Question: How does grouping pages as a chapter change the form flow?

## schema and uiSchema

Add chapters/pages to `formConfig`, add associated page `uiSchema` and form `schema` to `pages/[pageName].js`.

```js
// src/applications/va-form-app/pages/nameAndDateOfBirth.js

import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  path: 'name-and-date-of-birth',
  title: 'Name and date of birth',
  uiSchema: {
    ...titleUI('Name and date of birth'),
    fullName: fullNameNoSuffixUI(),
    dateOfBirth: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    properties: {
      fullName: fullNameNoSuffixSchema,
      dateOfBirth: dateOfBirthSchema,
    },
    required: ['fullName', 'dateOfBirth'],
  },
};
```

[[web-component-patterns](https://depo-platform-documentation.scrollhelp.site/developer-docs/how-to-use-web-component-patterns)]


```bash
$ cd src/platform/forms-system/src/js/web-component-patterns
$ tree
.
├── addressPattern.jsx
├── arnPattern.jsx
├── arrayBuilderPatterns.jsx
├── bankPattern.jsx
├── checkboxGroupPattern.jsx
├── datePatterns.jsx
├── emailPattern.jsx
├── fileInputPattern.jsx
├── fullNamePattern.js
├── index.js
├── numberPattern.jsx
├── phonePatterns.jsx
├── radioPattern.jsx
├── relationshipToVeteranPattern.jsx
├── selectPattern.jsx
├── ssnPattern.jsx
├── textPatterns.jsx
├── titlePattern.js
└── yesNoPattern.jsx
```

## TODO

Explore

- Add more pages to va-form-app
- [Save in progress (sip)](https://depo-platform-documentation.scrollhelp.site/developer-docs/va-forms-library-how-to-set-up-save-in-progress-si)
- [Form prefill](https://depo-platform-documentation.scrollhelp.site/developer-docs/va-forms-library-how-to-work-with-pre-fill)

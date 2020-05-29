# Scaffolding a New Application

Before we can get started, make sure you are able to get VA.gov [running
locally](https://department-of-veterans-affairs.github.io/veteran-facing-services-tools/getting-started).

## Create a new form application with Yeoman generator
To begin, run the generator from the root of your local vets-website repository:

```sh
yarn new:app
```

This tutorial uses the following answers to the questions asked by the
generator:

| Question                                                           | Answer                           |
| --------                                                           | ------                           |
| What's the name of your application?                               | My new form                      |
| What folder in `src/applications/` should your app live in?        | new-form                         |
| What should be the name of your app's entry bundle?                | newForm                          |
| What's the root url for this app?                                  | /new-form                        |
| Is this a form app?                                                | Y                                |
| What's your form number?                                           | XX-230                           |
| What's the Google Analytics event prefix you want to use?          | new-form-                        |
| What's the respondent burden of this form in minutes?              | 30                               |
| What's the OMB control number for this form?                       | XX3344                           |
| What's the OMB expiration date (in M/D/YYYY format) for this form? | 5/31/2018                        |
| What's the benefit description for this form?                      | new form benefits                |
| Which form template would you like to start with?                  | BLANK: A form without any fields |


## Your new application
After answering the questions, the generator will create several source files
for a new form application in `/src/applications/new-form`. Let's look at each
of these briefly.

```
src/applications/new-form/
  |__manifest.json
  |__app-entry.jsx
  |__routes.jsx
  |__containers
  |  |__App.jsx
  |  |__IntroductionPage.jsx
  |  \__ConfirmationPage.jsx
  |__config
  |  \__form.js
  |__reducers
  |  \__index.js
  |__tests
  |  \__00.new-form.e2e.spec.js
  \__sass
     \__new-form.scss
```

**`manifest.json`** contains information about your application such as its URL
and entryfile.

**`app-entry.jsx`** is referenced from the `manifest.json` file as the
`entryFile`. Webpack creates the bundle for your application starting here.

**`routes.jsx`** holds the routes for your application. Note that the
`childRoutes` here are created from the forms library. You shouldn't need to do
anything here.

**`App.jsx`** can be considered the "root" of your application. This is where
the forms library's `<RoutedSavableApp>` is used to create your form.

**`IntroductionPage.jsx`** exports a React component used for the—you guessed
it—introduction page.

**`ConfirmationPage.jsx`** exports the compoennt the user will see once the form
has successfully been submitted to the API.

**`form.js`** is where the magic happens. This contains the `formConfig` object
which will hold the configuration and logic for your form.

**`reduceers/index.js`** contians the reducers for your form. Unless you're
doing something custom outside the forms library, you shouldn't need to change
anything in here.

**`00.new-form.e2e.spec.js`** is the browser test for your application. For more
information, see [Writing Browser Tests](browser-tests.md).

**`new-form.scss`** holds the custom styles for your form. To keep all forms
across VA.gov as consistent as possible, it's best practice to avoid making any
changes in here, but sometimes there's no good way to avoid that.

## Open the new form application

Next you'll need to start the site up locally (restart this task if it is already running):
```sh
yarn watch
```

Then navigate to http://localhost:3001/new-form. You should see your form's introduction page.

<!-- TODO: Add a screenshot -->

It's not a terribly exciting form yet, is it? In the next section, you'll give
your form some life by adding some pages.


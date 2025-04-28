# Forms adding or updating pages

1. Determine the {app_folder} we are in [instructions](fs-app-locate-folder.prompt.md). The {app_folder} should be the remaining path after `src/applications`

Continue to search until you find it.

## App structure
Manifest file = {app_folder}/manifest.json
Form config = {app_folder}/config/form.js
Pages = {app_folder}/pages
Tests = {app_folder}/tests/unit

## Creating or updating a page

You must make 3 changes for each page.

1. Create or update the page in the `{app_folder}/pages/{page-name}.js` file.
2. Update the `{app_folder}/config/form.js` file to add or update the new page to the form.
3. Use [forms-web-component-patterns](fs-patterns-web-component-schema-patterns.prompt.md) for code format patterns and validation.
4. Validate the new page uses the patterns correctly, and correct if necessary.

All pages should define the uiSchema and schema, and use web component patterns.

Follow instructions for code format patterns:

### Titles

Page titles must be updated in both the page and the form.

```js
// {FORM_ROOT}/pages/{page-name}.js
export default {
  uiSchema: {
    ...titleUI('Page title'),
  },
  schema: {
    type: 'object',
    properties: {
      ...
    },
  },
};
```

### Form config

```js
// {FORM_ROOT}/config/form.js
const formConfig = {
  ...
  chapters: {
    ...
    chapterName: {
      title: 'Chapter title',
      pages: {
        pageName: {
          path: 'page-path',
          title: 'Page title',
          uiSchema: pageName.uiSchema,
          schema: pageName.schema,
        },
      },
    },
  },
};
```
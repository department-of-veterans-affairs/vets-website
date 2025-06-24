---
mode: 'agent'
---
# Forms adding or updating pages

1. Determine the {app_folder} we are in [instructions](.github/prompts/find-app-folder.prompt.md). The {app_folder} should be the remaining path after `src/applications`

## Creating or updating a page

You must make at least 3 changes for each page.

1. Create or update the page in the `{app_folder}/pages/{page-name}.js` file. If `{app_folder}/pages` does not exist, then check for a `chapters` folder, or make a best guess where the code should go.
2. Update the `{app_folder}/config/form.js` file to add or update the new page to the form.
3. Use [web-component-patterns](.github/instructions/web-component-rjsf-patterns.instructions.md) for code format patterns and validation.
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
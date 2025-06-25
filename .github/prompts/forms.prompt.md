# Instructions for Agent when creating and updating pages, chapters, and new forms in the VA.gov Design System.

## How to find the form/folder path related to the form the user wants to create or update
<process>
<find-form-path>
- Use `/src/applications/manifest-catalog.json` to find the form. If there is any ambiguity, ask the user for more details.
- If no context is provided, search for the nearest `manifest.json` file to find the application root.
</find-form-path>
<no-form-path-found>
- If it is for a new form, suggest a new folder name based on existing patterns in `/src/applications/manifest-catalog.json`.
- Confirm with the user before proceeding if it is a new form.
- `yarn new:app` is the command to create a new form.
- After creating a new form, run `yarn generate-manifest-catalog` to update the `manifest-catalog.json`.
</no-form-path-found>
</process>

## File structure for forms
{appFolder} is the root folder for the form, also known as `"directoryPath"` in the `manifest-catalog.json`. It contains a `manifest.json` file. Here are examples of common file structures for forms.

<examples>

<example1>
<fileStructure>
{appFolder}
└── manifest.json
└── config/
    └── form.js
└── containers/
    └── App.js
    └── ConfirmationPage.jsx
    └── IntroductionPage.jsx
└── pages/
    └── {page-name}.jsx
└── tests/
    └── e2e/
        └── fixtures/
            └── {fixture-name}.json
        └── {page-name}.cypress.spec.jsx
    └── unit/
        └── config/
            └── form.unit.spec.jsx
        └── containers/
            └── App.unit.spec.jsx
            └── ConfirmationPage.unit.spec.jsx
            └── IntroductionPage.unit.spec.jsx
        └── pages/
            └── {page-name}.unit.spec.jsx
</fileStructure>
</example1>

<example2>
<fileStructure>
{appFolder}
└── manifest.json
└── config/
    └── form.js
└── chapters/
    └── {chapter-name}.jsx
└── components/
    └── {component-name}.jsx
└── tests/
    └── config/
        └── form.unit.spec.jsx
    └── pages/
        └── {page-name}.unit.spec.jsx
    └── chapters/
        └── {chapter-name}.unit.spec.jsx
    └── components/
        └── {component-name}.unit.spec.jsx
    └── containers/
        └── {container-name}.unit.spec.jsx
    └── fixtures/
        └── {fixture-name}.json
</fileStructure>
</example2>

</examples>

## Creating new chapters or pages
### Prerequisites:
- [ ] Ensure the form is already created or exists in the `manifest-catalog.json`.
- [ ] It should be clear what chapter the page belongs to
- [ ] Each page should have a title
- [ ] Each page should have fields, and what web component patterns are used. Some web component patterns contain multiple fields, and so you must reference `platform/forms-system/src/js/web-component-patterns/web-component-patterns-catalog.json` to check if a pattern contains multiple fields.
- [ ] (Optional) What fields are required?
- [ ] (Optional) Is the page required?

If there is any ambiguity, stop, confirm with the user intent and details, and then proceed.

### Steps to create or update a page:
Step 1: Create or update the specific page in `pages` or `chapters`.
Step 2: Update the `config/form.js` file to add or update the new page or chapter.
Step 3: Use [web-component-patterns](.github/instructions/web-component-rjsf-patterns.instructions.md) for code format patterns and validation.
Step 4: Validate web component patterns are used correctly by referencing `platform/forms-system/src/js/web-component-patterns/web-component-patterns-catalog.json`.
Step 5: Fix formatting issues using
- `yarn lint:js:changed:fix`
- `yarn lint:js:untracked:fix`


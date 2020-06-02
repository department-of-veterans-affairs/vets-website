# Available ui:fields
**Table of Contents**

- [`ObjectField`](#objectfield)
    - [`schema` options](#schema-options)
        - [`title`](#title)
        - [`ui:hidden`](#uihidden)
    - [`uiSchema` options](#uischema-options)
        - [`ui:description`](#uidescription)
        - [`ui:options`](#uioptions)
            - [`expandUnder`](#expandunder)
            - [`expandUnderClassName`](#expandunderclassname)
            - [`showFieldLabel`](#showfieldlabel)
            - [`classNames`](#classnames)
        - [`ui:order`](#uiorder)
        - [`ui:title`](#uititle)

## `ObjectField`
This is the default field for `type: 'object'` schemas.

### `schema` options
While most UI configuration is held in the `uiSchema`, the `ObjectField` has a
few options.

#### `title`
**Type:** `string`, React component

See [`ui:title`](#uititle) for usage; it's the same.

If a field in the object has both a `title` in the schema **and** a `ui:title`,
the `ui:title` will be used.

#### `ui:hidden`
**Type:** `bool`

When `ui:hidden` is added to the `schema` (**NOT** `uiSchema`) for an object's
property, it's not rendered in the form.

<!-- TODO: Change this into a warning box if possible -->
> **Note:** You almost never want to set this explicitly in your form's `schema`.
> This is used internally by some `uiSchema` options.

**Example**
```js
const schema = {
  type: 'object',
  properties: {
    field1: {
      type: 'string',
      'ui:hidden': true,
    },
    field2: { type: 'string' },
  },
};
```

![ui:hidden example](images/objectfield-uihidden.png)

### `uiSchema` options
#### `ui:description`
**Type:** `string`, React component

Describe the fields in more detail than a title can convey. Often, objects will
have a `ui:description` without a `ui:title`.

**Example: `string`**
```js
const schema = {
  type: 'object',
  properties: {
    field1: { type: 'string' },
  },
};

const uiSchema = {
  'ui:description':
    "The ui:description shows here. It's frequently used to display long-form text describing what the page is asking for.",
  field1: {
    'ui:title': 'First field',
  },
};
```
![ui:description example](images/objectfield-uidescription-string.png)

**React component props:**
- `formContext`: `object`
  - Contains information about the page
  - **TODO:** Document this in a separate place and link to it here
- `formData`: `object`
  - The user data gathered by the form
- `options`: `object`
  - The entire `ui:options` object used by the `ObjectField`

**Example: React component**
```js
const CustomDescription = ({ formData, options }) => (
  <div>
    This is a custom description. The first field contains '{formData.field1}
    ', and the pointless ui:option value in the uiSchema is '{options.pointless}
    '.
  </div>
);

const schema = {
  type: 'object',
  properties: {
    field1: { type: 'string' },
  },
};

const uiSchema = {
  'ui:description': CustomDescription,
  'ui:options': {
    pointless:
      'This value is not used by the forms library, but is passed to the custom description component',
  },
  field1: {
    'ui:title': 'First field',
  },
};
```
![ui:description example](images/objectfield-uidescription-react.png)

**Example: React component**

#### `ui:options`
##### `expandUnder`
##### `expandUnderClassName`
##### `showFieldLabel`
##### `classNames`
#### `ui:order`

#### `ui:title`
**Type:** `string`, React component

<!-- TODO: Add React component to the available types and give an example...if -->
<!-- we can use one, anyhow. Probably see what else we can use too -->

Display a title for the whole object.

**Example: `string`**
```js
const schema = {
  type: 'object',
  properties: {
    field1: { type: 'string' },
  },
};

const uiSchema = {
  'ui:title': 'Title for the object',
  field1: {
    'ui:title': 'The first field',
  },
};
```

![ui:title example](images/objectfield-uititle-string.png)

**React component props:**
- `id`: `string`
  - The ID for the title field
  - This will match the `id` for the input it's associated with, appended with `__title`
  - In the example below, the `id` passed to `CustomTitleComponent` is
  `root_title` because the object its on is the root of the schema
- `formContext`: `object`
  - Contains information about the page
  - **TODO:** Document this in a separate place and link to it here
- `formData`: `object`
  - The user data gathered by the form
- `required`: `bool`
  - Whether the field is required or not

**Example: React component**
```jsx
const CustomTitleComponent = ({ id, formData, required }) => (
  <h2 id={id}>
    {formData.field1}
    {required && '*'}
  </h2>
);

const schema = {
  type: 'object',
  properties: {
    field1: { type: 'string' },
  },
};

const uiSchema = {
  'ui:title': CustomTitleComponent,
  field1: {
    'ui:title': 'The contents of this field change the object label',
  },
};
```
![ui:title example](images/objectfield-uititle-react.png)

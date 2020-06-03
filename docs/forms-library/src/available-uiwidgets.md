# Available ui:widgets

**Table of Contents**

- [`CheckboxWidget`](#checkboxwidget)
- [`DateWidget`](#datewidget)
- [`EmailWidget`](#emailwidget)
- [`RadioWidget`](#radiowidget)
- [`SelectWidget`](#selectwidget)
- [`TextWidget`](#textwidget)
    - [`uiSchema` options](#uischema-options)
        - [`ui:options`](#uioptions)
            - [`autocomplete`](#autocomplete)
            - [`inputType`](#inputtype)
            - [`widgetClassNames`](#widgetclassnames)
    - [`schema` options](#schema-options)
        - [`maxLength`](#maxlength)
- [`TextareaWidget`](#textareawidget)
- [`YesNoWidget`](#yesnowidget)


## `CheckboxWidget`
**`ui:widget` key:** `checkbox`

## `DateWidget`
**`ui:widget` key:** `date`

## `EmailWidget`
**`ui:widget` key:** `email`

## `RadioWidget`
**`ui:widget` key:** `radio`

## `SelectWidget`
**`ui:widget` key:** `select`

## `TextWidget`
**`ui:widget` key:** `text`

Render an `<input>` element to the DOM.

**Compatible schema types:** `string`, `number`

**Default for schema types:** `string`, `number`

**Example: `string`**
```js
const schema = {
  type: 'object',
  properties: {
    field1: { type: 'string' },
  },
};
```
![TextWidget example](images/textwidget-string.png)

**Example: `number`**
```js
const schema = {
  type: 'object',
  properties: {
    field1: { type: 'number' },
  },
};
```
![TextWidget example](images/textwidget-number.png)

### `uiSchema` options
#### `ui:options`
##### `autocomplete`
**Type:** `string`

Set the [`autocomplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete)
on the `<input>` DOM element.

**Example:**
```js
const schema = {
  type: 'object',
  properties: {
    field1: { type: 'string' },
  },
};

const uiSchema = {
  field1: {
    'ui:options': {
      autocomplete: 'on',
    },
  },
};
```
Produces the following HTML:
```html
<input autocomplete="on" type="text" id="root_field1" name="root_field1" value="">
```

##### `inputType`
**Type:** `string`

Change the [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-type)
of the `<input>` DOM element. See [`<input>`
types](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#<input>_types)
for a list of available types.

> **Note:** Rather than change the `inputType` to `'email'` and `'date'`, it's
> better to use [`'ui:widget': 'email'`](#emailwidget) and [`'ui:widget':
> 'date'`](#datewidget) respectively.

**Example:**
```js
const schema = {
  type: 'object',
  properties: {
    field1: { type: 'string' },
  },
};

const uiSchema = {
  field1: {
    'ui:options': {
      inputType: 'password',
    },
  },
};
```
![TextWidget example](images/textwidget-inputtype.png)

##### `widgetClassNames`
**Type:** `string`

Specify the class names for the `<input>` DOM element.

**Example:**
```js
const schema = {
  type: 'object',
  properties: {
    field1: { type: 'string' },
  },
};

const uiSchema = {
  field1: {
    'ui:options': {
      widgetClassNames: 'foo',
    },
  },
};
```
![TextWidget example](images/textwidget-widgetclassnames.png)

### `schema` options

#### `maxLength`

**Type:** `number`

Set the `maxlength` on the `<intput>` DOM element.

**Example:**
```js
const schema = {
  type: 'object',
  properties: {
    field1: {
      type: 'string',
      maxLength: 3,
    },
  },
};
```
![TextWidget example](images/textwidget-maxlength.png)

## `TextareaWidget`
**`ui:widget` key:** `textarea`

## `YesNoWidget`
**`ui:widget` key:** `yesNo`

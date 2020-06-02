# Schema Types

## `type: 'object'`
The object type is used to group user input together in the form data.

<!-- TODO: Mention something about the special 'view:' naming -->

**Default field:** [`ObjectField`](available-uifields.md#objectfield)

**Default widget:** None; the objects are used to group inputs, but can gather
no data by themselves
<!-- TODO: Verify this is true -->

**Requirements:**
1. Must have a `properties` object in the schema

**Example:**
```js
const schema = {
  type: 'object',
  properties: {
    field1: { type: 'boolean' },
    field2: { type: 'string' },
  },
};
```

### `uiSchema` options
#### `ui:description`

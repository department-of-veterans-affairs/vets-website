# Schemaform walkthrough

This walkthrough is going to detail how our form building code (called schemaform from here on) and the library it's built on work. This guide assumes you're comfortable with React and building forms.

## JSON Schema

One pre-requisite for understanding how schemaform works is the JSON Schema standard. JSON Schema is a way of describing the allowed shape of JSON objects. There are some good examples to look through on the (JSON Schema site)[http://json-schema.org/examples.html]. Here are some basics:

Schema's have a type, that tells you what kind of data is allowed:

```
{ 
  type: 'string'
}
```

They can also have validation information, like regexes or length requirements:

```
{
  type: 'string',
  pattern: '^[ef]*$',
  minLength: 2
}
```

The above allows any string that's at least two characters and only contains `e` and `f`. So `eff` is valid, but `fcc` is not. You can also specify some built in `format` values for strings, like `email`, as a shortcut for including your own patterns.

Objects fields can be described:

```
{
  type: 'object',
  properties: {
    myField: {
      type: 'number'
    }
  }
}
```

This describes a json document that's an object with one property called `myField`, which is a number. So, `{ myField: 2 }` would be valid. 

However, `{}` is also valid. If you want to required a property in an object, you use the `required` property:

```
{
  type: 'object',
  required: ['myField'],
  properties: {
    myField: {
      type: 'number'
    }
  }
}
```

Note that `required` is on the object that contains the field, not the field itself.

Arrays work similarly to objects:

```
{
  type: 'array',
  items: {
    type: 'boolean'
  }
}
```

This describes an array of boolean values: `[true, false, true]`. Items can be an object schema or any other type of schema as well.

You can nest schemas as far down as you'd like. There are some other features, like metadata, sharing schema definitions between fields, and more complicated validation. But the above should get you most of the way there. There are many libraries that implement the JSON Schema spec and allow you to validate that an object matches a given schema. For reference, we use (ajv)[https://www.npmjs.com/package/ajv] and (jsonschema)[https://www.npmjs.com/package/jsonschema], the former in unit tests, and the latter in the schemaform code. ajv may go away eventually, since one of our dependencies is already using jsonschema.

## How react-jsonschema-form works

(react-jsonschema-form)[https://github.com/mozilla-services/react-jsonschema-form] (rjsf) generates a form from a JSON Schema, plus some other UI information. It does this by stepping through the schema depth first and rendering different React components based on what type of data each property in the schema represents. You can try out the playground in the above link to get a feel for the resulting forms based on the schema inputs. We're going to look at how that library generates those forms in the rest of this section.

At the top level, rjsf has a `Form` component that takes the schema inputs and renders a hierarchy of components for each "field" you see on the form. For example, a schema like

```
{
  type: 'string'
}
```

would render as

```
<SchemaField>
  <StringField>
    <FieldTemplate>
      <TextWidget/>
    </FieldTemplate>
  </StringField>
</SchemaField>
```

rjsf has two important concepts: fields and widgets. 

Fields generally match the `type` attribute in a schema. There are object fields, array fields, number fields, boolean fields, and string fields. The fields (with the exception of arrays and objects), render two things: a label (via `FieldTemplate`) and a widget. 

A widget is the actual html input element(s) used to accept data from the user. There are a bunch provided by the library: checkbox, date, text, email, select, etc. They are mostly self explanatory. We use a subset of them (text, email, checkbox, radio, select, and textarea) and have overriden the defaults with our own versions.

The two `Field` components in the hierarchy above are responsible for determining what fields and widgets to render. `SchemaField` uses the two schemas the library accepts, `schema` and `uiSchema`, to determine what other `Field` component to render. In the example above, it picked `StringField` because the schema type was `string`. The `StringField` component then figured out what widget to render, based on `schema` and `uiSchema`. It picked the `TextWidget` because there was no other information besides the field being a string, and that's the default widget type. Here's another example:

```
{
  type: 'string',
  enum: ['first', 'second', 'third']
}
```

The hierarchy for this field looks the same as above, except it uses `SelectWidget` instead of `TextWidget`, because `StringField` saw that the schema had an `enum` property:

```
<SchemaField>
  <StringField>
    <FieldTemplate>
      <SelectWidget/>
    </FieldTemplate>
  </StringField>
</SchemaField>
```

Most of the rules are unsurprising. They can be overriden in `uiSchema` by specifying a `ui:widget` property. You can set this to text, email, checkbox, or your own custom widget. There is also a `ui:field` property that you can use to specify a specific field (or a custom one).

There are two cases where a field component does something other than figure out what widgets to render. Those are for `object` and `array` schema types. For example,

```
{
  type: 'object',
  properties: {
    field1: {
      type: 'string'
    },
    field2: {
      type: 'string'
    }
  }
}
```

is an `object` schema with two string fields. In this case, the hierarchy looks like:

```
<SchemaField>
  <ObjectField>
    <SchemaField>
      <StringField>
        <FieldTemplate>
          <TextWidget/>
        </FieldTemplate>
      </StringField>
    </SchemaField>
    <SchemaField>
      <StringField>
        <FieldTemplate>
          <TextWidget/>
        </FieldTemplate>
      </StringField>
    </SchemaField>
  </ObjectField>
</SchemaField>
```

The `ObjectField` component renders a `SchemaField` component for each of its properties. Those properties are both `string` types, so it looks like our first hierarchy, but nested.

`ArrayField` works similarly, except that it renders a `SchemaField` component for each item in the array. The library has several variations of array fields, but we only use the one where each time is an object type schema, like this:

```
{
  type: 'array',
  items: {
    type: 'object',
    properties: {
      field1: {
        type: 'string'
      },
      field2: {
        type: 'string'
      }
    }
  }
}
```

The field components pass a collection of props down through each component. The important ones are:

- `name`
  - The property name of the current field. Something like `field1`, if we were using the object schema above.
- `required`
  - If the field is required or not (i.e. the property name is in the schema's `required` array).
- `schema`
  - The schema for the specific field. 
- `uiSchema`
  - The ui schema for this field.
- `errorSchema`
  - This is an object that contains the list of errors for the current field and any child properties, if the field is an array or object.
- `idSchema`
  - This is an object that contains the field ids for the current field and any child properties. The library generates ids for each field by joining each property name with an underscore.
- `formData`
  - The actual data entered for the field so far.
- `onChange`
  - Function that's called when any data is changed
- `onBlur`
  - Function that's called when focus is lost on a widget

These props are passed to all field components and most of them are passed to widget components.

When a user enters data, each widget calls `onChange`, listed above. Each component in the hierarchy passes its own `onChange` handler to its child fields and when some child data changes, it combines it with the rest of its data and calls the `onChange` prop passed to it from its parent. So, for example, if we have this object schema:

```
{
  type: 'object',
  properties: {
    field1: {
      type: 'string'
    }
  }
}
```

If the user types 'a', the `TextWidget` for field1 will call `onChange` with 'a'. That `onChange` prop came from the parent `ObjectField` component, which will take `a` and put it in an object as `field1` (`{ field1: 'a' }`), then call the `onChange` prop it was passed. Once it reaches the top level `Form` component, rjsf will run the JSON Schema validation on it and pass the results back down through the component hierarchy.

This is important to understand; similar to how Redux works, all state is kept in the root of the form, the `Form` component. Any data processing or validation happens in `Form` or is triggered by hooks provided by `Form`. The schemaform code built on top of this processes the schemas and form data in Redux, triggered by events provided by `Form`.

### UI schema

Along with the regular JSON Schema, a ui schema is also optionally defined for each field. This schema is used for ui specific options that don't fit within the JSON Schema standard. The primary use for it that's built into the library is for specifying custom fields and widgets for specific fields in the schema (using `ui:field` and `ui:widget`). We've extended it so that we also use it for label names, custom validation, and conditional required fields.

## How schemaform uses rjsf

The schemaform code uses rjsf to render form fields, but it builds a scaffolding on top of it to support multi-page forms and our common form patterns. There are two parts to this. The first part is customizing the provided fields and widgets from rjsf. The second part is creating a form configuration spec that allows devs to specify the structure of one of our multi-page forms.

### Customization

rjsf passes all field and widget components to `SchemaField` (and most other components) as a `registry` prop. The fields and widgets in that registry can be overriden by passing components of the same name into the main `Form` component provided by the library. We have written our own versions of the following components:

- `ObjectField`
- `ArrayField`
- `FieldTemplate`
- `TextWidget`
- `SelectWidget`
- `EmailWidget`
- `CheckboxWidget`
- `RadioWidget`
- `TextareaWidget`

We've also written some custom fields and widgets:

- `YesNoWidget`
- `AddressField`
- `DateWidget`

Writing custom widgets is similar to writing any other React component. There's a value passed in and an `onChange` hook is provided for changing data. Other props like the schemas and field id are also provided.

Custom fields are more complicated. They receive all the props listed previously for field components in rjsf.

In addition to customizing fields and widgets, our schemaform code hooks into a number of events provided by `Form` to support our form patterns. These can be found in our `FormPage` component. Those events are:

- `validate`
  - Whenever validation occurs, this event is called. We call our custom validation, which reads uiSchema for custom validation hooks that have been included for form fields, which is necessary because we can't do all our validations with what JSON Schema provides. 
- `transformErrors`
  - The error messages provided by JSON Schema are not user friendly, so rjsf provides this event where we receive the list of JSON Schema validation errors and can return a transformed list. We replace the messages with a set of default messages and also with any messages provided for specific fields in uiSchema. We also move the errors for required fields from the object level to the field level. If you remember, JSON Schema specifies required fields with a `required` array on an object field schema. So any errors about missing data are associated with that object. We move those errors so they're associated with the field that's missing, so they show up on that field on the actual form.
- `onError`
  - This is called if a user tries to submit a form with a validation error. We set a `submitted` flag in `formContext`, which is an object passed to all fields and components in the rjsf form. Our `FieldTemplate` component uses this to display all error messages to the user.
- `onSubmit`
  - This is called when a user submits a form and there are no validation errors. When this happens the schemaform code looks for the next page in our multi-page form and navigates to it.
- `onChange`
  - This is called when a user changes data in the form. We fire a Redux action and update the store with the new data. In the reducer code, we do several calculations:
    1. Recalculate the required fields for the schema.
      - We allow devs to specify functions in uiSchema that set fields as optional or required based on form data. This runs them and updates the schema.
    2. Recalculate which schema fields are hidden and remove that data
      - Also in uiSchema, devs can specify fields that are conditionally hidden based on user data. We update the schema to add a `ui:hidden` property and remove any user data for those fields, so we avoid any validation errors from data a user can't see.
    3. Recalcuate any general schema updates
      - We also allow devs to make arbitrary changes to the schema based on form data, so we need to make those changes, too. An example of this is removing options in an `enum` array when a user has entered certain data.

## Multi-page forms

The way we organize large forms is into chapters and pages. Each chapter is a collection of pages. Each page is rendered as a single rjsf form and has a schema and uiSchema. All of the chapter and page organization is described in a form config file. We generate a list of routes from the config file and a user can move through the list of pages until they reach the review page. 

The review page also takes the config file and renders each chapter in an accordion panel. Inside each panel we render each page using rjsf with two sets of widgets, so that we can show a "read-only" view. The read-only view uses simplified widgets and different `FieldTemplate` to render each form field in a definition list. The rjsf `Form` component is still being used, but there are no input elements being used; widgets render text instead. When a user clicks Edit for a form page on the review page, the normal widgets are used and a normal form is rendered.

Array fields work slightly differently on the review page. Because we want to render each array item read only and allow individual items to be editing independently, the review `ArrayField` component renders each item in the array as it's own rjsf `Form`. Array fields are also pulled out of the read only view for the page they're on and shown separately.


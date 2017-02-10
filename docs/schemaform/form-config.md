## Form config

Forms are created by creating a page that uses FormApp from the schemaform folder, a form config object, and routes generated from that config file. See `src/js/edu-benefits/1995` for an example.

Form config options:
- `urlPrefix`: Prefix string to add to the path for each page
- `introduction`: The introduction page component to use. Intro page is skipped if not provided
- `confirmation`: The confirmation page component to use after form is successfully submitted
- `trackingPrefix`: The prefix for Google Analytics events that are sent for different form actions
- `title`: The title of the form. Displayed on all pages
- `subTitle`: The subtitle (e.g. form number) of the form. Displayed on all pages, if there's also a title
- `defaultDefinitions`: Schema definitions to include on all pages. Can be overriden using definitions object in page schema
- `chapters`: Object containing the configuration for each chapter. Each property is the key for a chapter
  - `title`: The title of the chapter
  - `pages`: Object containing the pages for each chapter. Each property is the key for a page and should be unique across chapters
    - `path`: The url for the page
    - `title`: The title of the page. This will show up only on the review page
    - `initialData`: Any initial data that should be set for the form
    - `uiSchema`: Object containing the uiSchema for the page. Follows the format in the react-jsonschema-form docs, which some vets.gov specific additions. See below.
    - `schema`: JSON schema object for the page. Follows the standard JSON schema format

By convention, starting field names with `view:` will exclude them from the output sent to the backend. If the field is an object, its properties will be merged into the parent object of the `view:` field (TODO).

The `schema` and `uiSchema` objects should have similar structure. In other words, they should have the same fields organized the same way. The main difference between the structure of the two objects is that the uiSchema object does not have to contain all the fields that the schema object does and it does not need a `properties` object for sub-fields. So given this schema, for example:

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

The matching uiSchema would be:

```
{
  'ui:title': 'My form',
  field1: {
    'ui:title': 'My field'
  }
}
```

This does not apply to array fields; for those, you still need to specify an `items` object that contains the fields for each row in the array.

### uiSchema configuration
In addition to the uiSchema options listed in the library docs, we have some additional options that are supported for all forms:

- `ui:validations`: This is an array of validation functions that can be used to add validation that is not possible through JSON Schema. See below for the properties passed to the validation functions and how to use them.
- `ui:title`: We use this instead of the title property in the JSON Schema
- `ui:description`: We use this instead of the description property in the JSON Schema. This can be a string or a React component and would normally used on object fields in the schema to provide description text or html before a block of fields
- `ui:required`: Use this to provide a function to make a field conditionally required. First argument is the current form data and the second is the formContext object, which will contain the form data for other pages (tbd). You should avoid making a field required in the JSON schema and using `ui:required` on the same field.
-  `ui:errorMessages`: An object with field specific error messages. Structured by error name (from JSON schema error types). This is passed to custom validations in `ui:validations` if you want to allow configurable error messages in a validator.

- In the `ui:options` property:
  - `widgetClassNames`: This is a string of class names that will be added to the widget for the current field. Similar to the default `classNames` property, but will put the class names on the input/select/etc element itself, rather than a surrounding `div`.
  - `viewField`: For Array fields, this is a component that is shown when the item in the array is being shown read-only on a normal form page (i.e. not on the review page).
  - `expandUnder`: If you want a field to only be shown when another field is true, set this option to the property name. It will follow our ExpandingGroup pattern and expand underneath the field it is set to.
  - `hideOnReview`: Set this if you want to hide this field on the review page.
  - `hideOnReviewIfFalse`: Set this if you want to hide this field on the review page when the field value is falsy

### Writing custom validations

JSON Schema does not provide all the validation options we need in our forms, so we've created an additional way to add field validations, using `ui:validations` in the uiSchema object. `ui:validations` is an array and each item can be a function or an object. If you pass a function, it will be called with the following arguments:

- errors: The errors object for the field.
- currentData: The data for the field.
- formData: The current form (page) data.
- formContext: The form context object passed into the form library's Form component.
- errorMessages: The error messsage object (if available) for thie field.

Every validation function should update the errors object with any errors found. This is done by calling its `addErrors()` method. Here's an example:

```
function validateSSN(errors, ssn) {
  if (!isValidSSN(ssn)) {
    errors.addError('Please enter a valid nine digit SSN (dashes allowed)');
  }
}
```

Items in the `ui:validations` array can also be objects. Objects should have two properties:

- options: Object (or anything, really) that will be passed to your validation function. You can use this to allow your validation function to be configurable for different fields on the form.
- validator: A function with the same signature as above, plus the options object.

You don't have to limit your use of `ui:validations` to non-object fields (i.e. the ones that become visible inputs on the form). You can also validate objects, which allows you to compare subfields. For example, given this schema:

```
{ type: 'object', properties: { email: { type: 'string' }, confirmEmail: { type: 'string' } } }
```

If you use `ui:validations` on this object field (instead of on the email or confirmEmail fields) you can compare the two fields:

```
export function validateEmailsMatch(errors, formData) {
  const { email, confirmEmail } = formData;
  if (email !== confirmEmail) {
    errors.confirmEmail.addError('Please ensure your entries match');
  }
}
```


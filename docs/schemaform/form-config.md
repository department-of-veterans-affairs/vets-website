## Form config

Forms are created by creating a page that uses FormApp from the schemaform folder, a form config object, and routes generated from that config file. See `src/js/edu-benefits/1995` for an example.

```js
{
  // Prefix string to add to the path for each page
  urlPrefix: '',
  
  // The introduction page component to use. Intro page is skipped if not provided
  introduction: IntroductionComponent,
  
  // The confirmation page component to use after form is successfully submitted
  confirmation: ConfirmationComponent, 
  
  // The prefix for Google Analytics events that are sent for different form actions
  trackingPrefix: '', 
  
  // The title of the form. Displayed on all pages
  title: '', 

  // The subtitle (e.g. form number) of the form. Displayed on all pages, if there's also a title
  subTitle: '',

  // Schema definitions to include on all pages. Can be overriden using definitions object in
  // page schema
  defaultDefinitions: {}, 

  // Object containing the configuration for each chapter. Each property is the key for a chapter
  chapters: { 
    
    // The title of the chapter
    title: '', 
    
    // Object containing the pages for each chapter. Each property is the key for a
    // page and should be unique across chapters
    pages: { 
      
      // The url for the page
      path: 'some-path', 
      
      // The title of the page. This will show up only on the review page
      title: '', 
      
      // Any initial data that should be set for the form
      initialData: {}, 
      
      // Object containing the uiSchema for the page. Follows the format in the react-jsonschema-form
      // docs, which some vets.gov specific additions. See below.
      uiSchema: {}, 
      
      // JSON schema object for the page. Follows the standard JSON schema format
      schema: {}
    }
  }
}
```

By convention, starting field names with `view:` will exclude them from the output sent to the backend. If the field is an object, its properties will be merged into the parent object of the `view:` field.

The `schema` and `uiSchema` objects should have similar structure. In other words, they should have the same fields organized the same way. The main difference between the structure of the two objects is that the uiSchema object does not have to contain all the fields that the schema object does and it does not need a `properties` object for sub-fields. So given this schema, for example:

```js
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

```js
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

```js
{
  // This is an array of validation functions that can be used to add validation
  // that is not possible through JSON Schema. See below for the properties passed
  // to the validation functions and how to use them.
  'ui:validations': [
    function (errors, fieldData, pageData) {
    }
  ],
  
  // We use this instead of the title property in the JSON Schema
  'ui:title': '', 
  
  // We use this instead of the description property in the JSON Schema. This can be
  // a string or a React component and would normally used on object fields in the
  // schema to provide description text or html before a block of fields
  'ui:description': '',

  // Use this to provide a function to make a field conditionally required. First
  // argument is the current form data and the second is the formContext object,
  // which will contain the form data for other pages (tbd). You should avoid making
  // a field required in the JSON schema and using `ui:required` on the same field.
  'ui:required': function (pageData) {
    return true || false;
  },
  
  // An object with field specific error messages. Structured by error name (from JSON
  // Schema error types). This is passed to custom validations in `ui:validations` if
  // you want to allow configurable error messages in a validator.
  'ui:errorMessages': {
    errorType: ''
  },
  'ui:options': {
    
    // This is a string of class names that will be added to the widget for the current
    // field. Similar to the default `classNames` property, but will put the class names
    // on the input/select/etc element itself, rather than a surrounding `div`.
    widgetClassNames: '', 
    
    // For Array fields, this is a component that is shown when the item in the array is
    // being shown read-only on a normal form page (i.e. not on the review page).
    viewField: RowViewComponent, 
    
    // If you want a field to only be shown when another field is true, set this option
    // to the property name. It will follow our ExpandingGroup pattern and expand underneath
    // the field it is set to.
    expandUnder: '', 
    
    // Set this if you want to hide this field on the review page.
    hideOnReview: true || false,

    // Set this if you want to hide this field on the review page when the field value is falsy
    hideOnReviewIfFalse: true || false 

    // Function that conditionally hides fields in the form
    hideIf: function (fieldData) {
      return true || false;
    }

    // Function that conditionally replaces the current field's schema

    updateSchema: function (fieldData, pageData) {
      return {};
    }
  }
}
```

### Writing custom validations

JSON Schema does not provide all the validation options we need in our forms, so we've created an additional way to add field validations, using `ui:validations` in the uiSchema object. `ui:validations` is an array and each item can be a function or an object. If you pass a function, it will be called with the following arguments:

- errors: The errors object for the field.
- fieldData: The data for the field.
- pageData: The current form (page) data.
- schema: The current JSON Schema for the field.
- errorMessages: The error messsage object (if available) for thie field.

Every validation function should update the errors object with any errors found. This is done by calling its `addErrors()` method. Here's an example:

```js
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

```js
{ 
  type: 'object',
  properties: {
    email: {
      type: 'string'
    },
    confirmEmail: {
      type: 'string'
    }
  }
}
```

If you use `ui:validations` on this object field (instead of on the email or confirmEmail fields) you can compare the two fields:

```js
export function validateEmailsMatch(errors, formData) {
  const { email, confirmEmail } = formData;
  if (email !== confirmEmail) {
    errors.confirmEmail.addError('Please ensure your entries match');
  }
}
```


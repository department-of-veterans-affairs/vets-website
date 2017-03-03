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

  // Schema definitions that can be referenced on any page. These are added to each page's schema
  // in the reducer code, so that you don't have to put all of the common fields in the definitions
  // property in each page schema.
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
      initialData: {
        field1: 'Default string'
      }, 
      
      // JSON schema object for the page. Follows the JSON Schema format.
      schema: {
        type: 'object',
        properties: {
          field1: {
            type: 'string'
          },
          // String/boolean/number/array fields that start with view: will be excluded 
          // from data sent to server
          // Objects that start with view: will not be sent, but their children will be merged
          // into the parent object and will be sent
          // These can be used to remove fields from what is sent to the server, like if we have
          // a question that is only used to reveal other questions
          'view:field2': {
            type: 'string'
          }
        }
      },
      
      // Object containing the uiSchema for the page. Follows the format in the react-jsonschema-form
      // docs, with some vets.gov specific additions. See below.
      uiSchema: {
        'ui:title': 'My form',
        field1: {
          'ui:title': 'My field'
        }
      }
    }
  }
}
```

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

This does not apply to array fields; for those, you still need to specify an `items` object that contains the fields for each row in the array in the uiSchema:

```js
{
  'ui:title': 'My form',
  toursOfDuty: {
    items: {
      branchName: {
        'ui:title': 'Branch'
      }
    }
  }
}
```

### uiSchema configuration
In addition to the uiSchema options listed in the library [https://github.com/mozilla-services/react-jsonschema-form#the-uischema-object](docs), we have some additional options that are supported for all forms:

```js
{
  // We use this instead of the title property in the JSON Schema
  'ui:title': '', 
  
  // We use this instead of the description property in the JSON Schema. This can be
  // a string or a React component and would normally be used on object fields in the
  // schema to provide description text or html before a block of fields
  'ui:description': '' || DescriptionComponent,
  
  // Customize the field or widget you're using
  'ui:field': '' || FieldComponent,
  'ui:widget': '' || WidgetComponent,
  
  // This widget will be shown on the review page. Should always be used if you specify
  // a custom widget component, but can be used with regular widgets as well. Currently
  // only implemented for string fields
  'ui:reviewWidget': WidgetComponent,

  // Use this to provide a function to make a field conditionally required.   
  // The current page data is the only parameter. You should avoid having
  // a field required in the JSON schema and using `ui:required` on the same field.
  'ui:required': function (pageData) {
    return true || false;
  },
  
  // This is an array of validation functions or objects that can be used to add validation
  // that is not possible through JSON Schema. See below for the properties passed
  // to the validation functions and how to use them.
  'ui:validations': [
    function (errors, fieldData, pageData, fieldSchema, errorMessages) {
      errors.addError('My error');
    },
    {
      validator: (errors, fieldData, pageData, fieldSchema, errorMessages, options) => {
        errors.addError('My other error');
      },
      options: {}
    }
  ],
  
  // An object with field specific error messages. Structured by error name (from JSON
  // Schema error types). This is passed to custom validations in `ui:validations` if
  // you want to allow configurable error messages in a validator.
  'ui:errorMessages': {
    'pattern': 'Please provide a value in the right format'
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
    // to the property name. It will wrap the fields in an ExpandingGroup component with
    // the expandUnder field as the first question.
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

## Schemaform cookbook

Here are some common situations you might run into when building a form and how to address them.

### I need to write custom validation

JSON Schema does not provide all the validation options we need in our forms, so we've created an additional way to add field validations, using `ui:validations` in the uiSchema object. `ui:validations` is an array and each item can be a function or an object. If you pass a function, it will be called with the following arguments:

- errors: The errors object for the field.
- fieldData: The data for the field.
- pageData: The current form (page) data.
- schema: The current JSON Schema for the field.
- errorMessages: The error messsage object (if available) for the field.

Every validation function should update the errors object with any errors found. This is done by calling its `addErrors()` method. Here's an example:

```js
function validateSSN(errors, ssn) {
  if (!isValidSSN(ssn)) {
    errors.addError('Please enter a valid 0 digit SSN (dashes allowed)');
  }
}
```

Items in the `ui:validations` array can also be objects. Objects should have two properties:

- options: Object (or anything, really) that will be passed to your validation function. You can use this to allow your validation function to be configurable for different fields on the form.
- validator: A function with the same signature as above, plus the options object.

```js
{
  validator: (errors, ssn, pageData, schema, errorMessages, options) => {
    if (!isValidWidget(ssn, options.someOption)) {
      errors.addError('Please enter a valid 9 digit SSN (dashes allowed)');
    }
  },
  options: {
    someOption: true
  }
}
```

### I need to validate a field based on other fields in the same object

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

This function then should be referenced in the uiSchema:

```js
{
  'ui:validations': [ validateEmailsMatch ],
  email: {
    'ui:title': 'Email address'
  },
  confirmEmail: {
    'ui:title': 'Re-enter email address'
  }
}
```

### I want to change the options of a dropdown based on some other field data

You can use the `updateSchema` option in uiSchema to change the list of enums:

```js
{
  'ui:options': {
    updateSchema: (fieldData, pageData) {
      if (pageData.myField === 'otherOption') {
        return {
          enum: ['option1', 'option2'],
          enumNames: ['Option 1', 'Option 2']
        }
      } else {
        return {
          enum: ['option1', 'option2'],
          enumNames: ['Option 1', 'Option 2']
        }
      }
    }
  }
}
```

The object returned is not used as an exact replacement for the schema. If there are other properties in the current schema, those won't be removed. Only the properties in the returned object will be changed in the current schema.

Note that if you have a long list of options, you may want to create all the variations of the schema outside of the update function and use the update function to switch between them. This way you're not creating a new schema object each time data changes in the form and forcing your field to re-render.

### I want to show a block of text without any fields.

You can use 'ui:description' to show text or a custom component before the fields in a particular object in the schema. If you want to just have a block of text with no fields after it, you can create an empty view object:

```js
// schema
{
  type: 'object',
  properties: {
    'view:textObject': {
      type: 'object',
      properties: {}
    }
  }
}

// uiSchema
{
  'view:textObject': {
    'ui:description': 'My text'
  }
}
```

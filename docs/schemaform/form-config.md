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
  // For more information on definitions, see schema.definitions below.
  defaultDefinitions: {},

  // Function called after data migrations are run, for prefilled data, to make updates
  // to the data or form schema before a user starts filling in a prefilled form
  prefillTransformer: (pages, formData, metadata ) => { pages, formData, metadata }

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
      // This can also be a function that receives the current data as a param
      title: formData => `A title for ${formData.thing}`,

      // Any initial data that should be set for the form
      initialData: {
        field1: 'Default string'
      },

      // You can also set a page to turn its schema into
      // a page for each item in an array. So if you have an array of children, and you want
      // to have a page for each one, you can do that here
      // The schema/uiSchema for this kind of page should be built as usual for an array field
      showPagePerItem: true,
      // The path to the array to use
      arrayPath: 'children',
      // A function you can use to filter out items in the array that you don't want
      // to create a page for
      itemFilter: () => true,
      // You must specify a path with an :index parameter
      path: 'some-path/:index',

      // JSON schema object for the page. Follows the JSON Schema format.
      schema: {
        type: 'object',
        // In a schema's properties, there are references to definitions. For example:
        //   "homePhone": { "$ref": "#/definitions/phone" }
        // In the config file, the definition for phone would then need to be added into definitions
        // for it to be parsed correctly and added to homePhone.
        definitions: {},
        properties: {
          field1: {
            type: 'string'
          },
          // String/boolean/number/array fields that start with view: will be excluded
          // from data sent to server
          // Objects that start with view: will not be sent, but their children will be merged
          // into the parent object and will be sent
          // These can be used to remove fields from what is sent to the server, like if we have
          // a question that is only used to reveal other questions or group related questions
          // together to be conditionally revealed that aren't in an object in the schema
          'view:field2': {
            type: 'string'
          },
          'view:artificialGroup'{
            type: 'object',
            properties: {
              // view:artificialGroup will be flattened; subField1 and subField2 will be
              // siblings of field1 when sent to the api
              subField1: {
                type: 'string'
              },
              subField2: {
                type: 'boolean'
              }
            }
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
If you're not already familiar with the rjsf uiSchema options, check out the [library docs](https://github.com/mozilla-services/react-jsonschema-form#the-uischema-object). Some commonly used options include:

- [ui:order](https://github.com/mozilla-services/react-jsonschema-form#object-fields-ordering)
  - An array of field names in the order in which they should appear
- [ui:widget](https://github.com/mozilla-services/react-jsonschema-form#alternative-widgets)
  - The name of an alternative widget to use for the field
  - Example of a custom widget: `yesNo`
- [ui:field](https://github.com/mozilla-services/react-jsonschema-form#custom-field-components)
  - Specifies the name of a custom field
- [classNames](https://github.com/mozilla-services/react-jsonschema-form#custom-css-class-names)
  - Specifies the class names to put on the component

We've also been adding some additional uiSchema functionality not found in the rjsf library:

```js
{
  // We use this instead of the title property in the JSON Schema
  'ui:title': '',
  // It can also be a component, which will have the current form data passed as prop
  'ui:title': ({ formData }) => <legend>{`A ${formData.thing} title`}</legend>,

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
  // The data in the whole form (with no page breaks) is the only parameter.
  // You should avoid having a field required in the JSON schema and using `ui:required`
  // on the same field.
  // The index argument is provided if you use `ui:required` on data inside an array
  'ui:required': function (formData, index) {
    return true || false;
  },

  // This is an array of validation functions or objects that can be used to add validation
  // that is not possible through JSON Schema. See below for the properties passed
  // to the validation functions and how to use them.
  'ui:validations': [
    /**
     * Note the difference between the three data parameters:
     *
     * @param {any} fieldData The data for the current field being validated
     * @param {object} formData The data for all the fields in every page
     */
    function (errors, fieldData, formData, fieldSchema, errorMessages) {
      errors.addError('My error');
    },
    {
      validator: (errors, fieldData, formData, fieldSchema, errorMessages, options) => {
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

    // This is an map of enum values to labels that will be shown by the select and radio
    // widgets.
    labels: {
      chapter30: 'A readable description (Chapter 30)'
    },

    // This is a map of values to a component, some text, or some jsx. If your field
    // is a radio widget, the content here will be shown underneath the radio button
    // for that value when it is selected.
    nestedContent: {
      'value': <p>Some text</p>
    },

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

    // If you need to match on a specific value, you can use this option to specify a value
    // that the expandUnder field's data should equal. 
    expandUnderCondition: 'someValue',
    // This can also be a function, which receives the expandUnder field's data as an argument
    expandUnderCondition: (field) => field === 'someValue' || field === 'someOtherValue',

    // If you're using the expandUnder option, you can set this option on the field specified
    // by expandUnder and it will add classes to the div that wraps all of the fields when
    // they are expanded. See cookbook for an example use case.
    expandUnderClassNames: '',

    // Set this if you want to hide this field on the review page.
    hideOnReview: true || false,

    // Set this if you want to hide this field on the review page when the field value is falsy
    hideOnReviewIfFalse: true || false

    // Function that conditionally hides fields in the form
    // The index argument is provided if you use `ui:required` on data inside an array
    hideIf: function (formData, index) {
      return true || false;
    }

    // Function that conditionally replaces the current field's schema
    // The index argument is provided if you use `ui:required` on data inside an array
    updateSchema: function (formData, schema, uiSchema, index, pathToCurrentData) {
      // This function should return an object with the properties you want to update
      // It will not completely replace the existing schema, just update the individual
      // properties
      return {
        type: 'string'
      };
    },

    // Use this if you have an array field that should not be pulled out of the
    // page its in and shown separately on the review page
    keepInPageOnReview: true
  }
}
```

## Schemaform cookbook

Here are some common situations you might run into when building a form and how to address them.

### I need to write custom validation

JSON Schema does not provide all the validation options we need in our forms, so we've created an additional way to add field validations, using `ui:validations` in the uiSchema object. `ui:validations` is an array and each item can be a function or an object. If you pass a function, it will be called with the following arguments:

- errors: The errors object for the field.
- fieldData: The data for the field.
- formData: The current form data.
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
  validator: (errors, ssn, formData, schema, errorMessages, options) => {
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
export function validateEmailsMatch(errors, pageData) {
  const { email, confirmEmail } = pageData;
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
    updateSchema: (form, pageSchema) {
      if (form.myField === 'otherOption') {
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
### I want to conditionally hide a group of fields

We may have some fields that are siblings to others, but need to be hidden conditionally. Take the following schema snippet (from the education benefits form 22-5490):

```json
"previousBenefits": {
  "type": "object",
  "properties": {
    "disability": { "type": "boolean" },
    "dic": { "type": "boolean" },
    "chapter31": { "type": "boolean" },
    "ownServiceBenefits": { "type": "string" },
    "chapter35": { "type": "boolean" },
    "chapter33": { "type": "boolean" },
    "transferOfEntitlement": { "type": "boolean" },
    "other": { "type": "string" },
    "veteranFullName": { "$ref": "#/definitions/fullName" },
    "veteranSocialSecurityNumber": { "$ref": "#/definitions/ssn" }
  }
}
```

Only `chapter35`, `chapter33`, `transferOfEntitlement`, `veteranFullName`, and `veteranSocialSecurityNumber` need to be hidden conditionally, so we can make the `schema` and `uiSchema` like so:

```js
// schema
{
  disability: { ... },
  dic: { ... },
  chapter31: { ... },
  ownServiceBenefits: { ... },
  'view:sponsorServiceOptions': {
    chapter35: { ... },
    chapter33: { ... },
    transferOfEntitlement: { ... },
    veteranFullName: { ... },
    veteranSocialSecurityNumber: { ... }
  },
  other: { ... }
}

// uiSchema
{
  disability: { ... },
  dic: { ... },
  chapter31: { ... },
  ownServiceBenefits: { ... },
  'view:sponsorServiceOptions': {
    hideIf: (formData) => /* Some condition here */,
    chapter35: { ... },
    chapter33: { ... },
    transferOfEntitlement: { ... },
    veteranFullName: { ... },
    veteranSocialSecurityNumber: { ... }
  },
  other: { ... }
}
```

When this form is sent to the backend, the fields in the `view:sponsorServiceOptions` object will be moved up one level and sent alongside `dic` and `chapter31`. The back end will never see objects with names that start with `view:`, but it will get all the fields inside of them.

## I want to indent or style the fields that are using expandUnder

If you need to indent all the fields that are being expanded/collapsed with the expandUnder option, or do some other styling, you can set a class on the controlling field.

```js
// uiSchema
{
  field1: {
    'ui:title': 'This field expands/collapses other items',
    'ui:options': {
      expandUnderClassNames: 'schemaform-expandUnder-indent'
    }
  },
  field2: {
    'ui:title': 'This field is controlled by field1'
    'ui:options': {
      expandUnder: 'field1'
    }
  },
  field3: {
    'ui:title': 'This field is controlled by field1'
    'ui:options': {
      expandUnder: 'field1'
    }
  }
}
```

Now, `schemaform-expandUnder-indent` will be applied to the div that surrounds `field2` and `field3`. This class currently indents the fields, so if that's what you need, you're all set. If you need to do other styling, you can create a new class to use here and add your own styles.

## I want to skip / conditionally include a page based on some information

We use the `depends` property on the page to determine whether the page is active or not. For example, your chapter config might look like this:
```js
chapterName: {
  title: 'Chapter Title',
  pages: {
    pageName: {
      ...
      schema: {
        type: 'object',
        properties: {
          passPhrase: { type: 'string' }
        }
      }
    }
    otherPageName: {
      title: 'Page title',
      path: 'path/to/page',
      initialData: {},
      depends: {
        passPhrase: 'open sesame'
      },
      uiSchema: {},
      schema: {}
    }
  }
}
```
If you then enter 'open sesame' for the `passPhrase` on the first page, `otherPageName` will be active. If you enter anything else (or nothing), `otherPageName` won't be active, and the page will be skipped.

`depends` can work in a few ways:
```js
// With an object
depends: {
  passPhrase: 'open sesame'
}

// With an array
// This will activate the page if any of the items in the array are true. Think || not &&.
depends: [
  { passPhrase: 'open sesame' },
  { passPhrase: 'open up!' }
]

// With a function
depends: (formData) => {
  // return bool, true if page is active, false if page should be skipped
  return formData.passPhrase === 'open sesame' && formData.codeWord === 'chicken';
}
```

# Field library

We have many common field and widgets that are available for use in forms. You should stick with these common fields and definitions if at all possible.

There are generally two forms of common definitions: schema/uiSchema objects and functions that return schema/uiSchema objects. For the function versions, there will be documentation in the fields for the parameters.

## Widgets

There are a set of common widgets that are included by default. You can use these by setting `ui:widget` for a field to the name. Some of them are associated with particular schema types or formats. Widgets are located in `src/js/common/schemaform/widgets`.

Widget       | Default schema type or format
------------ | -------------
TextWidget | type: string
SelectWidget | type: string with an enum property
RadioWidget |
CheckboxWidget | type: boolean
yesNo |

There are more widgets than just these, but we normally use definitions they're included in, rather than just the field. These are the ones you're likely to have to set at some point in a config file.

## Definitions

We also have a set of common definitions. Some of our common field patterns are more complex than widgets and have common label text, validation, or field components. These definitions include all those things. The simpler ones are provided as schema and uiSchema objects which you can import and overwrite to customize. Others are more complex and are functions that require certain parameters. Definitions are located in `src/js/common/schemaform/definitions`.

### Address
- File: src/js/common/schemaform/definitions/address.js
- uiSchema: Yes
- schema: Yes
- Function or object: Functions

### Autosuggest
- File: src/js/common/schemaform/definitions/autosuggest.js
- uiSchema: Yes
- schema: Yes (for use when you are not using an `enum` in the schema)
- Function or object: Function for uiSchema, object for schema

This is our common type-ahead widget, which lets users type in values and narrow down a long list of options.

### Bank account
- File: src/js/common/schemaform/definitions/bankAccount.js
- uiSchema: Yes
- schema: No
- Function or object: Object

This is for our common EFT information field, where we collect account type (checking/savings), bank account number, and routing number.

### Currency
- File: src/js/common/schemaform/definitions/currency.js
- uiSchema: Yes
- schema: No
- Function or object: Function

### Current or past dates
- File: src/js/common/schemaform/definitions/currentOrPastDate.js
- uiSchema: Yes
- schema: No
- Function or object: Function

Our common date field with current or past validation set

### Current or past month/year
- File: src/js/common/schemaform/definitions/currentOrPastMonthYear.js
- uiSchema: Yes
- schema: No
- Function or object: Function

Our common date field without the day field and with current or past validation set

### Date
- File: src/js/common/schemaform/definitions/date.js
- uiSchema: Yes
- schema: No
- Function or object: Function

Our common date field with basic date validation

### Date range
- File: src/js/common/schemaform/definitions/dateRange.js
- uiSchema: Yes
- schema: No
- Function or object: Function

Two of our common date fields, with validation that they must form a valid range

### File upload
- File: src/js/common/schemaform/definitions/file.js
- uiSchema: Yes
- schema: Yes (but it isn't different from the ones in vets-json-schema)
- Function or object: Function for uiSchema, object for schema

Our file upload field. You'll need to specify at least an endpoint for the upload.

### Full name
- File: src/js/common/schemaform/definitions/fullName.js
- uiSchema: Yes
- schema: No
- Function or object: Object

Our normal name field, which is first, middle, last, and suffix

### Month/year
- File: src/js/common/schemaform/definitions/monthYear.js
- uiSchema: Yes
- schema: No
- Function or object: Function

Our common date field without the day field and with basic validation

### Month/year range
- File: src/js/common/schemaform/definitions/monthYearRange.js
- uiSchema: Yes
- schema: No
- Function or object: Function

Two of our common date fields without the day field and with validation to make sure they're a valid range

### Non-military jobs
- File: src/js/common/schemaform/definitions/nonMilitaryJobs.js
- uiSchema: Yes
- schema: No
- Function or object: Object

The schema for an array of non-military jobs. May be pretty education specific and not broadly useful.

### Non-required full name
- File: src/js/common/schemaform/definitions/nonRequiredFullName.js
- uiSchema: No
- schema: Yes
- Function or object: Function

Function that will take in a full name schema and set the required field list to empty on it.

### Person ID
- File: src/js/common/schemaform/definitions/personId.js
- uiSchema: Yes
- schema: Yes
- Function or object: Function

One common pattern we have is asking for an SSN with a checkbox that you can check if you don't have one and instead input a VA file number.

### Phone
- File: src/js/common/schemaform/definitions/phone.js
- uiSchema: Yes
- schema: No
- Function or object: Function

Phone number with very loose validation

### Social Security number
- File: src/js/common/schemaform/definitions/ssn.js
- uiSchema: Yes
- schema: No
- Function or object: Object

SSN with default label text and validation

### Year
- File: src/js/common/schemaform/definitions/year.js
- uiSchema: Yes
- schema: No
- Function or object: Object

Text field with validation that it's a current or past year.

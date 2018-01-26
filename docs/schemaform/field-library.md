# Field library

We have many common field and widgets that are available for use in forms. Stick with these common fields and definitions if at all possible.

There are generally two forms of common definitions: schema/uiSchema objects and functions that return schema/uiSchema objects. For the function versions, there will be documentation below for the parameters

## Widgets

There are a set of common widgets that are included by default. You can use these by setting `ui:widget` for a field to the name. Some of them are associated with particular schema types or formats. Widgets are located in `src/js/common/schemaform/widgets`.

Widget       | Default schema type or format
------------ | -------------
TextWidget | type: string
SelectWidget | type: string with an enum property
RadioWidget |
CheckboxWidget | type: boolean
yesNo |

There are more widgets that just these, but we normally use definitions they're included in, rather than just the field. These are the ones you're likely to have to set at some point in a config file.

## Definitions

We also have a set of common definitions. Some of our common field patterns are more complex than widgets and have common label text, validation, or field components. These definitions include all those things. The simpler ones are provided as schema and uiSchema objects which you can import and overwrite to customize. Others are more complex and are functions that require certain parameters. Definitions are located in `src/js/common/schemaform/definitions`.

### Address
File: src/js/common/schemaform/definitions/address.js
uiSchema: Yes
schema: Yes
Function or object: Functions

### Autosuggest
File: src/js/common/schemaform/definitions/autosuggest.js
uiSchema: Yes
schema: Yes (for use when you are not using an `enum` in the schema)
Function or object: Function for uiSchema, object for schema

This is our common type-ahead widget, which lets users type in values and narrow down a long list of options.

### Bank account
File: src/js/common/schemaform/definitions/bankAccount.js
uiSchema: Yes
schema: No
Function or object: Object

This is for our common EFT information field, where we collect account type (checking/savings), bank account number, and routing number.

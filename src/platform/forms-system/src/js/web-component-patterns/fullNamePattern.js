// TODO:

// import { validateWhiteSpace } from 'platform/forms/validations';
// import { fullName as fullNameDef } from 'vets-json-schema/dist/definitions.json';
// import utilsOmit from 'platform/utilities/data/omit';
// import VaTextInputField from '../web-component-fields/VaTextInputField';

// /**
//  * @typedef {Object} Options
//  * @property {string} personType
//  * @property {string|string[]} omit
//  * @property {string|string[]} required
//  */

// const ensureArray = value => {
//   if (Array.isArray(value)) {
//     return value;
//   }
//   return value ? [value] : [];
// };

// export function validateName(errors, pageData) {
//   const { first, last } = pageData;
//   validateWhiteSpace(errors.first, first);
//   validateWhiteSpace(errors.last, last);
// }

// /**
//  * @param {Object} schema
//  * @param {Options} options
//  * @returns {Object}
//  */
// const applySchemaOptions = (schema, options) => {
//   let newSchema = schema;

//   if (options) {
//     newSchema = { ...schema };

//     const omit = ensureArray(options.omit);
//     const required = ensureArray(options.required);

//     if (omit) {
//       newSchema.properties = utilsOmit(omit, schema.properties);
//     }
//     if (required) {
//       newSchema.required = required;
//     }
//   }
//   return newSchema;
// };

// /**
//  * @param {Options} options
//  */
// const uiSchema = options => {
//   return applySchemaOptions(
//     {
//       'ui:validations': [validateName],
//       first: {
//         'ui:title': options.personType
//           ? `${options.personType} first name`
//           : 'First name',
//         'ui:autocomplete': 'given-name',
//         'ui:webComponentField': VaTextInputField,
//         'ui:errorMessages': {
//           required: 'Please enter a first name',
//         },
//       },
//       last: {
//         'ui:title': options.personType
//           ? `${options.personType} last name`
//           : 'Last name',
//         'ui:autocomplete': 'family-name',
//         'ui:webComponentField': VaTextInputField,
//         'ui:errorMessages': {
//           required: 'Please enter a last name',
//         },
//       },
//       middle: {
//         'ui:title': options.personType
//           ? `${options.personType} middle name`
//           : 'Middle name',
//         'ui:webComponentField': VaTextInputField,
//         'ui:autocomplete': 'additional-name',
//       },
//       suffix: {
//         'ui:title': options.personType
//           ? `${options.personType} suffix`
//           : 'Suffix',
//         'ui:autocomplete': 'honorific-suffix',
//         'ui:options': {
//           widgetClassNames: 'form-select-medium',
//         },
//       },
//     },
//     options,
//   );
// };

// const schema = options => {
//   if (options) {
//     return applySchemaOptions(fullNameDef, options);
//   }
//   return {
//     $ref: '#/definitions/fullName',
//   };
// };

// /**
//  * @param {Object} [options]
//  * @param {string} [options.personType]
//  * @param {string|string[]} [options.omit]
//  * @param {string|string[]} [options.required]
//  * @returns {{
//  *  schema: { [key: string]: any },
//  *  uiSchema: { [key: string]: any }
//  * }}
//  */
// const schemas = options => {
//   return {
//     uiSchema: uiSchema(options),
//     schema: schema(options),
//   };
// };

// export default schemas;

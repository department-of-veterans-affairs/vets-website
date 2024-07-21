import { VaTextInputField, VaTextareaField } from '../web-component-fields';

/**
 * @typedef {Object} TextUIOptions
 * @property {UITitle} [title]
 * @property {UIDescription} [description]
 * @property {UIHint} [hint]
 * @property {UICharcount} [charcount]
 * @property {UIWidth} [width]
 * @property {UIErrorMessages} [errorMessages]
 * @property {string} [messageAriaDescribedby]
 * @property {UIInputType} [inputType]
 * @property {UIAutocomplete} [autocomplete]
 * @property {UIUseFormsPattern} [useFormsPattern]
 * @property {UIFormHeading} [formHeading]
 * @property {UIFormDescription} [formDescription]
 * @property {UIFormHeadingLevel} [formHeadingLevel]
 * @property {UILabelHeaderLevel} [labelHeaderLevel]
 */

/**
 * @module TextPatterns
 */

/**
 * Considerations:
 * - Can we instead use a specific text pattern?
 *   - phoneUI, emailUI, numberUI
 * - Do mobile users need to use a different `inputType` keyboard?
 * - Can we provide `autocomplete`?
 *
 * @example
 * exampleText: textUI('Simple text field')
 * exampleText: textUI({
 *   title: 'Text field',
 *   hint: 'This is a hint',
 *   description: 'This is a description',
 *   charcount: true, // Used with minLength and maxLength in the schema
 *   width: 'sm',
 *   errorMessages: {
 *     required: 'Please enter a valid email',
 *   },
 * })
 *
 * @example
 * // Use this if you need JSX description to be read by screen readers
 * exampleText: textUI({
 *   title: 'Text field',
 *   useFormsPattern: 'single',
 *   formHeading: 'Form page title',
 *   formHeadingLevel: 3,
 *   formDescription: (<p>This is a description</p>)
 * })
 *
 * @example
 * // Usage schema:
 * exampleText: textSchema,
 * required: ['exampleText']
 *
 * // or
 * exampleText: {
 *   type: 'string',
 *   minLength: 10,
 *   maxLength: 30,
 * }
 *
 * @param {UIOptions | TextUIOptions} stringOrOptions
 * @returns {UISchemaOptions}
 * @function
 */
export const textUI = stringOrOptions => {
  if (typeof stringOrOptions === 'string') {
    return {
      'ui:title': stringOrOptions,
      'ui:webComponentField': VaTextInputField,
    };
  }

  const {
    title,
    description,
    errorMessages,
    required,
    autocomplete,
    validations,
    reviewField,
    hidden,
    ...uiOptions
  } = stringOrOptions;

  return {
    'ui:title': title,
    'ui:description': description,
    'ui:required': required,
    'ui:webComponentField': VaTextInputField,
    'ui:reviewField': reviewField,
    'ui:autocomplete': autocomplete,
    'ui:hidden': hidden,
    'ui:validations': validations,
    'ui:options': {
      ...uiOptions,
    },
    'ui:errorMessages': errorMessages,
  };
};

/**
 * Schema for generic text field
 *
 * If you need to use `maxLength` or `minLength`, just define manually rather than use this.
 *
 * @example
 * exampleText: {
 *   type: 'string',
 *   minLength: 10,
 *   maxLength: 30,
 * }
 */
export const textSchema = {
  type: 'string',
};

/**
 * Web component v3 uiSchema for generic textarea field
 *
 * Usage uiSchema:
 * @example
 * exampleText: textareaUI('Simple textarea field')
 * exampleText: textareaUI({
 *   title: 'Textarea field',
 *   hint: 'This is a hint',
 *   description: 'This is a description',
 *   charcount: true, // Used with minLength and maxLength in the schema
 * })
 *
 * Usage schema:
 * exampleText: textareaSchema,
 * required: ['exampleText']
 *
 * // or
 * exampleText: {
 *   type: 'string',
 *   minLength: 10,
 *   maxLength: 30,
 * }
 *
 * // About `labelHeaderLevel`:
 * //
 * // Simply use the label as the form header.
 * //
 * // About `useFormsPattern`:
 * //
 * // Advanced version of `labelHeaderLevel`.
 * // Used with `formDescription`, `formHeading`, and `formHeadingLevel`
 * // when the label of the field should be the actual form title and
 * // have a description with JSX that should be read out by screen readers.
 *
 * @param {UIOptions & TextUIOptions} stringOrOptions
 * @returns {UISchemaOptions}
 */
export const textareaUI = stringOrOptions => {
  if (typeof stringOrOptions === 'string') {
    return {
      'ui:title': stringOrOptions,
      'ui:webComponentField': VaTextareaField,
    };
  }

  const {
    title,
    description,
    errorMessages,
    required,
    autocomplete,
    validations,
    reviewField,
    hidden,
    ...uiOptions
  } = stringOrOptions;

  return {
    'ui:title': title,
    'ui:description': description,
    'ui:required': required,
    'ui:webComponentField': VaTextareaField,
    'ui:reviewField': reviewField,
    'ui:hidden': hidden,
    'ui:autocomplete': autocomplete,
    'ui:validations': validations,
    'ui:options': {
      ...uiOptions,
    },
    'ui:errorMessages': errorMessages,
  };
};

/**
 * Schema for generic textarea field
 *
 * If you need to use `maxLength` or `minLength`, just define manually rather than use this.
 *
 * ```js
 * exampleText: {
 *   type: 'string',
 *   minLength: 10,
 *   maxLength: 30,
 * }
 * ```
 */
export const textareaSchema = {
  type: 'string',
};

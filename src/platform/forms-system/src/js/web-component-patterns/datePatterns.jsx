import React from 'react';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import VaMemorableDateField from '../web-component-fields/VaMemorableDateField';
import {
  validateCurrentOrPastMemorableDate,
  validateDateRange,
} from '../validation';

/**
 * @typedef {Object} DateUIOptions
 * @property {UITitle} [title]
 * @property {UIDescription} [description]
 * @property {UIHint} [hint]
 */

/**
 * @module DatePatterns
 */

/**
 * Web component v3 uiSchema for current or past dates
 *
 * @example
 * exampleDate: currentOrPastDateUI('Date of event')
 * exampleDate: currentOrPastDateUI({
 *  title: 'Date of event',
 *  hint: 'This is a hint'
 * })
 * exampleDate: {
 *  ...currentOrPastDateUI('Date of event')
 * }
 * @param {string | UIOptions | DateUIOptions} [options] accepts a single string for title, or an object of options
 * @returns {UISchemaOptions} uiSchema
 * @function
 */
const currentOrPastDateUI = options => {
  const { title, description, errorMessages, ...uiOptions } =
    typeof options === 'object' ? options : { title: options };

  const uiTitle = title ?? 'Date';

  return {
    'ui:title': uiTitle,
    'ui:description': description,
    'ui:webComponentField': VaMemorableDateField,
    'ui:validations': [validateCurrentOrPastMemorableDate],
    'ui:errorMessages': {
      pattern:
        errorMessages?.pattern || 'Please enter a valid current or past date',
      required: errorMessages?.required || 'Please enter a date',
    },
    'ui:options': {
      ...uiOptions,
    },
    'ui:reviewField': ({ children }) => (
      <div className="review-row">
        <dt>{uiTitle}</dt>
        <dd>
          {children.props.formData && (
            <>
              {new Date(
                `${children.props.formData}T00:00:00`,
              ).toLocaleDateString('en-us', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </>
          )}
        </dd>
      </div>
    ),
  };
};

/**
 * Web component v3 uiSchema for current or past date range
 *
 * @example
 * // Simple usage:
 * exampleDateRange: currentOrPastDateRangeUI(
 *   'Start date of event',
 *   'End date of event',
 *   'Custom error message'
 * )
 *
 * // Advanced usage:
 * exampleDateRange: currentOrPastDateRangeUI(
 *   { title: 'Start date of event', ... },
 *   { title: 'End date of event', hint: 'This is a hint' },
 *   'Custom error message'
 * })
 * @param {string | UIOptions | DateUIOptions} [fromOptions] accepts a single string for start/from date title, or an object of options
 * @param {string | UIOptions | DateUIOptions} [toOptions] accepts a single string for to/end date title, or an object of options
 * @param {string} [errorMessage] - Optional custom error message for the date range validation
 * @returns {UISchemaOptions} uiSchema
 * @function
 */
const currentOrPastDateRangeUI = (fromOptions, toOptions, errorMessage) => {
  let fromLabel = 'From date';
  let toLabel = 'To date';
  let fromCustomOptions = {};
  let toCustomOptions = {};

  // Check if advanced options object is provided
  if (typeof fromOptions === 'object' && typeof toOptions === 'object') {
    // Extract custom options
    fromLabel = fromOptions.title || fromLabel;
    toLabel = toOptions.title || toLabel;
    fromCustomOptions = { ...fromOptions };
    toCustomOptions = { ...toOptions };
  } else {
    // Simple usage: assign labels
    fromLabel = fromOptions || fromLabel;
    toLabel = toOptions || toLabel;
  }

  return {
    'ui:validations': [
      {
        validator: (errors, fieldData, formData, schema, uiSchema) => {
          validateDateRange(
            errors,
            fieldData,
            formData,
            schema,
            uiSchema,
            true,
          );
        },
      },
    ],
    from: currentOrPastDateUI({ title: fromLabel, ...fromCustomOptions }),
    to: currentOrPastDateUI({ title: toLabel, ...toCustomOptions }),
    ...(errorMessage && { 'ui:errorMessages': { pattern: errorMessage } }),
  };
};

/**
 * Web component v3 uiSchema for current or past dates with digit select for month
 *
 * @example
 * exampleDate: currentOrPastDateDigitsUI('Date of event')
 * exampleDate: currentOrPastDateDigitsUI({
 *  title: 'Date of event',
 *  hint: 'This is a hint'
 * })
 * exampleDate: {
 *  ...currentOrPastDateDigitsUI('Date of event')
 * }
 * @param {string | UIOptions | DateUIOptions} [options] accepts a single string for title, or an object of options
 * @returns {UISchemaOptions} uiSchema
 * @function
 */
const currentOrPastDateDigitsUI = options => {
  const { title, description, ...uiOptions } =
    typeof options === 'object' ? options : { title: options };

  return currentOrPastDateUI({
    title,
    description,
    monthSelect: false,
    ...uiOptions,
  });
};

/**
 * Web component v3 uiSchema for date of birth
 *
 * @example
 * dateOfBirth: dateOfBirthUI()
 * dateOfBirth: dateOfBirthUI('Stepchild’s date of birth')
 * dateOfBirth: dateOfBirthUI({
 *    title: 'Stepchild’s date of birth',
 *    hint: 'This is a hint'
 * })
 * @param {string | UIOptions | DateUIOptions} [options] accepts a single string for title, or an object of options
 * @returns {UISchemaOptions} uiSchema
 * @function
 */
const dateOfBirthUI = options => {
  const { title, description, ...uiOptions } =
    typeof options === 'object' ? options : { title: options };

  return currentOrPastDateUI({
    title: title || 'Date of birth',
    description,
    errorMessages: {
      pattern: 'Please provide a valid date',
      required: 'Please provide the date of birth',
    },
    ...uiOptions,
  });
};

/**
 * Web component v3 uiSchema for date of death
 *
 * @example
 * dateOfDeath: dateOfDeathUI()
 * dateOfDeath: dateOfDeathUI('Stepchild’s date of death')
 * dateOfBirth: dateOfDeathUI({
 *    title: 'Stepchild’s date of death',
 *    hint: 'This is a hint'
 * })
 * @param {string | UIOptions | DateUIOptions} [options] accepts a single string for title, or an object of options
 * @returns {UISchemaOptions} uiSchema
 */
const dateOfDeathUI = options => {
  const { title, description, ...uiOptions } =
    typeof options === 'object' ? options : { title: options };

  return currentOrPastDateUI({
    title: title || 'Date of death',
    description,
    errorMessages: {
      pattern: 'Please provide a valid date',
      required: 'Please provide the date of death',
    },
    ...uiOptions,
  });
};

/**
 * @returns `commonDefinitions.date`
 */
const currentOrPastDateSchema = commonDefinitions.date;

/**
 * @returns `commonDefinitions.date`
 */
const currentOrPastDateDigitsSchema = commonDefinitions.date;

/**
 * @returns `commonDefinitions.date`
 */
const dateOfBirthSchema = commonDefinitions.date;

/**
 * @returns `commonDefinitions.date`
 */
const dateOfDeathSchema = commonDefinitions.date;

/**
 * Usage:
 * ```
 * dateRange: currentOrPastDateRangeSchema
 * dateRange: {
 *   ...currentOrPastDateRangeSchema
 *   required: []
 * }
 * ```
 */
const currentOrPastDateRangeSchema = {
  type: 'object',
  properties: {
    from: currentOrPastDateSchema,
    to: currentOrPastDateSchema,
  },
  required: ['from', 'to'],
};

export {
  currentOrPastDateUI,
  currentOrPastDateDigitsUI,
  dateOfBirthUI,
  dateOfDeathUI,
  currentOrPastDateRangeUI,
  currentOrPastDateRangeSchema,
  currentOrPastDateSchema,
  currentOrPastDateDigitsSchema,
  dateOfBirthSchema,
  dateOfDeathSchema,
};

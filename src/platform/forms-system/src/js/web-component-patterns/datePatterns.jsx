import React from 'react';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import VaMemorableDateField from '../web-component-fields/VaMemorableDateField';
import VaDateField from '../web-component-fields/VaDateField';
import {
  validateCurrentOrPastMemorableDate,
  validateCurrentOrPastMonthYear,
  validateDateRange,
} from '../validation';

/**
 * uiSchema for a generic current or past date
 *
 * ```js
 * exampleDate: currentOrPastDateUI('Date of event')
 * exampleDate: currentOrPastDateUI({
 *  title: 'Date of event',
 *  hint: 'This is a hint'
 * })
 * exampleDate: {
 *  ...currentOrPastDateUI('Date of event')
 * }
 * ```
 * @param {string | UIOptions & {
 *   title?: UISchemaOptions['ui:title'],
 *   hint?: string,
 *   errorMessages?: {
 *     pattern?: string,
 *     required?: string
 *   },
 *   dataDogHidden?: boolean,
 *   monthSelect?: boolean,
 *   monthYearOnly?: boolean,
 *   removeDateHint?: boolean,
 * }} [options] accepts a single string for title, or an object of options
 * @returns {UISchemaOptions} uiSchema
 */
const currentOrPastDateUI = options => {
  const {
    title,
    errorMessages,
    required,
    dataDogHidden = false,
    ...uiOptions
  } = typeof options === 'object' ? options : { title: options };

  // if monthYearOnly is used, the schema pattern also needs
  // to be updated, so prefer to use currentOrPastMonthYearDateUI
  // and currentOrPastMonthYearDateSchema rather than passing
  // monthYearOnly option to this directly
  const monthYearOnly = uiOptions?.monthYearOnly;

  const uiTitle = title ?? 'Date';
  const localeDateStringOptions = monthYearOnly
    ? { year: 'numeric', month: 'long' }
    : { year: 'numeric', month: 'long', day: 'numeric' };

  return {
    'ui:title': uiTitle,
    'ui:webComponentField': monthYearOnly ? VaDateField : VaMemorableDateField,
    'ui:required': required,
    'ui:validations': monthYearOnly
      ? [validateCurrentOrPastMonthYear]
      : [validateCurrentOrPastMemorableDate],
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
        <dd
          className={dataDogHidden ? 'dd-privacy-hidden' : undefined}
          data-dd-action-name={dataDogHidden ? uiTitle : undefined}
        >
          {children.props.formData && (
            <>
              {new Date(
                `${children.props.formData}T00:00:00`,
              ).toLocaleDateString('en-us', localeDateStringOptions)}
            </>
          )}
        </dd>
      </div>
    ),
  };
};

/**
 * uiSchema for a current or past month and year
 *
 * ```js
 * exampleDate: currentOrPastDateUI('Date of event')
 * exampleDate: currentOrPastDateUI({
 *  title: 'Date of event',
 *  hint: 'This is a hint'
 * })
 * exampleDate: {
 *  ...currentOrPastDateUI('Date of event')
 * }
 * ```
 * @param {string | UIOptions & {
 *   title?: UISchemaOptions['ui:title'],
 *   hint?: string,
 *   errorMessages?: {
 *     pattern?: string,
 *     required?: string
 *   },
 *   removeDateHint?: boolean,
 * }} [options] accepts a single string for title, or an object of options
 * @returns {UISchemaOptions} uiSchema
 */
const currentOrPastMonthYearDateUI = options => {
  return currentOrPastDateUI({
    ...options,
    monthYearOnly: true,
  });
};

/**
 * uiSchema for a "from" and "to" date range with current or past dates. Includes two fields.
 *
 * ```js
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
 * ```
 * @param {string | UIOptions & {
 *   title?: UISchemaOptions['ui:title'],
 *   hint?: string,
 *   removeDateHint?: boolean,
 * }} [options] accepts a single string for start/from date title, or an object of options
 * @param {string | UIOptions & {
 *   title?: UISchemaOptions['ui:title'],
 *   hint?: string,
 *   removeDateHint?: boolean,
 * }} [options] accepts a single string for to/end date title, or an object of options
 * @param {string} [errorMessage] - Optional custom error message for the date range validation
 * @returns {UISchemaOptions} uiSchema
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
 * uiSchema for month and year only date range. Includes two fields for "from" and "to" dates.
 *
 * ```js
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
 * ```
 * @param {string | UIOptions & {
 *   title?: UISchemaOptions['ui:title'],
 *   hint?: string,
 *   removeDateHint?: boolean,
 * }} [options] accepts a single string for start/from date title, or an object of options
 * @param {string | UIOptions & {
 *   title?: UISchemaOptions['ui:title'],
 *   hint?: string,
 *   removeDateHint?: boolean,
 * }} [options] accepts a single string for to/end date title, or an object of options
 * @param {string} [errorMessage] - Optional custom error message for the date range validation
 * @returns {UISchemaOptions} uiSchema
 */
const currentOrPastMonthYearDateRangeUI = (
  fromOptions,
  toOptions,
  errorMessage,
) => {
  return currentOrPastDateRangeUI(
    {
      ...fromOptions,
      monthYearOnly: true,
    },
    {
      ...toOptions,
      monthYearOnly: true,
    },
    errorMessage,
  );
};

/**
 * uiSchema for current or past dates with digit select for month
 *
 * ```js
 * exampleDate: currentOrPastDateDigitsUI('Date of event')
 * exampleDate: currentOrPastDateDigitsUI({
 *  title: 'Date of event',
 *  hint: 'This is a hint'
 * })
 * exampleDate: {
 *  ...currentOrPastDateDigitsUI('Date of event')
 * }
 * ```
 * @param {string | UIOptions & {
 *   title?: UISchemaOptions['ui:title'],
 *   hint?: string,
 *   monthYearOnly?: boolean,
 *   removeDateHint?: boolean,
 * }} [options] accepts a single string for title, or an object of options
 * @returns {UISchemaOptions} uiSchema
 */
const currentOrPastDateDigitsUI = options => {
  const { title, ...uiOptions } =
    typeof options === 'object' ? options : { title: options };

  return currentOrPastDateUI({
    title,
    monthSelect: false,
    ...uiOptions,
  });
};

/**
 * uiSchema for date of birth
 *
 * ```js
 * dateOfBirth: dateOfBirthUI()
 * dateOfBirth: dateOfBirthUI('Stepchild’s date of birth')
 * dateOfBirth: dateOfBirthUI({
 *    title: 'Stepchild’s date of birth',
 *    hint: 'This is a hint'
 * })
 * ```
 * @param {string | UIOptions & {
 *   title?: UISchemaOptions['ui:title'],
 *   hint?: string,
 *   monthYearOnly?: boolean,
 *   removeDateHint?: boolean,
 * }} [options] accepts a single string for title, or an object of options
 * @returns {UISchemaOptions} uiSchema
 */
const dateOfBirthUI = options => {
  const { title, ...uiOptions } =
    typeof options === 'object' ? options : { title: options };

  return currentOrPastDateUI({
    title: title || 'Date of birth',
    errorMessages: {
      pattern: 'Please provide a valid date',
      required: 'Provide a date of birth',
    },
    ...uiOptions,
  });
};

/**
 * uiSchema for date of death
 *
 * ```js
 * dateOfDeath: dateOfDeathUI()
 * dateOfDeath: dateOfDeathUI('Stepchild’s date of death')
 * dateOfBirth: dateOfDeathUI({
 *    title: 'Stepchild’s date of death',
 *    hint: 'This is a hint'
 * })
 * ```
 * @param {string | UIOptions & {
 *   title?: UISchemaOptions['ui:title'],
 *   hint?: string,
 *   monthYearOnly?: boolean,
 *   removeDateHint?: boolean,
 * }} [options] accepts a single string for title, or an object of options
 * @returns {UISchemaOptions} uiSchema
 */
const dateOfDeathUI = options => {
  const { title, ...uiOptions } =
    typeof options === 'object' ? options : { title: options };

  return currentOrPastDateUI({
    title: title || 'Date of death',
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

const monthYearDateSchema = {
  type: 'string',
  pattern: '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)$',
};

const currentOrPastMonthYearDateSchema = monthYearDateSchema;

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
 * Schema for currentOrPastDateRangeUI
 *
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

/**
 * Schema for currentOrPastMonthYearDateRangeUI
 *
 * Usage:
 * ```
 * dateRange: currentOrPastMonthYearDateRangeSchema
 * dateRange: {
 *   ...currentOrPastMonthYearDateRangeSchema
 *   required: []
 * }
 * ```
 */
const currentOrPastMonthYearDateRangeSchema = {
  type: 'object',
  properties: {
    from: currentOrPastMonthYearDateSchema,
    to: currentOrPastMonthYearDateSchema,
  },
  required: ['from', 'to'],
};

export {
  currentOrPastDateUI,
  currentOrPastDateDigitsUI,
  currentOrPastDateRangeUI,
  currentOrPastMonthYearDateUI,
  currentOrPastMonthYearDateRangeUI,
  dateOfBirthUI,
  dateOfDeathUI,
  currentOrPastDateRangeSchema,
  currentOrPastDateSchema,
  currentOrPastDateDigitsSchema,
  currentOrPastMonthYearDateSchema,
  currentOrPastMonthYearDateRangeSchema,
  dateOfBirthSchema,
  dateOfDeathSchema,
};

import React from 'react';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import VaMemorableDateField from '../web-component-fields/VaMemorableDateField';
import { validateCurrentOrPastMemorableDate } from '../validation';

/**
 * Web component v3 uiSchema for current or past dates
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
 * }} [options] accepts a single string for title, or an object of options
 * @returns {UISchemaOptions} uiSchema
 */
const currentOrPastDateUI = options => {
  const { title, errorMessages, ...uiOptions } =
    typeof options === 'object' ? options : { title: options };

  const uiTitle = title ?? 'Date';

  return {
    'ui:title': uiTitle,
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
 * Web component v3 uiSchema for current or past dates with digit select for month
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
 * Web component v3 uiSchema for date of birth
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
      required: 'Please provide the date of birth',
    },
    ...uiOptions,
  });
};

/**
 * Web component v3 uiSchema for date of death
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

export {
  currentOrPastDateUI,
  currentOrPastDateDigitsUI,
  dateOfBirthUI,
  dateOfDeathUI,
  currentOrPastDateSchema,
  currentOrPastDateDigitsSchema,
  dateOfBirthSchema,
  dateOfDeathSchema,
};

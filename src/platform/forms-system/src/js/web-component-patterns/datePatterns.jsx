import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import VaMemorableDateField from '../web-component-fields/VaMemorableDateField';
import { validateCurrentOrPastMemorableDate } from '../validation';

/**
 * Web component uiSchema for current or past dates
 *
 * ```js
 * exampleDate: currentOrPastDateUI('Date of event')
 * exampleDate: {
 *  ...currentOrPastDateUI('Date of event')
 * }
 * ```
 * @param {string} title
 * @returns {UISchemaOptions} uiSchema
 */
const currentOrPastDateUI = title => {
  return {
    'ui:title': title ?? 'Date',
    'ui:webComponentField': VaMemorableDateField,
    'ui:validations': [validateCurrentOrPastMemorableDate],
    'ui:errorMessages': {
      pattern: 'Please enter a valid current or past date',
      required: 'Please enter a date',
    },
  };
};

/** @type {UISchemaOptions} */
const DATE_OF_BIRTH_UI = {
  ...currentOrPastDateUI('Date of birth'),
  'ui:errorMessages': {
    pattern: 'Please provide a valid date',
  },
};

/**
 * Web component uiSchema for date of birth
 *
 * ```js
 * dateOfBirth: dateOfBirthUI()
 * dateOfBirth: dateOfBirthUI('Stepchild’s date of birth')
 * ```
 * @param {string} [title] optional title to override default 'Date of birth'
 * @returns {UISchemaOptions} uiSchema
 */
const dateOfBirthUI = title => {
  return title
    ? {
        ...DATE_OF_BIRTH_UI,
        'ui:title': title,
      }
    : DATE_OF_BIRTH_UI;
};

/**
 * @returns `commonDefinitions.date`
 */
const currentOrPastDateSchema = commonDefinitions.date;

/**
 * @returns `commonDefinitions.date`
 */
const dateOfBirthSchema = commonDefinitions.date;

export {
  currentOrPastDateUI,
  dateOfBirthUI,
  currentOrPastDateSchema,
  dateOfBirthSchema,
};

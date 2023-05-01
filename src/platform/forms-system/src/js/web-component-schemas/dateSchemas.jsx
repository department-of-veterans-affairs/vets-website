import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import { validateCurrentOrPastDate } from '../validation';
import VaMemorableDateField from '../web-component-fields/VaMemorableDateField';

/**
 * @param {string} title
 * @returns {UISchemaOptions}
 */
export const currentOrPastDateUI = title => {
  return {
    'ui:title': title,
    'ui:webComponentField': VaMemorableDateField,
    'ui:validations': [validateCurrentOrPastDate],
    uswds: true,
    'ui:errorMessages': {
      pattern: 'Please enter a valid current or past date',
      required: 'Please enter a date',
    },
  };
};

const schema = commonDefinitions.date;

/**
 * @returns {SchemaOptions}
 */
export const currentOrPastDateSchema = () => {
  return schema;
};

import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
import { isFullDate } from '@department-of-veterans-affairs/platform-forms/validations';
import currentOrPastDateUI from '@department-of-veterans-affairs/platform-forms-system/currentOrPastDate';
import { validateBurialAndDeathDates } from '../../../utils/validation';
import {
  isEligibleNonService,
  generateDescription,
  BurialDateWarning,
} from '../../../utils/helpers';

const { deathDate, burialDate } = fullSchemaBurials.properties;

export default {
  uiSchema: {
    'ui:description': generateDescription('Burial information'),
    deathDate: {
      ...currentOrPastDateUI('Date of death'),
      'ui:errorMessages': {
        required: 'Enter the Veteran’s date of death',
        pattern: 'Enter a valid date',
      },
    },
    burialDate: {
      ...currentOrPastDateUI(
        'Date of burial (includes cremation or interment)',
      ),
      'ui:errorMessages': {
        required: 'Enter the Veteran’s date of burial',
        pattern: 'Enter a valid date',
      },
    },
    'view:burialDateWarning': {
      'ui:description': BurialDateWarning,
      'ui:options': {
        hideIf: formData => {
          // If they haven’t entered a complete year, don’t jump the gun and show the warning
          if (formData.burialDate && !isFullDate(formData.burialDate)) {
            return true;
          }

          // Show the warning if the burial date was more than 2 years ago
          return isEligibleNonService(formData.burialDate);
        },
      },
    },
    'ui:validations': [validateBurialAndDeathDates],
  },
  schema: {
    type: 'object',
    required: ['burialDate', 'deathDate'],
    properties: {
      deathDate,
      burialDate,
      'view:burialDateWarning': { type: 'object', properties: {} },
    },
  },
};

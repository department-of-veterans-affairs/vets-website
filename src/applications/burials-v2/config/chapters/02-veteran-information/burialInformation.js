import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
import { isFullDate } from '@department-of-veterans-affairs/platform-forms/validations';
import { dateOfDeathUI } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { validateBurialAndDeathDates } from '../../../utils/validation';
import {
  isEligibleNonService,
  generateTitle,
  BurialDateWarning,
} from '../../../utils/helpers';

const { deathDate, burialDate } = fullSchemaBurials.properties;

export default {
  uiSchema: {
    'ui:title': generateTitle('Burial information'),
    deathDate: dateOfDeathUI('Date of death'),
    burialDate: dateOfDeathUI(
      'Date of burial (includes cremation or interment)',
    ),
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

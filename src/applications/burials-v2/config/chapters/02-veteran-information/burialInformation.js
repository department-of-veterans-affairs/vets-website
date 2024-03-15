import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
import { dateOfDeathUI } from 'platform/forms-system/src/js/web-component-patterns';
import { generateTitle } from '../../../utils/helpers';

const { deathDate, burialDate } = fullSchemaBurials.properties;

export default {
  uiSchema: {
    'ui:title': generateTitle('Burial information'),
    deathDate: dateOfDeathUI('Date of death'),
    burialDate: dateOfDeathUI(
      'Date of burial (includes cremation or interment)',
    ),
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

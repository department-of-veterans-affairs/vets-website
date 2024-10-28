import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { ExposureCategoriesLink } from '../../../components/FormDescriptions/OtherExposureDescriptions';

const { otherToxicExposure } = fullSchemaHca.properties;

export default {
  uiSchema: {
    ...titleUI(
      'Other toxic exposure',
      'You selected that you think you may have been exposed to other toxins or hazards.',
    ),
    'ui:description': ExposureCategoriesLink,
    otherToxicExposure: {
      'ui:title':
        'Enter any toxins or hazards you think you may have been exposed to',
      'ui:errorMessages': {
        pattern:
          'You entered a character we can\u2019t accept. You can use only these characters: . , ! ?',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      otherToxicExposure,
    },
  },
};

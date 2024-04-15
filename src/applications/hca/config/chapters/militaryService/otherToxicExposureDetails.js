import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { OtherToxicExposureDescription } from '../../../components/FormDescriptions';

const { otherToxicExposure } = fullSchemaHca.properties;

export default {
  uiSchema: {
    ...titleUI(
      'Other toxic exposure',
      'You selected that you were exposed to other toxins or hazards.',
    ),
    'ui:description': OtherToxicExposureDescription,
    otherToxicExposure: {
      'ui:title': 'Enter any toxins or hazards you\u2019ve been exposed to',
      'ui:errorMessages': {
        pattern: 'Please enter a valid toxin or hazard',
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

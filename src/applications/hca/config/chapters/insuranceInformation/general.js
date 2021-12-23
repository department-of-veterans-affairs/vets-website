import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';

import {
  healthInsuranceDescription,
  healthInsuranceCoverageQuestionDescription,
} from '../../../helpers';

const { isCoveredByHealthInsurance } = fullSchemaHca.properties;

export default {
  uiSchema: {
    'ui:description': healthInsuranceDescription,
    isCoveredByHealthInsurance: {
      'ui:title': 'Do you have health insurance coverage?',
      'ui:description': healthInsuranceCoverageQuestionDescription,
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    required: ['isCoveredByHealthInsurance'],
    properties: {
      isCoveredByHealthInsurance,
    },
  },
};

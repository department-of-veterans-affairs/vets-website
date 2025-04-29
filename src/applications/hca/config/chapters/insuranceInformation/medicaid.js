import { FULL_SCHEMA } from '../../../utils/imports';
import { MedicaidDescription } from '../../../components/FormDescriptions';

const { isMedicaidEligible } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    'ui:description': MedicaidDescription,
    isMedicaidEligible: {
      'ui:title': 'Are you eligible for Medicaid?',
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    required: ['isMedicaidEligible'],
    properties: {
      isMedicaidEligible,
    },
  },
};

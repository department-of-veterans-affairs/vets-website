import { FULL_SCHEMA } from '../../../utils/imports';
import { MedicarePartADescription } from '../../../components/FormDescriptions';

const { isEnrolledMedicarePartA } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    'ui:description': MedicarePartADescription,
    isEnrolledMedicarePartA: {
      'ui:title': 'Are you enrolled in Medicare Part A (hospital insurance)?',
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    required: ['isEnrolledMedicarePartA'],
    properties: {
      isEnrolledMedicarePartA,
    },
  },
};

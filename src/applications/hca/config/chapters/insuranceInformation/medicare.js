import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import { MedicarePartADescription } from '../../../components/FormDescriptions';

const { isEnrolledMedicarePartA } = fullSchemaHca.properties;

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

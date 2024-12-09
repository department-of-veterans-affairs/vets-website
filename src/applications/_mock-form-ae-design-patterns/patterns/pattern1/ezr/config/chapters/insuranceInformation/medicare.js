import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import MedicarePartADescription from '../../../components/MedicarePartADescription';
import content from '../../../../../../shared/locales/en/content.json';

export default {
  uiSchema: {
    'view:isEnrolledMedicarePartA': {
      'ui:title': MedicarePartADescription,
      isEnrolledMedicarePartA: yesNoUI(content['insurance-medicare-title']),
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:isEnrolledMedicarePartA': {
        type: 'object',
        required: ['isEnrolledMedicarePartA'],
        properties: {
          isEnrolledMedicarePartA: yesNoSchema,
        },
      },
    },
  },
};

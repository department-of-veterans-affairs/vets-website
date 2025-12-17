import {
  titleUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { nameWording, privWrapper } from '../../../shared/utilities';

export default {
  uiSchema: {
    ...titleUI(({ formData }) =>
      privWrapper(`${nameWording(formData)} Medicare Part B effective date`),
    ),
    'view:medicarePartBEffectiveDate': {
      ...titleUI({
        title: 'Medicare Part B',
        headerLevel: 2,
        headerStyleLevel: 3,
      }),
      applicantMedicarePartBEffectiveDate: currentOrPastDateUI({
        title: 'Effective date',
        hint:
          'This will be on the front of the Medicare card near “Coverage starts.”',
        classNames: 'vads-u-margin-top--neg1p5',
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:medicarePartBEffectiveDate': {
        type: 'object',
        required: ['applicantMedicarePartBEffectiveDate'],
        properties: {
          applicantMedicarePartBEffectiveDate: currentOrPastDateSchema,
        },
      },
    },
  },
};

import {
  titleUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { nameWording, privWrapper } from '../../../shared/utilities';

export default {
  uiSchema: {
    ...titleUI(({ formData }) =>
      privWrapper(`${nameWording(formData)} Medicare Part A effective date`),
    ),
    'view:medicarePartAEffectiveDate': {
      ...titleUI({
        title: 'Medicare Part A',
        headerLevel: 2,
        headerStyleLevel: 3,
      }),
      applicantMedicarePartAEffectiveDate: currentOrPastDateUI({
        title: 'Effective date',
        hint:
          'This will be on the front of the Medicare card near “Coverage starts” or “Effective date.”',
        classNames: 'vads-u-margin-top--neg1p5',
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:medicarePartAEffectiveDate': {
        type: 'object',
        required: ['applicantMedicarePartAEffectiveDate'],
        properties: {
          applicantMedicarePartAEffectiveDate: currentOrPastDateSchema,
        },
      },
    },
  },
};

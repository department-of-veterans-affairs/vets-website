import {
  titleUI,
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { isCustodian } from '../utils/helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Benefit type'),
    claims: {
      ...checkboxGroupUI({
        required: true,
        labels: {
          dic: 'Dependency and Indemnity Compensation (DIC)',
          survivorsPension: 'Survivors Pension',
          accruedBenefits: 'Accrued benefits',
        },
      }),
      'ui:options': {
        updateSchema: formData => {
          let title;
          if (isCustodian(formData)) {
            title =
              'Select the benefits you want to file a claim for on behalf of the Veteran’s child.';
          } else {
            title = 'Select the benefits you want to file a claim for.';
          }
          return { title };
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      claims: checkboxGroupSchema([
        'dic',
        'survivorsPension',
        'accruedBenefits',
      ]),
    },
  },
};

import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Dependent survivors of the beneficiary'),
    survivors: yesNoUI({
      title: 'Are there any dependent survivors of the beneficiary?',
      required: () => true,
    }),
    'view:survivorsMessage': {
      'ui:description':
        'Since there are dependent surviving relatives, you may not be eligible for reimbursement of last illness and burial expenses if you paid them.',
      'ui:options': {
        hideIf: formData => [false, undefined].includes(formData?.survivors),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      survivors: yesNoSchema,
      'view:survivorsMessage': {
        type: 'object',
        properties: {},
      },
    },
  },
};

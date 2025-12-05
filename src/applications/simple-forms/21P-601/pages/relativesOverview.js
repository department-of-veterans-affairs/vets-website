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
    'view:noSurvivorsMessage': {
      'ui:description':
        'Since there are no dependent surviving relatives, you may be eligible for reimbursement of last illness and burial expenses if you paid them.',
      'ui:options': {
        hideIf: formData => [true, undefined].includes(formData?.survivors),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      survivors: yesNoSchema,
      'view:noSurvivorsMessage': {
        type: 'object',
        properties: {},
      },
    },
  },
};

import {
  titleUI,
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Who survived the deceased beneficiary?'),
    survivors: checkboxGroupUI({
      title: 'Check all that apply',
      required: () => true,
      labels: {
        hasSpouse: 'Spouse',
        hasChildren: 'Child or children',
        hasParents: 'Parent(s)',
        hasNone: 'None (no surviving relatives)',
      },
    }),
    'view:noSurvivorsMessage': {
      'ui:description':
        'Since there are no surviving relatives, you may be eligible for reimbursement of last illness and burial expenses if you paid them.',
      'ui:options': {
        hideIf: formData => formData?.survivors?.hasNone !== true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      survivors: checkboxGroupSchema([
        'hasSpouse',
        'hasChildren',
        'hasParents',
        'hasNone',
      ]),
      'view:noSurvivorsMessage': {
        type: 'object',
        properties: {},
      },
    },
  },
};

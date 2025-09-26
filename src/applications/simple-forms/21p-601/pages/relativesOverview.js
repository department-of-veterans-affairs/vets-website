import {
  titleUI,
  checkboxUI,
  checkboxSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Who survived the deceased beneficiary?'),
    'ui:description': 'Check all that apply',
    hasSpouse: checkboxUI('Spouse'),
    hasChildren: checkboxUI('Child or children'),
    hasParents: checkboxUI('Parent(s)'),
    hasNone: checkboxUI('None (no surviving relatives)'),
    'view:noSurvivorsMessage': {
      'ui:description':
        'Since there are no surviving relatives, you may be eligible for reimbursement of last illness and burial expenses if you paid them.',
      'ui:options': {
        hideIf: formData => formData.hasNone !== true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      hasSpouse: checkboxSchema,
      hasChildren: checkboxSchema,
      hasParents: checkboxSchema,
      hasNone: checkboxSchema,
      'view:noSurvivorsMessage': {
        type: 'object',
        properties: {},
      },
    },
  },
};

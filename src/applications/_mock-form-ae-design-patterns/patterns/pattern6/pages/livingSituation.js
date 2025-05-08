import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

export default {
  title: 'Living Situation',
  path: 'living-situation',
  depends: formData => formData?.maritalStatus === 'MARRIED',
  uiSchema: {
    ...titleUI('Living situation'),
    currentlyLiveWithSpouse: {
      'ui:title': 'Do you currently live with your spouse?',
      'ui:widget': 'yesNo',
    },
    liveWithSpousePreviousYear: {
      'ui:title':
        'Did you live with your spouse for any part of the previous year?',
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    required: ['currentlyLiveWithSpouse', 'liveWithSpousePreviousYear'],
    properties: {
      currentlyLiveWithSpouse: { type: 'boolean' },
      liveWithSpousePreviousYear: { type: 'boolean' },
    },
  },
};

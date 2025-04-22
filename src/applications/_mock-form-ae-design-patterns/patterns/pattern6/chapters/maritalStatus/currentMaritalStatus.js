import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

export default {
  title: 'Current marital status',
  path: 'marital-status/current',
  uiSchema: {
    ...titleUI("What's your current marital status?"),
    maritalStatus: {
      'ui:title': ' ',
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          MARRIED: 'Married',
          DIVORCED: 'Divorced',
          WIDOWED: 'Widowed',
          SEPARATED: 'Separated',
          NEVER_MARRIED: 'Never married',
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['maritalStatus'],
    properties: {
      maritalStatus: {
        type: 'string',
        enum: ['MARRIED', 'DIVORCED', 'WIDOWED', 'SEPARATED', 'NEVER_MARRIED'],
      },
    },
  },
};

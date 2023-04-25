import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';

export default {
  uiSchema: {
    oldCheckbox: {
      'ui:title': 'Old checkbox',
    },
    newCheckbox: {
      'ui:title': 'New checkbox',
      'ui:webComponentField': VaCheckboxField,
    },
  },
  schema: {
    type: 'object',
    properties: {
      oldCheckbox: {
        type: 'boolean',
      },
      newCheckbox: {
        type: 'boolean',
      },
    },
  },
};

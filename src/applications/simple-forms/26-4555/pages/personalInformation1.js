import VaTextWidget from 'platform/forms-system/src/js/widgets/VaTextWidget';
import VaCheckbox from 'platform/forms-system/src/js/widgets/VaCheckbox';

export default {
  uiSchema: {
    myFields: {
      name: {
        'ui:title': 'Ninja Name web component',
        'ui:description': 'Enter your ninja name',
        'ui:WebComponent': 'VaTextWidget',
        'ui:widget': VaTextWidget,
      },
      name2: {
        'ui:title': 'Ninja Name',
      },
      isNinja: {
        'ui:title': 'Are you a ninja using web component?',
        'ui:WebComponent': VaCheckbox,
        'ui:widget': VaCheckbox,
        // 'ui:widget': 'yesNo',
      },
      isNinja2: {
        'ui:title': 'Are you a ninja?',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      myFields: {
        type: 'object',
        required: ['name', 'name2', 'isNinja', 'isNinja2'],
        properties: {
          name: {
            type: 'string',
          },
          name2: {
            type: 'string',
          },
          isNinja: {
            type: 'boolean',
          },
          isNinja2: {
            type: 'boolean',
          },
        },
      },
    },
  },
};

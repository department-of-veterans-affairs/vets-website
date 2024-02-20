import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Is there a VA regional office you’re associated with?',
      'This information often helps us locate certain records',
    ),
    vaRegionalOfficeName: {
      'ui:title': 'VA regional office name (optional)',
      'ui:webComponentField': VaTextInputField,
    },
  },
  schema: {
    type: 'object',
    properties: {
      vaRegionalOfficeName: {
        type: 'string',
      },
    },
  },
};

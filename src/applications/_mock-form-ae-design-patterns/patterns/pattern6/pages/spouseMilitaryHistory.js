import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

export default {
  title: 'Spouse’s military history',
  path: 'spouse-military-history',
  uiSchema: {
    ...titleUI('Spouse’s military history'),
    militaryServiceNumber: {
      'ui:title': 'Military Service Number',
      'ui:description':
        "If your form also requires a military service number, display this question on a conditional page named 'Spouse's military history' such as this example. This avoids having 2 conditional questions (military service number and VA file number) appear on the same page.",
      'ui:webComponentField': VaTextInputField,
    },
  },
  schema: {
    type: 'object',
    properties: {
      militaryServiceNumber: {
        type: 'string',
      },
    },
  },
};

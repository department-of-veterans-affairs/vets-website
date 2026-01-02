import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI(
      'Service status',
      'Later in this form you will be asked to upload documents confirming your service.',
    ),
    militaryHistory: {},
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

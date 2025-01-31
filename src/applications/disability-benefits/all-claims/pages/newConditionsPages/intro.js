import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...titleUI(
      'New conditions',
      'In the next few screens, we’ll ask you about the new condition or conditions you’re filing for compensation.',
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

export default introPage;

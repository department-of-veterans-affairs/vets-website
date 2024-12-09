import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...titleUI(
      'New conditions',
      'On the next few screens, we’ll ask you about the new condition or conditions you’re claiming for disability compensation.',
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

export default introPage;

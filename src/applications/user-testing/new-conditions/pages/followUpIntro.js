import { descriptionUI } from 'platform/forms-system/src/js/web-component-patterns';

import { CONDITIONS_FIRST } from '../constants';

/** @type {PageSchema} */
export default {
  title: 'Follow-up intro',
  depends: formData => formData.demo === 'CONDITIONS_FIRST',
  path: `new-conditions-${CONDITIONS_FIRST}-follow-up-intro`,
  uiSchema: {
    ...descriptionUI(
      'Now we’re going to ask you some follow-up questions about each of your conditions. We’ll go through them one by one.',
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

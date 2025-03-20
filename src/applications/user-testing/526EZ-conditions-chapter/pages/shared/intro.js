import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

import { ConditionsIntro } from '../../content/conditions';

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...titleUI('Add condition', ConditionsIntro),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

export default introPage;

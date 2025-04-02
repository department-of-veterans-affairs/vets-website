import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

import { ConditionsIntroDescription } from '../../content/conditions';

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...titleUI('Add your conditions', ConditionsIntroDescription),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

export default introPage;

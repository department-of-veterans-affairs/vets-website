import {
  descriptionUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import YourEmployersDescription from '../../components/YourEmployersDescription';

/** @type {PageSchema} */
export default {
  title: 'Your employers',
  path: 'your-employers',
  uiSchema: {
    ...titleUI('Your employers'),
    ...descriptionUI(YourEmployersDescription),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

import {
  descriptionUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import YourEducationHistoryDescription from '../../components/YourEducationHistoryDescription';

/** @type {PageSchema} */
export default {
  title: 'Your education history',
  path: 'your-education-history',
  uiSchema: {
    ...titleUI('Your education history'),
    ...descriptionUI(YourEducationHistoryDescription),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

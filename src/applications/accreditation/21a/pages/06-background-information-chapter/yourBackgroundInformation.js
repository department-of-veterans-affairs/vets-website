import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

import YourBackgroundInformationDescription from '../../components/YourBackgroundInformationDescription';

/** @type {PageSchema} */
export default {
  title: 'Your background information',
  path: 'your-background-information',
  uiSchema: {
    ...titleUI(
      'Your background information',
      YourBackgroundInformationDescription,
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

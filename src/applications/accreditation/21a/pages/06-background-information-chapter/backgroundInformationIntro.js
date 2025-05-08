import { descriptionUI } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

import BackgroundInformationIntro from '../../components/06-background-information-chapter/BackgroundInformationIntro';

/** @type {PageSchema} */
export default {
  title: 'Background information intro',
  path: 'background-information-intro',
  uiSchema: {
    ...descriptionUI(BackgroundInformationIntro),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

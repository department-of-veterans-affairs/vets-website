import { descriptionUI } from 'platform/forms-system/src/js/web-component-patterns';

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

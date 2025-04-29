import { descriptionUI } from 'platform/forms-system/src/js/web-component-patterns';

import PersonalInformationIntro from '../../components/01-personal-information-chapter/PersonalInformationIntro';

/** @type {PageSchema} */
export default {
  title: 'Personal information intro',
  path: 'personal-information-intro',
  uiSchema: {
    ...descriptionUI(PersonalInformationIntro),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

import { descriptionUI } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

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

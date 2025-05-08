import { descriptionUI } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

import EmploymentInformationIntro from '../../components/03-employment-information-chapter/EmploymentInformationIntro';

/** @type {PageSchema} */
export default {
  title: 'Employment information intro',
  path: 'employment-information-intro',
  uiSchema: {
    ...descriptionUI(EmploymentInformationIntro),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

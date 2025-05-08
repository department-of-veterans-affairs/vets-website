import { descriptionUI } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

import ProfessionalAffiliationsIntro from '../../components/05-professional-affiliations-chapter/ProfessionalAffiliationsIntro';

export default {
  title: 'Professional affiliations intro',
  path: 'professional-affiliations-intro',
  uiSchema: {
    ...descriptionUI(ProfessionalAffiliationsIntro),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

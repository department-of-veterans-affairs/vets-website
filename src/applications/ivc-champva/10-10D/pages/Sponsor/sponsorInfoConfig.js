import {
  dateOfBirthUI,
  dateOfBirthSchema,
  fullNameUI,
  fullNameSchema,
  titleUI,
  titleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { sponsorWording } from '../../helpers/wordingCustomization';

export const sponsorNameDobConfig = {
  uiSchema: {
    ...titleUI(
      ({ formData }) => `${sponsorWording(formData)} name and date of birth`,
      ({ formData }) =>
        formData?.certifierRole === 'sponsor'
          ? 'Please provide your information. We use this information to identify eligibility.'
          : `Please provide the information for your sponsor (this is the Veteran that you’re connected to). We’ll use this information to confirm your eligibility for CHAMPVA benefits.`,
    ),
    veteransFullName: fullNameUI(),
    sponsorDOB: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    required: ['sponsorDOB'],
    properties: {
      titleSchema,
      veteransFullName: fullNameSchema,
      sponsorDOB: dateOfBirthSchema,
    },
  },
};

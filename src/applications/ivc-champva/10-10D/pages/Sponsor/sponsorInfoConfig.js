import {
  dateOfBirthUI,
  dateOfBirthSchema,
  fullNameUI,
  fullNameSchema,
  titleUI,
  titleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { sponsorWording } from '../../helpers/wordingCustomization';

function descriptionText(formData) {
  // Base: if sponsor
  let wording =
    'Please provide your information. We use this information to identify eligibility.';

  // Adjust text if is applicant or third party
  if (formData.certifierRole !== 'sponsor') {
    const isApp = formData.certifierRole === 'applicant';
    wording = `Enter the personal information for ${
      isApp ? 'your' : 'the'
    } sponsor (the Veteran or service member that ${
      isApp ? 'you’re' : 'the applicant is'
    } connected to). We’ll use the sponsor’s information to confirm ${
      isApp ? 'your' : 'their'
    } eligibility for CHAMPVA benefits.`;
  }
  return wording;
}

export const sponsorNameDobConfig = {
  uiSchema: {
    ...titleUI(
      ({ formData }) => `${sponsorWording(formData)} name and date of birth`,
      ({ formData }) => descriptionText(formData),
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

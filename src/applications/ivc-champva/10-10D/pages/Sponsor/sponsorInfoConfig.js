import {
  dateOfBirthUI,
  dateOfBirthSchema,
  fullNameUI,
  fullNameSchema,
  titleUI,
  titleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { sponsorWording } from '../../helpers/utilities';

function descriptionText(formData) {
  // Adjust text if is applicant or third party
  const isApp =
    formData?.certifierRelationship?.relationshipToVeteran?.applicant;
  return `Enter the personal information for ${
    isApp ? 'your' : 'the'
  } sponsor (the Veteran or service member that ${
    isApp ? 'you’re' : 'the applicant is'
  } connected to). We’ll use the sponsor’s information to confirm ${
    isApp ? 'your' : 'their'
  } eligibility for CHAMPVA benefits.`;
}

export const sponsorNameDobConfig = {
  uiSchema: {
    ...titleUI(
      ({ formData }) => `${sponsorWording(formData)} name and date of birth`,
      ({ formData }) => descriptionText(formData),
    ),
    veteransFullName: fullNameUI(),
    sponsorDob: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    required: ['sponsorDob'],
    properties: {
      titleSchema,
      veteransFullName: fullNameSchema,
      sponsorDob: dateOfBirthSchema,
    },
  },
};

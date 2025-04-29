import React from 'react';
import {
  dateOfBirthUI,
  dateOfBirthSchema,
  fullNameUI,
  fullNameSchema,
  titleUI,
  titleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import CustomPrefillMessage from '../../components/CustomPrefillAlert';
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
      ({ formData }) => (
        // Prefill message conditionally displays based on `certifierRole`
        <>
          <p>{descriptionText(formData)}</p>
          {CustomPrefillMessage(formData, 'sponsor')}
        </>
      ),
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

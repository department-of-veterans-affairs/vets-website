import React from 'react';
import {
  addressUI,
  addressSchema,
  dateOfBirthUI,
  dateOfBirthSchema,
  dateOfDeathSchema,
  dateOfDeathUI,
  fullNameUI,
  fullNameSchema,
  phoneUI,
  phoneSchema,
  titleUI,
  titleSchema,
  ssnUI,
  ssnSchema,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import CustomPrefillMessage from '../components/CustomPrefillAlert';
import {
  sponsorAddressCleanValidation,
  validateSponsorSsnIsUnique,
} from '../../shared/validations';

export const sponsorIntroSchema = {
  uiSchema: {
    ...titleUI(
      'Veteran information',
      <>
        <p>
          Now we’ll ask you to enter information about the Veteran that’s
          sponsoring the application.
        </p>
        <p>
          We’ll use the Veteran’s name, Social Security number, and status to
          confirm their eligibility for CHAMPVA benefits. We won’t need you to
          upload their DD-214.
        </p>
      </>,
    ),
  },
  schema: {
    type: 'object',
    properties: {
      titleSchema,
    },
  },
};

export const sponsorNameDobSchema = {
  uiSchema: {
    ...titleUI(
      ({ formData }) => {
        return `${
          formData.certifierRole === 'sponsor' ? 'Your' : `Veteran's`
        } name and date of birth`;
      },
      `Enter the veteran's name and date of birth. We'll use this information to confirm their eligibility.`,
      ({ formData }) => {
        CustomPrefillMessage(formData, 'sponsor');
      },
    ),
    sponsorName: fullNameUI(),
    sponsorDob: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    required: ['sponsorName', 'sponsorDob'],
    properties: {
      titleSchema,
      sponsorName: fullNameSchema,
      sponsorDob: dateOfBirthSchema,
    },
  },
};

export const sponsorIdentificationSchema = {
  uiSchema: {
    ...titleUI(({ formData }) => {
      return `${formData?.certifierRole === 'sponsor' ? 'Your' : `Veteran's`} 
        identification information`;
    }, 'You must enter a Social Security number.'),
    sponsorSsn: ssnUI(),
    'ui:validations': [validateSponsorSsnIsUnique],
  },
  schema: {
    type: 'object',
    required: ['sponsorSsn'],
    properties: {
      titleSchema,
      sponsorSsn: ssnSchema,
    },
  },
};

export const sponsorStatus = {
  uiSchema: {
    ...titleUI(
      "Veteran's status",
      "If the Veteran died, we'll ask more questions about those details. Answer to the best of your knowledge.",
    ),
    sponsorIsDeceased: yesNoUI({
      title: 'Has the Veteran died?',
      labels: {
        yes: 'Yes',
        no: 'No',
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['sponsorIsDeceased'],
    properties: {
      titleSchema,
      sponsorIsDeceased: yesNoSchema,
    },
  },
};

export const sponsorStatusDetails = {
  uiSchema: {
    ...titleUI(`Details about the Veteran's death`),
    sponsorDOD: dateOfDeathUI('When did the Veteran die?'),
    sponsorDeathConditions: yesNoUI({
      title: 'Did the Veteran die during active military service?',
      hint:
        'Depending on your response, you may need to submit additional documents with this application.',
      labels: {
        yes: 'Yes',
        no: 'No',
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['sponsorDOD', 'sponsorDeathConditions'],
    properties: {
      titleSchema,
      sponsorDOD: dateOfDeathSchema,
      sponsorDeathConditions: yesNoSchema,
    },
  },
};

export const sponsorAddress = {
  uiSchema: {
    ...titleUI(({ formData }) => {
      return `${
        formData.certifierRole === 'sponsor' ? 'Your' : `Veteran's`
      } mailing address`;
    }, `We'll send any important information about this application to this address.`),
    sponsorAddress: {
      ...addressUI({
        labels: {
          militaryCheckbox:
            'Address is on military base outside of the United States.',
        },
      }),
    },
    'ui:validations': [sponsorAddressCleanValidation],
  },
  schema: {
    type: 'object',
    required: ['sponsorAddress'],
    properties: {
      titleSchema,
      sponsorAddress: addressSchema(),
    },
  },
};

export const sponsorContactInfo = {
  uiSchema: {
    ...titleUI(({ formData }) => {
      return `${
        formData.certifierRole === 'sponsor' ? 'Your' : `Veteran's`
      } contact information`;
    }, `We'll use this phone number to contact the Veteran if we have any questions about their clientInformation.`),
    sponsorPhone: {
      ...phoneUI(),
      'ui:required': () => true,
    },
  },
  schema: {
    type: 'object',
    required: ['sponsorPhone'],
    properties: {
      titleSchema,
      sponsorPhone: phoneSchema,
    },
  },
};

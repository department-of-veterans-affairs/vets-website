import React from 'react';
import { cloneDeep } from 'lodash';
import {
  addressUI,
  addressSchema,
  dateOfBirthUI,
  dateOfBirthSchema,
  dateOfDeathSchema,
  dateOfDeathUI,
  emailUI,
  emailSchema,
  fullNameUI,
  fullNameSchema,
  phoneUI,
  phoneSchema,
  titleUI,
  ssnUI,
  ssnSchema,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import CustomPrefillMessage from '../components/CustomPrefillAlert';
import { sponsorAddressCleanValidation } from '../../shared/validations';
import { validateSponsorSsn } from '../utils/validations';

const fullNameMiddleInitialUI = cloneDeep(fullNameUI());
fullNameMiddleInitialUI.middle['ui:title'] = 'Middle initial';

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
    properties: {},
  },
};

export const sponsorNameDobSchema = {
  uiSchema: {
    ...titleUI(
      ({ formData }) => {
        return `${
          formData.certifierRole === 'sponsor' ? 'Your' : `Veteran’s`
        } name and date of birth`;
      },
      `Enter the veteran's name and date of birth. We'll use this information to confirm their eligibility.`,
      ({ formData }) => {
        return CustomPrefillMessage(formData, 'sponsor');
      },
    ),
    sponsorName: fullNameMiddleInitialUI,
    sponsorDob: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    required: ['sponsorName', 'sponsorDob'],
    properties: {
      sponsorName: {
        ...fullNameSchema,
        properties: {
          ...fullNameSchema.properties,
          middle: {
            type: 'string',
            maxLength: 1,
          },
        },
      },
      sponsorDob: dateOfBirthSchema,
    },
  },
};

export const sponsorIdentificationSchema = {
  uiSchema: {
    ...titleUI(({ formData }) => {
      return `${formData?.certifierRole === 'sponsor' ? 'Your' : `Veteran's`} 
        identification information`;
    }),
    sponsorSsn: {
      ...ssnUI(),
      'ui:validations': [validateSponsorSsn],
    },
  },
  schema: {
    type: 'object',
    required: ['sponsorSsn'],
    properties: {
      sponsorSsn: ssnSchema,
    },
  },
};

export const sponsorStatus = {
  uiSchema: {
    ...titleUI(
      'Veteran’s status',
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
        'Depending on your response, you may need to submit additional documents.',
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
      sponsorAddress: addressSchema({ omit: ['street3'] }),
    },
  },
};

export const sponsorContactInfo = {
  uiSchema: {
    ...titleUI(
      ({ formData }) => {
        return `${
          formData.certifierRole === 'sponsor' ? 'Your' : `Veteran's`
        } contact information`;
      },
      ({ formData }) => {
        return (
          "We'll use this phone number to contact " +
          `${
            formData.certifierRole === 'sponsor' ? 'you' : 'the Veteran'
          } if we have any questions about their information.`
        );
      },
    ),
    sponsorPhone: {
      ...phoneUI(),
      'ui:required': () => true,
    },
    sponsorEmail: {
      ...emailUI(),
    },
  },
  schema: {
    type: 'object',
    required: ['sponsorPhone'],
    properties: {
      sponsorPhone: phoneSchema,
      sponsorEmail: emailSchema,
    },
  },
};

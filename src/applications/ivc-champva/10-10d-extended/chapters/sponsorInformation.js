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
  ssnOrVaFileNumberUI,
  ssnOrVaFileNumberSchema,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import CustomPrefillMessage from '../components/CustomPrefillAlert';
import { sponsorWording } from '../../10-10D/helpers/utilities';
import { sponsorAddressCleanValidation } from '../../shared/validations';

export const sponsorIntroSchema = {
  uiSchema: {
    ...titleUI(
      'Sponsor information',
      <>
        <p>
          Now we’ll ask you to enter information about the Veteran or service
          member that the applicant is connected to, also called the sponsor.
        </p>
        <p>
          We’ll use the sponsor’s name, social security number, and status to
          confirm their eligibility for CHAMPVA benefits. We will not need you
          to upload their DD-214.
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
    ...titleUI(`Sponsor's name and date of birth`, ({ formData }) => (
      <>
        <p>
          Enter the personal information for the sponsor (the Veteran or service
          member that the applicant is connected to). We’ll use the sponsor’s
          information to confirm their eligibility for CHAMPVA benefits.
        </p>
        {CustomPrefillMessage(formData, 'sponsor')}
      </>
    )),
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
    ...titleUI(`Sponsor's identification information`),
    sponsorSsn: ssnOrVaFileNumberUI(),
  },
  schema: {
    type: 'object',
    required: ['sponsorSsn'],
    properties: {
      titleSchema,
      sponsorSsn: ssnOrVaFileNumberSchema,
    },
  },
};

export const sponsorStatus = {
  uiSchema: {
    ...titleUI(
      `Sponsor's status`,
      'Now we’ll ask you questions about the death of the sponsor (if they died). Fill this out to the best of your knowledge.',
    ),
    sponsorIsDeceased: yesNoUI({
      title: 'Has the sponsor died?',
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
    ...titleUI(`Sponsor's status details`),
    sponsorDOD: dateOfDeathUI('When did the sponsor die?'),
    sponsorDeathConditions: yesNoUI({
      title: 'Did the sponsor die during active military service?',
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
    ...titleUI(
      ({ formData }) => `${sponsorWording(formData)} mailing address`,
      ({ formData }) => (
        // Prefill message conditionally displays based on `certifierRole`
        <>
          <p>
            We’ll send any important information about this application to this
            address.
          </p>
          {CustomPrefillMessage(formData, 'sponsor')}
        </>
      ),
    ),
    sponsorAddress: {
      ...addressUI({
        labels: {
          militaryCheckbox:
            'Address is on a U.S. military base outside of the United States.',
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
    ...titleUI(`Sponsor's contact information`, ({ formData }) => (
      <>
        <p>
          We’ll use this phone number to contact{' '}
          {formData.certifierRole === 'applicant' ? 'you' : 'the sponsor'} if we
          have any questions about{' '}
          {formData.certifierRole === 'applicant' ? 'your' : 'their'}{' '}
          information.
        </p>
        {CustomPrefillMessage(formData, 'sponsor')}
      </>
    )),
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

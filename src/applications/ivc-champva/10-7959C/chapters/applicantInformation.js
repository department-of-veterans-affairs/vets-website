import {
  addressUI,
  addressSchema,
  dateOfBirthUI,
  dateOfBirthSchema,
  emailUI,
  emailSchema,
  fullNameUI,
  fullNameSchema,
  phoneUI,
  phoneSchema,
  ssnUI,
  ssnSchema,
  titleUI,
  titleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { nameWording } from '../helpers/utilities';

export const blankSchema = { type: 'object', properties: {} };

export const applicantNameDobSchema = {
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        `${
          formData.certifierRole === 'applicant' ? 'Your' : 'Applicant'
        } name and date of birth`,
    ),
    applicantName: fullNameUI(),
    applicantDOB: dateOfBirthUI({ required: true }),
  },
  schema: {
    type: 'object',
    required: ['applicantDOB'],
    properties: {
      titleSchema,
      applicantName: fullNameSchema,
      applicantDOB: dateOfBirthSchema,
    },
  },
};

export const applicantSsnSchema = {
  uiSchema: {
    ...titleUI(
      ({ formData }) => `${nameWording(formData)} identification information`,
      `You must enter a Social Security number`,
    ),
    applicantSsn: ssnUI(),
  },
  schema: {
    type: 'object',
    required: ['applicantSsn'],
    properties: {
      titleSchema,
      applicantSsn: ssnSchema,
    },
  },
};

export const applicantAddressInfoSchema = {
  uiSchema: {
    ...titleUI(
      ({ formData }) => `${nameWording(formData)} mailing address`,
      'We’ll send any important information about your application to this address.',
    ),
    applicantAddress: {
      ...addressUI({
        labels: {
          militaryCheckbox:
            'Address is on a United States military base outside the country.',
        },
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      titleSchema,
      applicantAddress: addressSchema(),
    },
  },
};

export const applicantContactInfoSchema = {
  uiSchema: {
    ...titleUI(
      ({ formData }) => `${nameWording(formData)} phone number`,
      ({ formData }) =>
        `This information helps us contact ${nameWording(
          formData,
          false,
          false,
        )} faster if we need to follow up with you about the application.`,
    ),
    applicantPhone: phoneUI(),
    applicantEmailAddress: emailUI(),
  },
  schema: {
    type: 'object',
    required: ['applicantPhone'],
    properties: {
      titleSchema,
      applicantPhone: phoneSchema,
      applicantEmailAddress: emailSchema,
    },
  },
};

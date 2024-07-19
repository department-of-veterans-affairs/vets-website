import { cloneDeep } from 'lodash';
import {
  addressUI,
  addressSchema,
  dateOfBirthUI,
  dateOfBirthSchema,
  fullNameUI,
  fullNameSchema,
  phoneUI,
  phoneSchema,
  radioUI,
  radioSchema,
  ssnUI,
  ssnSchema,
  titleUI,
  titleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { nameWording } from '../helpers/utilities';

export const blankSchema = { type: 'object', properties: {} };

const fullNameMiddleInitialUI = cloneDeep(fullNameUI());
fullNameMiddleInitialUI.middle['ui:title'] = 'Middle initial';

export const applicantNameDobSchema = {
  uiSchema: {
    ...titleUI('Name and date of birth'),
    applicantName: fullNameMiddleInitialUI,
    applicantDOB: dateOfBirthUI({
      required: true,
      hint: 'For example: January 19 2000',
    }),
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
      ({ formData }) =>
        `${nameWording(
          formData,
          undefined,
          undefined,
          true,
        )} identification information`,
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
      ({ formData }) =>
        `${nameWording(formData, undefined, undefined, true)} mailing address`,
      'We’ll send any important information about this form to this address.',
    ),
    applicantAddress: {
      ...addressUI({ labels: { street3: 'Apartment or unit number' } }),
    },
    applicantNewAddress: {
      ...radioUI({
        updateUiSchema: formData => {
          const labels = {
            yes: 'Yes',
            no: 'No',
            unknown: 'I’m not sure',
          };

          return {
            'ui:title': `Has ${nameWording(
              formData,
              undefined,
              undefined,
              true,
            )} mailing address changed since their last CHAMPVA form submission?`,
            'ui:options': {
              labels,
              hint: `If yes, we will update our records with the new mailing address`,
            },
          };
        },
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['applicantNewAddress'],
    properties: {
      titleSchema,
      applicantAddress: addressSchema(),
      applicantNewAddress: radioSchema(['yes', 'no', 'unknown']),
    },
  },
};

export const applicantContactInfoSchema = {
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        `${nameWording(formData, undefined, undefined, true)} phone number`,
      'We’ll contact this phone number if we need to follow up about this form.',
    ),
    applicantPhone: phoneUI(),
  },
  schema: {
    type: 'object',
    required: ['applicantPhone'],
    properties: {
      titleSchema,
      applicantPhone: phoneSchema,
    },
  },
};

export const applicantGenderSchema = {
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        `${nameWording(
          formData,
          undefined,
          undefined,
          true,
        )} sex listed at birth`,
    ),
    applicantGender: {
      ...radioUI({
        updateUiSchema: formData => {
          const labels = {
            male: 'Male',
            female: 'Female',
          };

          return {
            'ui:title': `What's ${nameWording(
              formData,
              undefined,
              undefined,
              true,
            )} sex listed at birth?`,
            'ui:options': {
              labels,
              hint: `Enter the sex that appears on ${nameWording(
                formData,
                undefined,
                undefined,
                true,
              )} birth certificate.`,
            },
          };
        },
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['applicantGender'],
    properties: {
      titleSchema,
      applicantGender: radioSchema(['male', 'female']),
    },
  },
};

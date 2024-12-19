import { cloneDeep } from 'lodash';
import {
  addressUI,
  addressSchema,
  emailUI,
  emailSchema,
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
    ...titleUI(
      ({ formData }) =>
        `${
          formData.certifierRole === 'applicant' ? 'Your' : 'Beneficiary’s'
        } name`,
    ),
    applicantName: fullNameMiddleInitialUI,
  },
  schema: {
    type: 'object',
    properties: {
      titleSchema,
      applicantName: fullNameSchema,
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
      ...addressUI({
        labels: {
          street3: 'Apartment or unit number',
          militaryCheckbox:
            'Address is on a U.S. military base outside of the United States.',
        },
      }),
    },
    applicantNewAddress: {
      ...radioUI({
        updateUiSchema: formData => {
          const name = nameWording(formData, undefined, false, true);
          const labels = {
            yes: 'Yes',
            no: 'No',
            unknown: 'I’m not sure',
          };

          return {
            'ui:title': `Has ${name} mailing address changed since ${
              name === 'your' ? name : 'their'
            } last CHAMPVA form submission?`,
            'ui:options': {
              labels,
              hint: `If yes, we will update our records with the new mailing address.`,
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
    contactEmail: emailUI(),
  },
  schema: {
    type: 'object',
    required: ['applicantPhone'],
    properties: {
      titleSchema,
      applicantPhone: phoneSchema,
      contactEmail: emailSchema,
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
              false,
              true,
            )} sex listed at birth?`,
            'ui:options': {
              labels,
              hint: `Enter the sex that appears on ${nameWording(
                formData,
                undefined,
                false,
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

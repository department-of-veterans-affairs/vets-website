import { cloneDeep } from 'lodash';
import {
  addressUI,
  addressSchema,
  dateOfBirthUI,
  dateOfBirthSchema,
  fullNameUI,
  fullNameSchema,
  titleUI,
  titleSchema,
  radioUI,
  radioSchema,
  phoneUI,
  phoneSchema,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { nameWording } from '../../shared/utilities';

const fullNameMiddleInitialUI = cloneDeep(fullNameUI());
fullNameMiddleInitialUI.middle['ui:title'] = 'Middle initial';

export const applicantNameDobSchema = {
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        `${
          formData?.certifierRole === 'applicant' ? 'Your' : 'Beneficiary’s'
        } information`,
      ({ formData }) =>
        `Enter the name exactly as it’s listed on ${
          formData?.certifierRole === 'applicant' ? 'your' : 'the beneficiary’s'
        } CHAMPVA identification card.`,
    ),
    applicantName: fullNameMiddleInitialUI,
    applicantDOB: dateOfBirthUI(),
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

export const applicantMemberNumberSchema = {
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        `${nameWording(formData, true, true, true)} identification information`,
    ),
    applicantMemberNumber: textUI({
      updateUiSchema: formData => {
        return {
          'ui:title': 'CHAMPVA member number',
          'ui:errorMessages': {
            required: 'Please enter your CHAMPVA member number',
            pattern: 'Must be letters and numbers only',
          },
          'ui:options': {
            uswds: true,
            hint: `This number is usually the same as ${
              formData?.certifierRole === 'applicant'
                ? 'your'
                : 'the beneficiary’s'
            } Social Security number.`,
          },
        };
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['applicantMemberNumber'],
    properties: {
      titleSchema,
      applicantMemberNumber: {
        type: 'string',
        pattern: '^[0-9a-zA-Z]+$',
        maxLength: 20,
      },
    },
  },
};

export const applicantAddressSchema = {
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        `${nameWording(formData, true, true, true)} mailing address`,
      'We’ll send any important information about this form to this address.',
    ),
    applicantAddress: {
      ...addressUI({
        labels: {
          militaryCheckbox:
            'Address is on a United States military base outside of the U.S.',
        },
      }),
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
              true,
              false,
              true,
            )} mailing address changed since ${
              formData.certifierRole === 'applicant' ? 'your' : 'their'
            } last CHAMPVA claim or benefits application submission?`,
            'ui:options': {
              labels,
              hint: `If the mailing address changed, we'll update our records with the new address.`,
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
      applicantAddress: addressSchema({ omit: ['street3'] }),
      applicantNewAddress: radioSchema(['yes', 'no', 'unknown']),
    },
  },
};

export const applicantPhoneSchema = {
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        `${nameWording(formData, true, true, true)} phone number`,
      ({ formData }) =>
        `We’ll use this information to contact ${
          formData?.certifierRole === 'applicant'
            ? 'you'
            : nameWording(formData, false, true, true)
        } if we have any questions.`,
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

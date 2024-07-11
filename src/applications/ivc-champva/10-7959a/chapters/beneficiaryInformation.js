import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
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
        `Enter the information exactly as it’s listed on ${
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
    applicantMemberNumber: {
      'ui:title': 'CHAMPVA member number',
      'ui:webComponentField': VaTextInputField,
      'ui:errorMessages': {
        required: 'Please enter your CHAMPVA member number',
        pattern: 'Must be 20 or fewer characters (letters and numbers only)',
      },
      'ui:options': {
        uswds: true,
        hint:
          'This number is usually the same as the beneficiary’s Social Security number.',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['applicantMemberNumber'],
    properties: {
      titleSchema,
      applicantMemberNumber: {
        type: 'string',
        pattern: '^[0-9a-zA-Z]{0,20}$',
      },
    },
  },
};

export const applicantAddressSchema = {
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        `${nameWording(formData, true, true, true)} mailing address`,
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
            )} mailing address changed since ${
              formData.certifierRole === 'applicant' ? 'your' : 'their'
            } last CHAMPVA claim or benefits application submission?`,
            'ui:options': {
              labels,
              hint: `If the mailing address has changed, we’ll update our records with the new address`,
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
        `${nameWording(formData, true, true, true)} contact information`,
      ({ formData }) =>
        `We’ll use this information to contact ${
          formData?.certifierRole === 'applicant'
            ? 'you'
            : nameWording(formData, true, true, true)
        } if we have more questions.`,
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

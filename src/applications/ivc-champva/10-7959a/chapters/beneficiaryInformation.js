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
  emailUI,
  emailSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { nameWording, privWrapper } from '../../shared/utilities';
import {
  validAddressCharsOnly,
  validObjectCharsOnly,
} from '../../shared/validations';

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
    'ui:validations': [
      (errors, formData) =>
        validObjectCharsOnly(errors, null, formData, 'applicantName'),
    ],
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
    ...titleUI(({ formData }) =>
      privWrapper(
        `${nameWording(formData, true, true, true)} identification information`,
      ),
    ),
    applicantMemberNumber: textUI({
      title: 'CHAMPVA member number',
      errorMessages: {
        required: 'Please enter your CHAMPVA member number',
        pattern: 'Must be numbers only',
      },
      classNames: ['dd-privacy-hidden'],
      updateUiSchema: formData => ({
        'ui:options': {
          hint: `This number is usually the same as ${nameWording(
            formData,
            true,
            false,
            true,
          )} Social Security number.`,
        },
      }),
    }),
    'ui:options': {
      itemAriaLabel: () => 'identification information',
    },
  },
  schema: {
    type: 'object',
    required: ['applicantMemberNumber'],
    properties: {
      titleSchema,
      applicantMemberNumber: {
        type: 'string',
        pattern: '^[0-9]+$',
        maxLength: 9,
        minLength: 8,
      },
    },
  },
};

export const applicantAddressSchema = {
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        privWrapper(
          `${nameWording(formData, true, true, true)} mailing address`,
        ),
      'We’ll send any important information about this claim to this address.',
    ),
    applicantAddress: addressUI({
      labels: {
        militaryCheckbox:
          'Address is on military base outside of the United States.',
      },
    }),
    applicantNewAddress: {
      ...radioUI({
        labels: {
          yes: 'Yes',
          no: 'No',
          unknown: 'I’m not sure',
        },
        classNames: ['dd-privacy-hidden'],
        hint: `If the mailing address changed, we'll update our records with the new address.`,
        updateUiSchema: formData => ({
          'ui:title': `Has ${nameWording(
            formData,
            true,
            false,
            true,
          )} mailing address changed since ${
            formData.certifierRole === 'applicant' ? 'your' : 'their'
          } last CHAMPVA claim or benefits application submission?`,
        }),
      }),
    },
    'ui:options': {
      itemAriaLabel: () => 'mailing address',
    },
    'ui:validations': [
      (errors, formData) =>
        validAddressCharsOnly(errors, null, formData, 'applicantAddress'),
    ],
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

export const applicantContactSchema = {
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        privWrapper(
          `${nameWording(formData, true, true, true)} contact information`,
        ),
      ({ formData }) =>
        privWrapper(
          `We’ll use this information to contact ${
            formData?.certifierRole === 'applicant'
              ? 'you'
              : nameWording(formData, false, true, true)
          } if we have any questions.`,
        ),
    ),
    applicantPhone: phoneUI(),
    applicantEmail: emailUI({
      // Only require applicant email if said applicant is filling the form:
      required: formData => formData.certifierRole === 'applicant',
    }),
    'ui:options': {
      itemAriaLabel: () => 'contact information',
    },
  },
  schema: {
    type: 'object',
    required: ['applicantPhone'],
    properties: {
      titleSchema,
      applicantPhone: phoneSchema,
      applicantEmail: emailSchema,
    },
  },
};

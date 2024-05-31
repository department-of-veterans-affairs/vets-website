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
    ...titleUI('Beneficiary’s name and date of birth'),
    applicantName: fullNameMiddleInitialUI,
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

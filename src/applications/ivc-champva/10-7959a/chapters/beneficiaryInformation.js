import {
  addressUI,
  addressSchema,
  dateOfBirthUI,
  dateOfBirthSchema,
  titleUI,
  radioUI,
  radioSchema,
  phoneUI,
  phoneSchema,
  textUI,
  emailUI,
  emailSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { privWrapper } from '../../shared/utilities';
import {
  validAddressCharsOnly,
  validObjectCharsOnly,
} from '../../shared/validations';
import {
  champvaMemberNumberSchema,
  fullNameMiddleInitialSchema,
  fullNameMiddleInitialUI,
} from '../definitions';
import { personalizeTitleByName } from '../utils/helpers';
import content from '../locales/en/content.json';

export const applicantNameDobSchema = {
  uiSchema: {
    ...titleUI(
      content['beneficiary--basic-info-title'],
      content['beneficiary--basic-info-desc'],
    ),
    applicantName: fullNameMiddleInitialUI,
    applicantDob: dateOfBirthUI(),
    'ui:validations': [
      (errors, formData) =>
        validObjectCharsOnly(errors, null, formData, 'applicantName'),
    ],
  },
  schema: {
    type: 'object',
    required: ['applicantDob'],
    properties: {
      applicantName: fullNameMiddleInitialSchema,
      applicantDob: dateOfBirthSchema,
    },
  },
};

export const applicantMemberNumberSchema = {
  uiSchema: {
    ...titleUI(({ formData }) =>
      privWrapper(
        personalizeTitleByName(formData, content['page-title--id-info']),
      ),
    ),
    applicantMemberNumber: textUI({
      title: content['beneficiary--member-number-label'],
      hint: content['beneficiary--member-number-hint'],
      errorMessages: {
        required: content['error--required'],
        pattern: content['error--pattern--member-number'],
      },
      classNames: ['dd-privacy-hidden'],
    }),
  },
  schema: {
    type: 'object',
    required: ['applicantMemberNumber'],
    properties: {
      applicantMemberNumber: champvaMemberNumberSchema,
    },
  },
};

export const applicantAddressSchema = {
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        privWrapper(
          personalizeTitleByName(
            formData,
            content['page-title--mailing-address'],
          ),
        ),
      content['beneficiary--mailing-address-desc'],
    ),
    applicantAddress: addressUI({
      labels: {
        militaryCheckbox: content['form-label--address-military'],
      },
    }),
    applicantNewAddress: {
      ...radioUI({
        title: content['beneficiary--address-change-label'],
        hint: content['beneficiary--address-change-hint'],
        labels: {
          yes: content['form-input--option--yes'],
          no: content['form-input--option--no'],
          unknown: content['form-input--option--unknown'],
        },
      }),
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
          personalizeTitleByName(formData, content['page-title--contact-info']),
        ),
      content['beneficiary--contact-info-desc'],
    ),
    applicantPhone: phoneUI(),
    applicantEmail: emailUI({
      // Only require applicant email if said applicant is filling the form:
      required: formData => formData.certifierRole === 'applicant',
    }),
  },
  schema: {
    type: 'object',
    required: ['applicantPhone'],
    properties: {
      applicantPhone: phoneSchema,
      applicantEmail: emailSchema,
    },
  },
};

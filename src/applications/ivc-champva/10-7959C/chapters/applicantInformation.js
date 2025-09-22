import merge from 'lodash/merge';
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
import {
  nameWording,
  privWrapper,
  PrivWrappedReview,
} from '../../shared/utilities';
import {
  validAddressCharsOnly,
  validObjectCharsOnly,
} from '../../shared/validations';

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
    'ui:validations': [
      (errors, formData) =>
        validObjectCharsOnly(errors, null, formData, 'applicantName'),
    ],
  },
  schema: {
    type: 'object',
    properties: {
      titleSchema,
      applicantName: {
        ...fullNameSchema,
        properties: {
          ...fullNameSchema.properties,
          middle: {
            type: 'string',
            maxLength: 1,
          },
        },
      },
    },
  },
};

export const applicantSsnSchema = {
  uiSchema: {
    ...titleUI(({ formData }) =>
      privWrapper(
        `${nameWording(
          formData,
          undefined,
          undefined,
          true,
        )} identification information`,
      ),
    ),
    applicantSsn: ssnUI(),
    'ui:options': {
      itemAriaLabel: () => 'identification information',
    },
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
        privWrapper(
          `${nameWording(
            formData,
            undefined,
            undefined,
            true,
          )} mailing address`,
        ),
      'We’ll send any important information about this form to this address.',
    ),
    applicantAddress: merge({}, addressUI(), {
      street3: {
        'ui:title': 'Apartment or unit number',
      },
      state: {
        'ui:errorMessages': {
          required: 'Enter a valid State, Province, or Region',
        },
      },
      isMilitary: {
        'ui:title':
          'Address is on a U.S. military base outside of the United States.',
      },
    }),
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
    'ui:validations': [
      (errors, formData) =>
        validAddressCharsOnly(errors, null, formData, 'applicantAddress'),
    ],
    'ui:options': {
      itemAriaLabel: () => 'mailing address',
      classNames: ['dd-privacy-hidden'],
    },
    'ui:objectViewField': props => {
      return PrivWrappedReview(props);
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
        privWrapper(
          `${nameWording(formData, undefined, undefined, true)} phone number`,
        ),
      'We’ll contact this phone number if we need to follow up about this form.',
    ),
    applicantPhone: phoneUI(),
    applicantEmail: emailUI(),
    'ui:options': {
      updateSchema: (formData, formSchema) => {
        const fs = JSON.parse(JSON.stringify(formSchema)); // Deep copy
        // If user is the applicant, they have already given us an email
        // previously in signer section, so remove the field on this page:
        if (formData.certifierRole === 'applicant') {
          delete fs.properties.applicantEmail;
          // Just in case we require this email field in future, be sure to un-require it:
          fs.required = fs.required.filter(f => f !== 'applicantEmail');
        } else if (fs.properties.applicantEmail === undefined) {
          // Replace email field if we previously dropped it and
          // user is not the applicant:
          fs.properties.applicantEmail = emailSchema;
        }
        return fs;
      },
      itemAriaLabel: () => 'phone number',
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

export const applicantGenderSchema = {
  uiSchema: {
    ...titleUI(({ formData }) =>
      privWrapper(
        `${nameWording(
          formData,
          undefined,
          undefined,
          true,
        )} sex listed at birth`,
      ),
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
              classNames: ['dd-privacy-hidden'],
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
    'ui:options': {
      itemAriaLabel: () => 'sex',
    },
    'ui:objectViewField': props => {
      return PrivWrappedReview(props);
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

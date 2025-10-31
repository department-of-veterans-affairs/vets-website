import { cloneDeep } from 'lodash';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import {
  addressUI,
  addressSchema,
  fullNameUI,
  fullNameSchema,
  titleUI,
  radioUI,
  radioSchema,
  phoneUI,
  phoneSchema,
  emailUI,
  emailSchema,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { blankSchema } from 'platform/forms-system/src/js/utilities/data/profile';
import {
  validAddressCharsOnly,
  validFieldCharsOnly,
  validObjectCharsOnly,
} from '../../shared/validations';

const fullNameMiddleInitialUI = cloneDeep(fullNameUI());
fullNameMiddleInitialUI.middle['ui:title'] = 'Middle initial';

export const certifierRoleSchema = {
  uiSchema: {
    ...titleUI('Your information'),
    certifierRole: radioUI({
      type: 'radio',
      title: 'Which of these best describes you?',
      required: () => true,
      labels: {
        applicant:
          'I’m the spouse, dependent, or survivor of a Veteran submitting a claim for myself',
        sponsor:
          'I’m a Veteran submitting a claim for my spouse, dependents, or both',
        other: ' I’m submitting a claim on behalf of someone else',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      certifierRole: radioSchema(['applicant', 'sponsor', 'other']),
    },
  },
};

export const certifierReceivedPacketSchema = {
  uiSchema: {
    ...titleUI(({ formData }) => {
      return `${
        formData?.certifierRole === 'applicant' ? 'Your' : 'Beneficiary’s'
      } CHAMPVA benefit status`;
    }),

    certifierReceivedPacket: {
      ...yesNoUI({
        type: 'radio',
        updateUiSchema: formData => {
          return {
            'ui:title': `${
              formData?.certifierRole === 'applicant'
                ? 'Do you'
                : 'Does the beneficiary'
            } receive CHAMPVA benefits now?`,
          };
        },
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['certifierReceivedPacket'],
    properties: {
      certifierReceivedPacket: yesNoSchema,
    },
  },
};

export const certifierNotEnrolledChampvaSchema = {
  uiSchema: {},
  schema: blankSchema,
};

export const certifierNameSchema = {
  uiSchema: {
    ...titleUI('Your name'),
    certifierName: fullNameMiddleInitialUI,
    'ui:validations': [
      (errors, formData) =>
        validObjectCharsOnly(errors, null, formData, 'certifierName'),
    ],
  },
  schema: {
    type: 'object',
    properties: {
      certifierName: fullNameSchema,
    },
  },
};

export const certifierAddressSchema = {
  uiSchema: {
    ...titleUI(
      'Your mailing address',
      'We’ll send any important information about this claim to this address',
    ),
    certifierAddress: addressUI({
      labels: {
        militaryCheckbox:
          'Address is on military base outside of the United States.',
      },
    }),
    'ui:validations': [
      (errors, formData) =>
        validAddressCharsOnly(errors, null, formData, 'certifierAddress'),
    ],
  },
  schema: {
    type: 'object',
    required: ['certifierAddress'],
    properties: {
      certifierAddress: addressSchema({
        omit: ['street3'],
      }),
    },
  },
};

export const certifierContactSchema = {
  uiSchema: {
    ...titleUI(
      'Your contact information',
      'We may contact you if we have more questions about this claim.',
    ),
    certifierPhone: phoneUI(),
    certifierEmail: emailUI(),
  },
  schema: {
    type: 'object',
    required: ['certifierPhone', 'certifierEmail'],
    properties: {
      certifierPhone: phoneSchema,
      certifierEmail: emailSchema,
    },
  },
};

export const certifierRelationshipSchema = {
  uiSchema: {
    ...titleUI('Your relationship to the beneficiary'),
    certifierRelationship: radioUI({
      type: 'radio',
      title: 'Which of these best describes you?',
      required: () => true,
      labels: {
        spouse: 'I’m the beneficiary’s spouse',
        parent: 'I’m the beneficiary’s parent',
        other: 'Relationship not listed',
      },
    }),
    certifierOtherRelationship: {
      'ui:title': `Describe your relationship to the beneficiary`,
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        classNames: ['dd-privacy-hidden'],
        expandUnder: 'certifierRelationship',
        expandUnderCondition: 'other',
        expandedContentFocus: true,
      },
      'ui:errorMessages': {
        required: `Please enter your relationship to the beneficiary`,
      },
    },
    'ui:options': {
      updateSchema: (formData, formSchema) => {
        if (formSchema.properties.certifierOtherRelationship['ui:collapsed']) {
          return { ...formSchema, required: ['certifierRelationship'] };
        }
        return {
          ...formSchema,
          required: ['certifierRelationship', 'certifierOtherRelationship'],
        };
      },
    },
    'ui:validations': [
      (errors, formData) =>
        validFieldCharsOnly(
          errors,
          null,
          formData,
          'certifierOtherRelationship',
        ),
    ],
  },
  schema: {
    type: 'object',
    required: ['certifierRelationship'],
    properties: {
      certifierRelationship: radioSchema(['spouse', 'parent', 'other']),
      certifierOtherRelationship: {
        type: 'string',
      },
    },
  },
};

export const certifierClaimStatusSchema = {
  uiSchema: {
    ...titleUI(({ formData }) => {
      return `${
        formData?.certifierRole === 'applicant' ? 'Your' : 'Beneficiary’s'
      } CHAMPVA claim status`;
    }),
    claimStatus: radioUI({
      type: 'radio',
      title: 'Is this a new claim or a resubmission for an existing claim?',
      required: () => true,
      labels: {
        new: 'A new claim',
        resubmission: 'A resubmission for an existing claim',
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['claimStatus'],
    properties: {
      claimStatus: radioSchema(['new', 'resubmission']),
    },
  },
};

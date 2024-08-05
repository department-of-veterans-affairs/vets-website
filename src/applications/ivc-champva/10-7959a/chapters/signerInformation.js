import { cloneDeep } from 'lodash';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import {
  addressUI,
  addressSchema,
  fullNameUI,
  fullNameSchema,
  titleUI,
  titleSchema,
  radioUI,
  radioSchema,
  phoneUI,
  phoneSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const fullNameMiddleInitialUI = cloneDeep(fullNameUI());
fullNameMiddleInitialUI.middle['ui:title'] = 'Middle initial';

export const certifierRoleSchema = {
  uiSchema: {
    ...titleUI('Your information'),
    certifierRole: radioUI({
      title: 'Which of these best describes you?',
      required: () => true,
      labels: {
        applicant: 'I’m the beneficiary submitting a claim for myself',
        other:
          'I’m a representative submitting a claim on behalf of the beneficiary',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      titleSchema,
      certifierRole: radioSchema(['applicant', 'other']),
    },
  },
};

export const certifierNameSchema = {
  uiSchema: {
    ...titleUI('Your name'),
    certifierName: fullNameMiddleInitialUI,
  },
  schema: {
    type: 'object',
    properties: {
      titleSchema,
      certifierName: fullNameSchema,
    },
  },
};

export const certifierAddressSchema = {
  uiSchema: {
    ...titleUI(
      'Your mailing address',
      'We’ll send any important information about this form to this address',
    ),
    certifierAddress: addressUI(),
  },
  schema: {
    type: 'object',
    required: ['certifierAddress'],
    properties: {
      titleSchema,
      certifierAddress: addressSchema(),
    },
  },
};

export const certifierPhoneSchema = {
  uiSchema: {
    ...titleUI(
      'Your contact information',
      'We’ll use this information to contact you if we have more questions.',
    ),
    certifierPhone: phoneUI(),
  },
  schema: {
    type: 'object',
    required: ['certifierPhone'],
    properties: {
      titleSchema,
      certifierPhone: phoneSchema,
    },
  },
};

export const certifierRelationshipSchema = {
  uiSchema: {
    ...titleUI('Your relationship to the beneficiary'),
    certifierRelationship: radioUI({
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
  },
  schema: {
    type: 'object',
    required: ['certifierRelationship'],
    properties: {
      titleSchema,
      certifierRelationship: radioSchema(['spouse', 'parent', 'other']),
      certifierOtherRelationship: {
        type: 'string',
      },
    },
  },
};

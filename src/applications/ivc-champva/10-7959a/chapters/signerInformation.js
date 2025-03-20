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
  emailUI,
  emailSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

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
        applicant: 'I’m the beneficiary submitting a claim for myself',
        sponsor: 'I’m a Veteran submitting a claim for my spouse or dependent',
        other:
          'I’m a representative submitting a claim on behalf of the beneficiary',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      titleSchema,
      certifierRole: radioSchema(['applicant', 'sponsor', 'other']),
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
      certifierAddress: addressSchema({ omit: ['street3'] }),
    },
  },
};

export const certifierContactSchema = {
  uiSchema: {
    ...titleUI(
      'Your contact information',
      'We’ll use this information to contact you if we have more questions.',
    ),
    certifierPhone: phoneUI(),
    certifierEmail: emailUI(),
  },
  schema: {
    type: 'object',
    required: ['certifierPhone', 'certifierEmail'],
    properties: {
      titleSchema,
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

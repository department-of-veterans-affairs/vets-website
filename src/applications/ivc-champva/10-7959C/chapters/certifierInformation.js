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
  titleUI,
  titleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

import {
  thirdPartyInfoSchema,
  thirdPartyInfoUiSchema,
} from '../../shared/components/ThirdPartyInfo';

export const certifierRole = {
  uiSchema: {
    ...titleUI('Your information'),
    certifierRole: radioUI({
      title: 'Which of these best describes you?',
      required: () => true,
      labels: {
        applicant: 'I’m filling out this form for myself',
        sponsor: 'I’m filling out this form for my spouse or child',
        other:
          'I’m a representative filling out this form on behalf of someone else',
      },
    }),
    ...thirdPartyInfoUiSchema,
  },
  schema: {
    type: 'object',
    required: ['certifierRole'],
    properties: {
      titleSchema,
      certifierRole: radioSchema(['applicant', 'sponsor', 'other']),
      ...thirdPartyInfoSchema,
    },
  },
};

export const certifierNameSchema = {
  uiSchema: {
    ...titleUI('Your name'),
    certifierName: fullNameUI(),
  },
  schema: {
    type: 'object',
    required: ['certifierName'],
    properties: {
      titleSchema,
      certifierName: fullNameSchema,
    },
  },
};

export const certifierAddress = {
  uiSchema: {
    ...titleUI('Your mailing address'),
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

export const certifierName = {
  uiSchema: {
    ...titleUI('Your name'),
    certifierName: fullNameUI(),
  },
  schema: {
    type: 'object',
    required: ['certifierName'],
    properties: {
      titleSchema,
      certifierName: fullNameSchema,
    },
  },
};

export const certifierPhoneEmail = {
  uiSchema: {
    ...titleUI(
      'Your contact information',
      'We use this information to contact you if we have more questions.',
    ),
    certifierPhone: phoneUI(),
    certifierEmail: emailUI(),
  },
  schema: {
    type: 'object',
    required: ['certifierPhone'],
    properties: {
      titleSchema,
      certifierPhone: phoneSchema,
      certifierEmail: emailSchema,
    },
  },
};

export const certifierRelationship = {
  uiSchema: {
    ...titleUI('Your information'),
    certifierRelationship: {
      relationshipToApplicants: radioUI({
        title: 'Which of these best describes you?',
        required: () => true,
        labels: {
          spouse: 'The applicant is my spouse',
          parent: 'The applicant is my child',
          child: 'The applicant is my parent',
          thirdParty:
            'I’m a third-party representative who isn’t a family member',
          other: 'Relationship not listed',
        },
      }),
      otherRelationshipToApplicants: {
        'ui:title':
          'Since your relationship with the applicant was not listed, please describe it here',
        'ui:webComponentField': VaTextInputField,
        'ui:options': {
          expandUnder: 'relationshipToApplicants',
          expandUnderCondition: 'other',
          expandedContentFocus: true,
        },
        'ui:errorMessages': {
          required: 'Please enter your relationship to the applicant',
        },
      },
      'ui:options': {
        updateSchema: (formData, formSchema) => {
          const fs = formSchema;
          if (fs.properties.otherRelationshipToApplicants['ui:collapsed']) {
            return {
              ...fs,
              required: ['relationshipToApplicants'],
            };
          }
          return {
            ...fs,
            required: [
              'relationshipToApplicants',
              'otherRelationshipToApplicants',
            ],
          };
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['certifierRelationship'],
    properties: {
      titleSchema,
      certifierRelationship: {
        type: 'object',
        properties: {
          relationshipToApplicants: radioSchema([
            'spouse',
            'child',
            'parent',
            'thirdParty',
            'other',
          ]),
          otherRelationshipToApplicants: {
            type: 'string',
          },
        },
      },
    },
  },
};

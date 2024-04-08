import {
  addressUI,
  addressSchema,
  checkboxGroupUI,
  checkboxGroupSchema,
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

import { MAX_APPLICANTS } from '../config/constants';

export const certifierRole = {
  uiSchema: {
    ...titleUI('Your information'),
    certifierRole: radioUI({
      title: 'Which of these best describes you?',
      required: () => true,
      labels: {
        applicant: 'I’m applying for benefits for myself',
        sponsor:
          'I’m a Veteran applying for benefits for my spouse or dependents',
        other:
          'I’m a representative applying for benefits on behalf of someone else',
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

export const certifierAddress = {
  uiSchema: {
    ...titleUI(
      'Your mailing address',
      'We’ll send any important information about this application to your address',
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
    ...titleUI(
      'Your relationship to the applicant',
      `You can add up to ${MAX_APPLICANTS} applicants on a single application. If you need to add more than ${MAX_APPLICANTS}, you’ll need to fill out another form for them.`,
    ),
    certifierRelationship: {
      relationshipToApplicants: checkboxGroupUI({
        title: 'Which of these best describes you?',
        hint: 'Select all that apply',
        required: () => true,
        labels: {
          spouse: 'I’m an applicant’s spouse',
          child: 'I’m an applicant’s child',
          parent: 'I’m an applicant’s parent',
          thirdParty:
            'I’m a third-party representative who isn’t a family member',
          other: 'My relationship is not listed',
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
          if (formData.certifierRelationship.relationshipToApplicants.other)
            fs.properties.otherRelationshipToApplicants['ui:collapsed'] = false;
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
          relationshipToApplicants: checkboxGroupSchema([
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

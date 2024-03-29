import {
  addressUI,
  addressSchema,
  fullNameUI,
  fullNameSchema,
  radioUI,
  radioSchema,
  titleUI,
  titleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

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

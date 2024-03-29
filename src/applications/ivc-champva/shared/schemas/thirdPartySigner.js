import {
  titleUI,
  titleSchema,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  thirdPartyInfoSchema,
  thirdPartyInfoUiSchema,
} from '../components/ThirdPartyInfo';

export const signerClassification = {
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

import {
  titleUI,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const schema = {
  type: 'object',
  properties: {
    reportDivorce: {
      type: 'object',
      properties: {
        fullName: fullNameNoSuffixSchema,
        birthDate: currentOrPastDateSchema,
      },
    },
  },
};

export const uiSchema = {
  reportDivorce: {
    ...titleUI('Divorced spouse’s information'),
    fullName: {
      ...fullNameNoSuffixUI(title => `Former spouse’s ${title}`),
    },
    birthDate: {
      ...currentOrPastDateUI('Former spouse’s date of birth'),
      'ui:required': () => true,
    },
  },
};

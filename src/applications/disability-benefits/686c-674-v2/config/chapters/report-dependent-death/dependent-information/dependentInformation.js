import {
  titleUI,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  ssnUI,
  ssnSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import ArrayViewField from '../../../../components/ArrayViewField';

export const schema = {
  type: 'object',
  properties: {
    deaths: {
      type: 'array',
      minItems: 1,
      maxItems: 100,
      items: {
        type: 'object',
        properties: {
          fullName: fullNameNoSuffixSchema,
          ssn: ssnSchema,
          birthDate: currentOrPastDateSchema,
        },
      },
    },
  },
};

export const uiSchema = {
  ...titleUI('Dependents who have died'),
  deaths: {
    'ui:options': {
      viewField: ArrayViewField,
      itemName: 'Dependent who has died',
      keepInPageOnReview: true,
      customTitle: ' ',
    },
    items: {
      fullName: fullNameNoSuffixUI(),
      ssn: {
        ...ssnUI('Dependent’s Social Security number'),
        'ui:required': () => true,
      },
      birthDate: currentOrPastDateUI({
        title: 'Dependent’s date of birth',
        required: () => true,
      }),
    },
  },
};

import {
  titleUI,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  ssnUI,
  ssnSchema,
  dateOfBirthUI,
  dateOfBirthSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import ChildViewField from '../../../../components/ChildViewField';

export const schema = {
  type: 'object',
  properties: {
    childMarriage: {
      type: 'array',
      minItems: 1,
      maxItems: 100,
      items: {
        type: 'object',
        properties: {
          fullName: fullNameNoSuffixSchema,
          ssn: ssnSchema,
          birthDate: dateOfBirthSchema,
          dateMarried: currentOrPastDateSchema,
        },
      },
    },
  },
};

export const uiSchema = {
  childMarriage: {
    'ui:options': {
      itemName: 'Child who got married',
      viewField: ChildViewField,
      keepInPageOnReview: true,
      customTitle: ' ',
      useDlWrap: true,
    },
    ...titleUI('Children who got married'),
    items: {
      fullName: fullNameNoSuffixUI(title => `Child’s ${title}`),
      ssn: {
        ...ssnUI('Child’s Social Security number'),
        'ui:required': () => true,
      },
      birthDate: {
        ...dateOfBirthUI('Child’s date of birth'),
        'ui:required': () => true,
      },
      dateMarried: {
        ...currentOrPastDateUI('Date of marriage?'),
        'ui:required': () => true,
      },
    },
  },
};

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
    childStoppedAttendingSchool: {
      type: 'array',
      minItems: 1,
      maxItems: 100,
      items: {
        type: 'object',
        properties: {
          fullName: fullNameNoSuffixSchema,
          ssn: ssnSchema,
          birthDate: dateOfBirthSchema,
          dateChildLeftSchool: currentOrPastDateSchema,
        },
      },
    },
  },
};

export const uiSchema = {
  childStoppedAttendingSchool: {
    'ui:options': {
      itemName: 'Child who left school',
      viewField: ChildViewField,
      keepInPageOnReview: true,
      customTitle: ' ',
      useDlWrap: true,
    },
    ...titleUI('Children between ages 18 and 23 who left school'),
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
      dateChildLeftSchool: {
        ...currentOrPastDateUI('Date of marriage?'),
        'ui:required': () => true,
      },
    },
  },
};

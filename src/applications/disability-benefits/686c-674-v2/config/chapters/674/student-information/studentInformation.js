import {
  titleUI,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import ArrayViewField from '../../../../components/ArrayViewField';
import { AddStudentsIntro } from '../helpers';

export const schema = {
  type: 'object',
  properties: {
    'view:674Information': {
      type: 'object',
      properties: {},
    },
    studentInformation: {
      type: 'array',
      minItems: 1,
      maxItems: 100,
      items: {
        type: 'object',
        properties: {
          fullName: fullNameNoSuffixSchema,
          birthDate: currentOrPastDateSchema,
        },
      },
    },
  },
};

export const uiSchema = {
  ...titleUI({
    title: 'Add one or more unmarried students between ages 18 and 23',
    classNames: 'vads-u-color--black vads-u-margin-y--0',
  }),
  'view:674Information': {
    'ui:description': AddStudentsIntro,
    'ui:options': {
      classNames: 'vads-u-margin-top--0',
    },
  },
  studentInformation: {
    'ui:options': {
      itemName: 'Student',
      viewField: ArrayViewField,
      keepInPageOnReview: true,
      customTitle: ' ',
      useDlWrap: true,
    },
    items: {
      fullName: fullNameNoSuffixUI(title => `Student’s ${title}`),
      birthDate: {
        ...currentOrPastDateUI('Student’ date of birth'),
        'ui:required': () => true,
      },
    },
  },
};

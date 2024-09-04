import {
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import SpouseViewField from '../../../../components/SpouseViewField';

export const schema = {
  type: 'object',
  properties: {
    veteranMarriageHistory: {
      type: 'array',
      minItems: 1,
      maxItems: 100,
      items: {
        type: 'object',
        properties: {
          fullName: fullNameNoSuffixSchema,
        },
      },
    },
  },
};

export const uiSchema = {
  ...titleUI('Your former spouses'),
  veteranMarriageHistory: {
    'ui:options': {
      itemName: 'Former spouse',
      viewField: SpouseViewField,
      keepInPageOnReview: true,
      customTitle: ' ',
      useDlWrap: true,
    },
    items: {
      'ui:options': {
        classNames: 'vads-u-margin-left--1p5',
      },
      fullName: fullNameNoSuffixUI(title => `Former spouse’s ${title}`),
    },
  },
};

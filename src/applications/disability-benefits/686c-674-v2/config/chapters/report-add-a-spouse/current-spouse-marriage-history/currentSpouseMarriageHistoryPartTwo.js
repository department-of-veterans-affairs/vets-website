import { capitalize } from 'lodash';
import {
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import SpouseViewField from '../../../../components/SpouseViewField';

export const schema = {
  type: 'object',
  properties: {
    spouseMarriageHistory: {
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
  ...titleUI('Current spouse’s former spouses'),
  'ui:options': {
    updateSchema: (formData, _schema, _uiSchema) => {
      const { first, last } = formData?.spouseInformation?.spouseLegalName;
      const nameTitleUI = _uiSchema;

      if (first && last) {
        nameTitleUI['ui:title'] = `${capitalize(first)} ${capitalize(
          last,
        )}’s former spouses`;
      }

      return _schema;
    },
  },
  spouseMarriageHistory: {
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

import React from 'react';
import SpouseViewField from '../../../../components/SpouseViewField';
import { isChapterFieldRequired } from '../../../helpers';
import { validateName, addSpouse } from '../../../utilities';
import { youMarriedBeforeTitle } from './helpers';

export const schema = addSpouse.properties.veteranMarriageHistory;

export const uiSchema = {
  veteranWasMarriedBefore: {
    'ui:title': youMarriedBeforeTitle,
    'ui:widget': 'yesNo',
    'ui:required': formData => isChapterFieldRequired(formData, 'addSpouse'),
    'ui:options': {
      useDlWrap: true,
    },
  },
  veteranMarriageHistory: {
    'ui:title': (
      <legend className="vads-u-font-size--md">
        Former spouse’s information
      </legend>
    ),
    'ui:options': {
      viewField: SpouseViewField,
      expandUnder: 'veteranWasMarriedBefore',
      expandUnderCondition: true,
      keepInPageOnReview: true,
      itemName: 'former spouse',
      customTitle: ' ',
      updateSchema: () => ({
        minItems: 1,
      }),
    },
    items: {
      fullName: {
        'ui:validations': [validateName],
        'ui:options': {
          useDlWrap: true,
        },
        first: {
          'ui:title': 'Former spouse’s first name',
          'ui:errorMessages': {
            required: 'Enter a first name',
            pattern: 'This field accepts alphabetic characters only',
          },
          'ui:required': formData => formData.veteranWasMarriedBefore,
          'ui:options': {
            useDlWrap: true,
          },
        },
        middle: {
          'ui:title': 'Former spouse’s middle name',
          'ui:options': {
            useDlWrap: true,
            hideEmptyValueInReview: true,
          },
          'ui:errorMessages': {
            pattern: 'This field accepts alphabetic characters only',
          },
        },
        last: {
          'ui:title': 'Former spouse’s last name',
          'ui:errorMessages': {
            required: 'Enter a last name',
            pattern: 'This field accepts alphabetic characters only',
          },
          'ui:required': formData => formData.veteranWasMarriedBefore,
          'ui:options': {
            useDlWrap: true,
          },
        },
        suffix: {
          'ui:title': 'Former spouse’s suffix',
          'ui:options': {
            widgetClassNames: 'form-select-medium',
            useDlWrap: true,
            hideEmptyValueInReview: true,
          },
        },
      },
    },
  },
};

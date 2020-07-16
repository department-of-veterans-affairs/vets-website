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
      updateSchema: () => ({
        minItems: 1,
      }),
    },
    items: {
      fullName: {
        'ui:validations': [validateName],
        first: {
          'ui:title': 'Former spouse’s first name',
          'ui:errorMessages': { required: 'Please enter a first name' },
          'ui:required': formData => formData.veteranWasMarriedBefore,
        },
        middle: {
          'ui:title': 'Former spouse’s middle name',
        },
        last: {
          'ui:title': 'Former spouse’s last name',
          'ui:errorMessages': { required: 'Please enter a last name' },
          'ui:required': formData => formData.veteranWasMarriedBefore,
        },
        suffix: {
          'ui:title': 'Former spouse’s suffix',
          'ui:options': { widgetClassNames: 'form-select-medium' },
        },
      },
    },
  },
};

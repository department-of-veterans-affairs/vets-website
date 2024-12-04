import React from 'react';
import {
  titleUI,
  withAlertOrDescription,
} from 'platform/forms-system/src/js/web-component-patterns';

import Autocomplete from '../../components/Autocomplete';
import { NULL_CONDITION_STRING } from '../../constants';
import { conditionOptions } from '../../content/conditionOptions';
import { conditionInstructions } from '../../content/newConditions';
import { arrayBuilderOptions, createDefaultAndEditTitles } from './utils';

const missingConditionMessage =
  'Enter a condition, diagnosis, or short description of your symptoms';

const regexNonWord = /[^\w]/g;
const sippableId = str =>
  (str || 'blank').replace(regexNonWord, '').toLowerCase();

const validateLength = (err, fieldData) => {
  if (fieldData.length > 255) {
    err.addError('This needs to be less than 256 characters');
  }
};

const validateNotMissing = (err, fieldData) => {
  const isMissingCondition =
    !fieldData?.trim() ||
    fieldData.toLowerCase() === NULL_CONDITION_STRING.toLowerCase();

  if (isMissingCondition) {
    err.addError(missingConditionMessage);
  }
};

const validateNotDuplicate = (err, fieldData, formData) => {
  const currentList =
    formData?.conditionsFirst?.map(condition =>
      condition.condition?.toLowerCase(),
    ) || [];
  const itemLowerCased = fieldData?.toLowerCase() || '';
  const itemSippableId = sippableId(fieldData || '');
  const itemCount = currentList.filter(
    item => item === itemLowerCased || sippableId(item) === itemSippableId,
  );

  if (itemCount.length > 1) {
    err.addError('You’ve already added this condition to your claim');
  }
};

export const validateCondition = (err, fieldData = '', formData = {}) => {
  validateLength(err, fieldData);
  validateNotMissing(err, fieldData);
  validateNotDuplicate(err, fieldData, formData);
};

/** @returns {PageSchema} */
const conditionPage = {
  uiSchema: {
    ...titleUI(
      () =>
        createDefaultAndEditTitles(
          'Tell us the new condition you want to claim',
          `Edit condition`,
        ),
      withAlertOrDescription({
        nounSingular: arrayBuilderOptions.nounSingular,
        description: conditionInstructions,
        hasMultipleItemPages: true,
      }),
    ),
    condition: {
      'ui:title': 'Enter your condition',
      'ui:field': data => (
        <Autocomplete
          availableResults={conditionOptions}
          debounceDelay={200}
          id={data.idSchema.$id}
          formData={data.formData}
          onChange={data.onChange}
        />
      ),
      'ui:errorMessages': {
        required: missingConditionMessage,
      },
      'ui:validations': [validateCondition],
      'ui:options': {
        useAllFormData: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      condition: {
        type: 'string',
      },
    },
    required: ['condition'],
  },
};

export default conditionPage;

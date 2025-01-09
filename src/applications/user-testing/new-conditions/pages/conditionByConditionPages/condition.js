import React from 'react';
import { getUrlPathIndex } from 'platform/forms-system/src/js/helpers';
import {
  titleUI,
  withAlertOrDescription,
} from 'platform/forms-system/src/js/web-component-patterns';

import Autocomplete from '../../components/Autocomplete';
import { NULL_CONDITION_STRING } from '../../constants';
import { conditionOptions } from '../../content/conditionOptions';
import { conditionInstructions } from '../../content/newConditions';
import { arrayBuilderOptions, createDefaultAndEditTitles } from './utils';

const { arrayPath } = arrayBuilderOptions;

export const missingConditionMessage =
  'Enter a condition, diagnosis, or short description of your symptoms';

const regexNonWord = /[^\w]/g;
const generateSaveInProgressId = str =>
  (str || 'blank').replace(regexNonWord, '').toLowerCase();

export const validateLength = (err, fieldData) => {
  if (fieldData.length > 255) {
    err.addError('This needs to be less than 256 characters');
  }
};

export const validateNotMissing = (err, fieldData) => {
  const isMissingCondition =
    !fieldData?.trim() ||
    fieldData.toLowerCase() === NULL_CONDITION_STRING.toLowerCase();

  if (isMissingCondition) {
    err.addError(missingConditionMessage);
  }
};

export const validateNotDuplicate = (err, fieldData, formData, path) => {
  const index = getUrlPathIndex(window.location.pathname);

  const lowerCasedConditions =
    formData?.[path]?.map(condition => condition.condition?.toLowerCase()) ||
    [];

  const fieldDataLowerCased = fieldData?.toLowerCase() || '';
  const fieldDataSaveInProgressId = generateSaveInProgressId(fieldData || '');

  const hasDuplicate = lowerCasedConditions.some((condition, i) => {
    if (index === i) return false;

    return (
      condition === fieldDataLowerCased ||
      generateSaveInProgressId(condition) === fieldDataSaveInProgressId
    );
  });

  if (hasDuplicate) {
    err.addError('You’ve already added this condition to your claim');
  }
};

const validateCondition = (err, fieldData = '', formData = {}) => {
  validateLength(err, fieldData);
  validateNotMissing(err, fieldData);
  validateNotDuplicate(err, fieldData, formData, arrayPath);
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
      'ui:field': data => (
        <Autocomplete
          availableResults={conditionOptions}
          debounceDelay={200}
          id={data.idSchema.$id}
          label="Enter your condition"
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
        hideLabelText: true,
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

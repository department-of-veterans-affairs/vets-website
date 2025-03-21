import React from 'react';
import { getArrayIndexFromPathName } from 'platform/forms-system/src/js/patterns/array-builder/helpers';
import {
  titleUI,
  withAlertOrDescription,
} from 'platform/forms-system/src/js/web-component-patterns';

import Autocomplete from '../../components/Autocomplete';
import { NULL_CONDITION_STRING } from '../../constants';
import { conditionOptions } from '../../content/conditionOptions';
import { NewConditionDescription } from '../../content/conditions';
import { arrayBuilderOptions, createDefaultAndEditTitles } from './utils';

const missingConditionMessage =
  'Enter a condition, diagnosis, or short description of your symptoms';

const validateLength = (err, fieldData) => {
  const errorMessage = 'This needs to be less than 256 characters';

  if (fieldData.length > 255) {
    err.addError(errorMessage);
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

const regexNonWord = /[^\w]/g;

const generateSaveInProgressId = str =>
  (str || 'blank').replace(regexNonWord, '').toLowerCase();

const validateDuplicate = (
  err,
  fieldData,
  items,
  itemAccessor,
  errorMessage,
) => {
  const index = getArrayIndexFromPathName();

  const lowerCasedItems =
    items?.map(item => itemAccessor(item)?.toLowerCase()) || [];

  const fieldDataLowerCased = fieldData?.toLowerCase() || '';
  const fieldDataSaveInProgressId = generateSaveInProgressId(fieldData || '');

  const hasDuplicate = lowerCasedItems.some((item, i) => {
    if (index === i) return false;

    return (
      item === fieldDataLowerCased ||
      generateSaveInProgressId(item) === fieldDataSaveInProgressId
    );
  });

  if (hasDuplicate) {
    err.addError(errorMessage);
  }
};

const validateDuplicateNewCondition = (err, fieldData, formData) => {
  const errorMessage = "You've already added this new condition to your claim";

  validateDuplicate(
    err,
    fieldData,
    formData?.[arrayBuilderOptions.arrayPath],
    condition => condition.newCondition,
    errorMessage,
  );
};

const validateDuplicateWithRatedDisability = (err, fieldData, formData) => {
  const errorMessage = 'You already have this condition as a rated disability';

  validateDuplicate(
    err,
    fieldData,
    formData?.ratedDisabilities,
    disability => disability.name,
    errorMessage,
  );
};

const validateCondition = (err, fieldData = '', formData = {}) => {
  validateLength(err, fieldData);
  validateNotMissing(err, fieldData);
  validateDuplicateNewCondition(err, fieldData, formData);
  validateDuplicateWithRatedDisability(err, fieldData, formData);
};

/** @returns {PageSchema} */
const newConditionPage = {
  uiSchema: {
    ...titleUI(
      () =>
        createDefaultAndEditTitles(
          'Tell us the new condition you want to claim',
          'Edit new condition',
        ),
      withAlertOrDescription({
        nounSingular: arrayBuilderOptions.nounSingular,
        hasMultipleItemPages: true,
      }),
    ),
    newCondition: {
      'ui:description': NewConditionDescription,
      'ui:field': data => (
        <Autocomplete
          availableResults={conditionOptions}
          debounceDelay={200}
          id={data.idSchema.$id}
          label="Select or enter condition"
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
      newCondition: {
        type: 'string',
      },
    },
    required: ['newCondition'],
  },
};

export default newConditionPage;

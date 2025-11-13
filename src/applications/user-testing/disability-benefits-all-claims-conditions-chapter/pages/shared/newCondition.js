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
import { arrayBuilderOptions, createAddAndEditTitles } from './utils';

const ERR_TOO_LONG = 'This needs to be less than 256 characters';
const ERR_DUP_NEW_CONDITION =
  "You've already added this new condition to your claim";
const ERR_DUP_RATED = 'You already have this condition as a rated disability';
const ERR_MISSING_CONDITION =
  'Enter a condition, diagnosis, or short description of your symptoms';

// Check length and presence for the same string in one pass
const validatePresenceAndLength = (err, text = '') => {
  const trimmed = text.trim();

  if (
    !trimmed ||
    trimmed.toLowerCase() === NULL_CONDITION_STRING.toLowerCase()
  ) {
    err.addError(ERR_MISSING_CONDITION);
    return;
  }
  if (trimmed.length > 255) {
    err.addError(ERR_TOO_LONG);
  }
};

const regexNonWord = /[^\w]/g;

const generateSaveInProgressId = str =>
  (str || 'blank').replace(regexNonWord, '').toLowerCase();

const normalize = str => generateSaveInProgressId((str ?? '').toLowerCase());

const hasDuplicateEntry = (value, items = [], accessor, selfIndex) => {
  const target = normalize(value);

  const isDuplicate = (item, idx) => {
    if (idx === selfIndex) return false;
    return normalize(accessor(item)) === target;
  };

  return items.some(isDuplicate);
};

// Simplify validation and checking for duplicate entries
const validateCondition = (err, fieldData = '', formData = {}) => {
  validatePresenceAndLength(err, fieldData);
  const idx = getArrayIndexFromPathName();
  const {
    [arrayBuilderOptions.arrayPath]: arr = [],
    ratedDisabilities = [],
  } = formData;

  if (hasDuplicateEntry(fieldData, arr, cond => cond?.newCondition, idx)) {
    err.addError(ERR_DUP_NEW_CONDITION);
  }
  if (
    hasDuplicateEntry(
      fieldData,
      ratedDisabilities,
      disability => disability?.name,
      idx,
    )
  ) {
    err.addError(ERR_DUP_RATED);
  }
};

/** @returns {PageSchema} */
const newConditionPage = {
  uiSchema: {
    ...titleUI(
      () => createAddAndEditTitles('Add new condition', 'Edit new condition'),
      withAlertOrDescription({
        nounSingular: arrayBuilderOptions.nounSingular,
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
          hint="Start typing for a list of conditions."
          formData={data.formData}
          onChange={data.onChange}
        />
      ),
      'ui:errorMessages': {
        required: ERR_MISSING_CONDITION,
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

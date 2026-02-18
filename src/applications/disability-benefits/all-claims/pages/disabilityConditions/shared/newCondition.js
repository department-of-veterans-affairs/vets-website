import React from 'react';
import {
  titleUI,
  withAlertOrDescription,
} from 'platform/forms-system/src/js/web-component-patterns';

import Autocomplete from '../../../components/AutocompleteNew';
import { NULL_CONDITION_STRING } from '../../../constants';
import { conditionOptions } from '../../../content/conditionOptions';
import { NewConditionDescription } from '../../../content/conditions';
import { arrayOptions, createAddAndEditTitles, isNewCondition } from './utils';

const ERR_TOO_LONG = 'This needs to be less than 256 characters';
const ERR_DUP_NEW_CONDITION =
  "You've already added this new condition to your claim";
const ERR_DUP_RATED = 'You already have this condition as a rated disability';
const ERR_MISSING_CONDITION =
  'Enter a condition, diagnosis, or short description of your symptoms';

const regexNonWord = /[^\w]/g;
const generateSaveInProgressId = str =>
  (str || 'blank').replace(regexNonWord, '').toLowerCase();
const normalize = str => generateSaveInProgressId((str ?? '').toLowerCase());

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

const hasDuplicateEntry = (value, items = [], accessor, index) => {
  const target = normalize(value);
  const normalizedItems = items.map(item => normalize(accessor(item)));

  if (index == null) {
    return normalizedItems.filter(item => item === target).length > 1;
  }

  return normalizedItems.some((val, idx) => idx !== index && val === target);
};

const validateCondition = (
  errors,
  fieldData = '',
  formData = {},
  _schema,
  _uiSchema,
  index,
) => {
  const newDisabilities = formData?.newDisabilities ?? [];
  const ratedDisabilities = formData?.ratedDisabilities ?? [];

  if (!isNewCondition(formData, index)) {
    return;
  }

  validatePresenceAndLength(errors, fieldData);

  if (
    hasDuplicateEntry(
      fieldData,
      newDisabilities,
      item => item?.condition,
      index,
    )
  ) {
    errors.addError(ERR_DUP_NEW_CONDITION);
  }

  if (
    hasDuplicateEntry(fieldData, ratedDisabilities, d => d?.name, undefined)
  ) {
    errors.addError(ERR_DUP_RATED);
  }
};

/** @returns {PageSchema} */
const newConditionPage = {
  uiSchema: {
    ...titleUI(
      () => createAddAndEditTitles('Add new condition', 'Edit new condition'),
      withAlertOrDescription({
        nounSingular: arrayOptions.nounSingular,
      }),
    ),
    condition: {
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
        minLength: ERR_MISSING_CONDITION,
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
    required: ['condition'],
    properties: {
      condition: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
      },
    },
  },
};

export default newConditionPage;

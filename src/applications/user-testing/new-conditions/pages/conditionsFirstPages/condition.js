import React from 'react';
import {
  titleUI,
  withAlertOrDescription,
} from 'platform/forms-system/src/js/web-component-patterns';

import Autocomplete from '../../components/Autocomplete';
import { conditionOptions } from '../../content/conditionOptions';
import { conditionInstructions } from '../../content/newConditions';
import {
  missingConditionMessage,
  validateLength,
  validateNotDuplicate,
  validateNotMissing,
} from '../conditionByConditionPages/condition';
import { arrayBuilderOptions, createDefaultAndEditTitles } from './utils';

const { arrayPath } = arrayBuilderOptions;

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

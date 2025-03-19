import React from 'react';
import {
  radioUI,
  radioSchema,
  titleUI,
  withAlertOrDescription,
} from 'platform/forms-system/src/js/web-component-patterns';

import Autocomplete from '../../components/Autocomplete';
import { conditionOptions } from '../../content/conditionOptions';
import { NewConditionDescription } from '../../content/conditions';
import {
  arrayBuilderOptions,
  createDefaultAndEditTitles,
  missingConditionMessage,
  validateCondition,
} from './utils';

const createRatedDisabilitiesSchema = fullData => {
  const ratedDisabilities = {};

  fullData.ratedDisabilities.forEach(disability => {
    ratedDisabilities[disability.name] = disability.name;
  });

  return { ...ratedDisabilities, 'Add a new condition': 'Add a new condition' };
};

/** @returns {PageSchema} */
const conditionPage = {
  uiSchema: {
    ...titleUI(
      () => createDefaultAndEditTitles('Select condition', `Edit condition`),
      withAlertOrDescription({
        nounSingular: arrayBuilderOptions.nounSingular,
        hasMultipleItemPages: true,
      }),
    ),
    ratedDisability: radioUI({
      title:
        'Select a rated disability that worsened or a new condition to claim',
      updateSchema: (
        _formData,
        _schema,
        _uiSchema,
        _index,
        _path,
        fullData,
      ) => {
        return radioSchema(
          Object.keys(createRatedDisabilitiesSchema(fullData)),
        );
      },
    }),
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
        expandUnder: 'ratedDisability',
        expandUnderCondition: 'New condition',
        expandedContentFocus: true,
      },
      'ui:required': (formData, index) =>
        formData?.[arrayBuilderOptions.arrayPath]?.[index]?.ratedDisability ===
        'New condition',
    },
  },
  schema: {
    type: 'object',
    properties: {
      ratedDisability: radioSchema(
        Object.keys({
          Error: 'Error',
        }),
      ),
      newCondition: {
        type: 'string',
      },
    },
    required: ['ratedDisability'],
  },
};

export default conditionPage;

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

const ratedDisabilities = {
  Lupus: 'Lupus, 40%',
  'Hearing loss': 'Hearing loss, 10%',
  'New condition': 'Add a new condition',
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
      labels: ratedDisabilities,
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
      ratedDisability: radioSchema(Object.keys(ratedDisabilities)),
      newCondition: {
        type: 'string',
      },
    },
    required: ['ratedDisability'],
  },
};

export default conditionPage;

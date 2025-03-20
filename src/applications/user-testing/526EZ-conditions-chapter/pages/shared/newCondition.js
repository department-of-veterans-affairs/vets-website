import React from 'react';
import {
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

/** @returns {PageSchema} */
const newConditionPage = {
  uiSchema: {
    ...titleUI(
      () =>
        createDefaultAndEditTitles(
          'Tell us the condition you want to claim',
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

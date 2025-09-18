import React from 'react';
import { radioUI } from 'platform/forms-system/src/js/web-component-patterns';
import AutoSaveNotice from '../../../components/AutoSaveNotice';

const burialTypeOptions = [
  { value: 'casket', label: 'Casket' },
  { value: 'cremains', label: 'Cremains' },
  { value: 'noRemains', label: 'No remains' },
  { value: 'intactGreen', label: 'Intact green' },
  { value: 'cremainsGreen', label: 'Cremains green' },
];

export default {
  uiSchema: {
    'ui:description': (
      <>
        <AutoSaveNotice />
        <h3 className="vads-u-margin-top--0">Interment details</h3>
      </>
    ),
    burialType: {
      ...radioUI({
        title: 'How will the Veteran be buried?',
        options: burialTypeOptions,
        required: true,
        errorMessages: { required: 'Select how the Veteran will be buried' },
      }),
      'ui:required': () => true,
    },
    'view:burialTypeNote': {
      'ui:description': (
        <p className="vads-u-font-size--sm vads-u-margin-top--2">
          <strong>Note:</strong> Confirm the type of burial with your cemetery
          before continuing. Certain burials may not be offered at all
          locations.
        </p>
      ),
    },
    'ui:order': ['burialType', 'view:burialTypeNote'],
  },
  schema: {
    type: 'object',
    required: ['burialType'],
    properties: {
      burialType: {
        type: 'string',
        enum: burialTypeOptions.map(o => o.value),
        enumNames: burialTypeOptions.map(o => o.label),
      },
      'view:burialTypeNote': {
        type: 'object',
        properties: {},
      },
    },
  },
};

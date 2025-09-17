import React from 'react';
import { radioUI } from 'platform/forms-system/src/js/web-component-patterns';
import AutoSaveNotice from '../../../components/AutoSaveNotice';

const burialLocationOptions = [
  { value: 'inGround', label: 'In-ground' },
  { value: 'columbarium', label: 'Columbarium' },
  { value: 'scattered', label: 'Scattered' },
  { value: 'ossuary', label: 'Ossuary' },
];

export default {
  uiSchema: {
    'ui:description': (
      <>
        <AutoSaveNotice />
        <h3 className="vads-u-margin-top--0">Interment details</h3>
      </>
    ),
    burialLocation: {
      ...radioUI({
        title: 'What is the burial location?',
        options: burialLocationOptions,
        required: true,
        errorMessages: { required: 'Select a burial location' },
      }),
      'ui:required': () => true,
    },
    'view:burialLocationInfo': {
      'ui:description': (
        <va-additional-info trigger="More about burial locations">
          <p>
            Burial locations vary between cemeteries. Check to make sure these
            services are offered with your cemetery before continuing.
          </p>
        </va-additional-info>
      ),
    },
    'ui:order': ['burialLocation', 'view:burialLocationInfo'],
  },
  schema: {
    type: 'object',
    required: ['burialLocation'],
    properties: {
      burialLocation: {
        type: 'string',
        enum: burialLocationOptions.map(o => o.value),
        enumNames: burialLocationOptions.map(o => o.label),
      },
      'view:burialLocationInfo': {
        type: 'object',
        properties: {},
      },
    },
  },
};

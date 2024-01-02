import React from 'react';
import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
import fullNameUI from '@department-of-veterans-affairs/platform-forms/fullName';

const { veteranFullName } = fullSchemaBurials.properties;

export default {
  uiSchema: {
    'ui:description': (
      <>
        <h3>Personal information</h3>
      </>
    ),
    veteranFullName: {
      ...fullNameUI,
      first: {
        'ui:title': 'Veteran’s first name',
      },
      middle: {
        'ui:title': 'Veteran’s middle name',
      },
      last: {
        'ui:title': 'Veteran’s last name',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['veteranFullName'],
    properties: {
      veteranFullName,
    },
  },
};

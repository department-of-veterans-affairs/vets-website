import React from 'react';

export default {
  uiSchema: {
    militaryServiceCurrentlyServing: {
      'ui:title': (
        <>
          <p>
            <b>Are you currently serving in the military?</b>
          </p>
        </>
      ),
      'ui:widget': 'radio',
      'ui:options': {
        widgetProps: {
          yes: { militaryServiceTwo: 'yes' },
          no: {
            militaryServiceTwo: 'no',
          },
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      militaryServiceCurrentlyServing: {
        type: 'string',
        enum: ['Yes', 'No'],
      },
    },
  },
};

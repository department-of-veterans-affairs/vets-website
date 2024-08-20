import React from 'react';

export default {
  uiSchema: {
    militaryServiceCompleted: {
      'ui:title': (
        <>
          <p>
            <b>
              Have you ever completed a previous period of military service?
            </b>
          </p>
        </>
      ),
      'ui:widget': 'radio',
      'ui:options': {
        widgetProps: {
          yes: { militaryServiceThree: 'yes' },
          no: {
            militaryServiceThree: 'no',
          },
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      militaryServiceCompleted: {
        type: 'string',
        enum: ['Yes', 'No'],
      },
    },
  },
};

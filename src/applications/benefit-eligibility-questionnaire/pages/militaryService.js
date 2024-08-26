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
    expectedSeparation: {
      'ui:title': (
        <>
          <p>
            <b>When do you expect to seperate or retire from the service?</b>
          </p>
        </>
      ),
      'ui:widget': 'radio',
      'ui:options': {
        hideIf: formData => formData.militaryServiceCurrentlyServing !== 'Yes',
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
      expectedSeparation: {
        type: 'string',
        enum: [
          'Within the next 3 months',
          'More than 3 months but less than 6 months',
          'Within more than 6 months but less than 1 year',
          'More than 1 year from now',
          'More than 3 years ago',
        ],
      },
    },
  },
};

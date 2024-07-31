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
    militaryServiceTotalTimeServed: {
      'ui:title': (
        <>
          <p>
            <b>In total, how long have you served in the military?</b>
          </p>
          <p>
            If you have served multiple periods, please choose the answer that
            reflects your total amount of service.
          </p>
        </>
      ),
      'ui:widget': 'radio',
      'ui:options': {
        widgetProps: {
          upTo90days: { militaryService: 'Less than 90 days' },
          upTo1yr: {
            militaryService: 'More than 90 days but less than 1 year',
          },
          upTo2yr: {
            militaryService: 'More than 1 year but less than 2 years',
          },
          upTo3yr: {
            militaryService: 'More than 2 year but less than 3 years',
          },
          over3yr: { militaryService: 'More than 3 years' },
        },
      },
    },
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
      militaryServiceCurrentlyServing: {
        type: 'string',
        enum: ['Yes', 'No'],
      },
      militaryServiceTotalTimeServed: {
        type: 'string',
        enum: [
          'Less than 90 Days',
          'More than 90 days but less than 1 year',
          'More than 1 year but less than 2 years',
          'More than 2 year but less than 3 years',
          'More than 3 years',
        ],
      },
      militaryServiceCompleted: {
        type: 'string',
        enum: ['Yes', 'No'],
      },
    },
  },
};

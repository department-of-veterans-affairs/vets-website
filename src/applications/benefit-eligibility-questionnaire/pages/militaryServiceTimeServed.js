import React from 'react';

export default {
  uiSchema: {
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
            militaryService: 'More than 2 years but less than 3 years',
          },
          over3yr: { militaryService: 'More than 3 years' },
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      militaryServiceTotalTimeServed: {
        type: 'string',
        enum: [
          'Less than 90 Days',
          'More than 90 days but less than 1 year',
          'More than 1 year but less than 2 years',
          'More than 2 years but less than 3 years',
          'More than 3 years',
        ],
      },
    },
  },
};

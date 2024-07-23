import React from 'react';

export default {
  uiSchema: {
    separation: {
      'ui:title': (
        <>
          <p>
            <b>How long ago did you separate or retire from service?</b>
          </p>
          <p>
            If you served during multiple periods, please choose the answer that
            corresponds to your most recent separation.
          </p>
        </>
      ),
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          upTo6mo: 'Within the past 6 months',
          upTo1yr: 'More than 6 months ago but less than 1 year ago',
          upTo2yr: 'More than 1 year ago but less than 2 years ago',
          upTo3yr: 'More than 2 years ago but less than 3 years ago',
          over3yr: 'More than 3 years ago',
        },
        widgetProps: {
          upTo6mo: { separation: 'upTo6mo' },
          upTo1yr: { separation: 'upTo1yr' },
          upTo2yr: { separation: 'upTo2yr' },
          upTo3yr: { separation: 'upTo3yr' },
          over3yr: { separation: 'over3yr' },
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      separation: {
        type: 'string',
        enum: ['upTo6mo', 'upTo1yr', 'upTo2yr', 'upTo3yr', 'over3yr'],
      },
    },
  },
};

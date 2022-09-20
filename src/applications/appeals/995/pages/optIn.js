import React from 'react';

export default {
  uiSchema: {
    'ui:description': (
      <div>
        <p>
          If you’re requesting a Supplemental Claim on an issue in an initial
          claim we decided before February 19, 2019, you’ll need to opt in to
          the new decision review process. To do this, please check the box
          here. We’ll move your issue from the old appeals process to the new
          decision review process.
        </p>
        <p>
          Our decision review process is part of the Appeals Modernization Act.
          When you opt in, you’re likely to get a faster decision.
        </p>
      </div>
    ),
    'ui:options': {
      forceDivWrapper: true,
    },
    socOptIn: {
      'ui:title': (
        <strong>
          I understand that if I want any issues reviewed that are currently in
          the old appeals process, I’m opting them in to the new decision review
          process.
        </strong>
      ),
      'ui:options': {
        forceDivWrapper: true,
        keepInPageOnReview: false,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      socOptIn: {
        type: 'boolean',
        enum: [true, false],
        enumNames: Object.values({
          true: 'Yes, I choose to opt in to the new process',
          false: 'You didn’t select this option',
        }),
      },
    },
  },
};

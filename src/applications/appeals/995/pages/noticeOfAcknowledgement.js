import React from 'react';

export default {
  uiSchema: {
    'ui:description': (
      <div>
        <p>
          The 5103 Notice regarding new & relevant evidence must be acknowledged
          when the issue(s) being contested is a Disability Compensation issue.
        </p>
        <p>
          The notice can be found{' '}
          <a
            href="http://www.va.gov/disability/how-to-file-claim/evidence-needed"
            rel="noreferrer"
            target="_blank"
          >
            here
          </a>
          .
        </p>
      </div>
    ),
    'ui:options': {
      forceDivWrapper: true,
    },
    form5103Acknowledged: {
      'ui:widget': 'checkbox',
      'ui:title': <strong>Yes, I acknowledge</strong>,
      'ui:required': () => true,
      'ui:errorMessages': {
        enum: 'Please acknowledge',
      },
      'ui:options': {
        forceDivWrapper: true,
        keepInPageOnReview: false,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      form5103Acknowledged: {
        type: 'boolean',
        enum: [true],
        enumNames: Object.values({
          true: 'Yes, I acknowledge',
        }),
      },
    },
  },
};

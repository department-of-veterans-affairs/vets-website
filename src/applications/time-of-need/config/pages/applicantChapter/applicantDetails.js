import React from 'react';
import {
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    'ui:description': (
      <>
        <h3 className="vads-u-margin-top--0">Applicant’s details</h3>
        <p>
          Provide the applicant’s name. We’ll use these details for the claim.
        </p>
      </>
    ),
    applicantName: {
      first: textUI({
        title: 'First name',
        errorMessages: { required: 'Enter the applicant’s first name' },
      }),
      middle: textUI({
        title: 'Middle name (optional)',
      }),
      last: textUI({
        title: 'Last name',
        errorMessages: { required: 'Enter the applicant’s last name' },
      }),
      suffix: {
        'ui:title': 'Suffix (optional)',
        'ui:widget': 'select',
        'ui:options': {
          classNames: 'vads-u-margin-top--2',
          widgetProps: {
            messageAriaDescribedby: 'Select a suffix if applicable',
          },
        },
      },
      maiden: textUI({
        title: 'Maiden name (optional)',
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['applicantName'],
    properties: {
      applicantName: {
        type: 'object',
        required: ['first', 'last'],
        properties: {
          first: {
            ...textSchema,
            maxLength: 30,
          },
          middle: {
            ...textSchema,
            maxLength: 30,
          },
          last: {
            ...textSchema,
            maxLength: 30,
          },
          suffix: {
            type: 'string',
            enum: ['Jr.', 'Sr.', 'II', 'III', 'IV', 'V'],
          },
          maiden: {
            ...textSchema,
            maxLength: 30,
          },
        },
      },
    },
  },
};

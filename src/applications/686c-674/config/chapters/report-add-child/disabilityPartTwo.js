import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import React from 'react';

export const disabilityPartTwo = {
  uiSchema: {
    ...titleUI('Child’s disability'),

    doesChildHavePermanentDisability: yesNoUI({
      title:
        'Is this child permanently unable to support themselves because they developed a permanent mental or physical disability before they turned 18 years old?',
      required: () => true,
      errorMessages: {
        required: 'You must answer this question.',
      },
    }),
    'view:disabilityInfo': {
      'ui:description': () => (
        <div>
          <p>
            We’ll ask you to submit these documents at the end of this form:
          </p>
          <ul>
            <li>
              Copies of medical records that document your child’s permanent
              physical or mental disability, <strong>and</strong>
            </li>
            <li>
              A statement from your child’s doctor that shows the type and
              severity of the child’s physical or mental disability
            </li>
          </ul>
        </div>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      doesChildHavePermanentDisability: yesNoSchema,
      'view:disabilityInfo': {
        type: 'object',
        properties: {},
      },
    },
  },
};

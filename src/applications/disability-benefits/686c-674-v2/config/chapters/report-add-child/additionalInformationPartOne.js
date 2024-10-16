import {
  titleUI,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import React from 'react';

export const additionalInformationPartOne = {
  uiSchema: {
    ...titleUI('Additional information about this child'),

    doesChildLiveWithYou: radioUI({
      title: 'Does [child’s name] live with you? (*Required)',
      required: () => true,
      labels: {
        Y: 'Yes',
        N: 'No',
      },
      errorMessages: {
        required: 'You must answer this question.',
      },
    }),

    hasChildEverBeenMarried: radioUI({
      title: 'Has [child’s name] ever been married? (*Required)',
      required: () => true,
      labels: {
        Y: 'Yes',
        N: 'No',
      },
      errorMessages: {
        required: 'You must answer this question.',
      },
    }),

    isChildPermanentlyUnableToSupport: radioUI({
      title:
        'Is [child’s name] permanently unable to support themselves because they developed a permanent mental or physical disability before they turned 18 years old? (*Required)',
      required: () => true,
      labels: {
        Y: 'Yes',
        N: 'No',
      },
      errorMessages: {
        required: 'You must answer this question.',
      },
    }),

    documentSubmissionInfo: {
      'ui:description': (
        <div>
          <p>
            We’ll ask you to submit these documents at the end of this form:
          </p>
          <ul>
            <li>
              Copies of medical records that document your child’s permanent
              physical disability, and
            </li>
            <li>
              A statement from your child’s physician that shows the type and
              severity of their physical or mental disability.
            </li>
          </ul>
        </div>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      doesChildLiveWithYou: radioSchema(['Y', 'N']),
      hasChildEverBeenMarried: radioSchema(['Y', 'N']),
      isChildPermanentlyUnableToSupport: radioSchema(['Y', 'N']),
      documentSubmissionInfo: {
        type: 'object',
        properties: {},
      },
    },
    required: [
      'doesChildLiveWithYou',
      'hasChildEverBeenMarried',
      'isChildPermanentlyUnableToSupport',
    ],
  },
};

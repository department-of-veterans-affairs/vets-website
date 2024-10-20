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
      title: 'Does this child live with you?',
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
      title: 'Has this child ever been married?',
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
        'Is this child permanently unable to support themselves because they developed a permanent mental or physical disability before they turned 18 years old?',
      required: () => true,
      labels: {
        Y: 'Yes',
        N: 'No',
      },
      errorMessages: {
        required: 'You must answer this question.',
      },
      hideIf: (formData, _index) => {
        if (Array.isArray(formData)) {
          return false;
        }
        const { addDisabledChild } =
          formData?.['view:selectable686Options'] ?? {};
        return !addDisabledChild;
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
              physical disability, <strong>and</strong>
            </li>
            <li>
              A statement from your child’s doctor that shows the type{' '}
              <strong>and</strong> severity of their physical or mental
              disability.
            </li>
          </ul>
        </div>
      ),
      'ui:options': {
        expandUnder: 'isChildPermanentlyUnableToSupport',
        expandUnderCondition: 'Y',
      },
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

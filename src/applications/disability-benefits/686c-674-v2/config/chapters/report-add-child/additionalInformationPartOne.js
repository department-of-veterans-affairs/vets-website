import React from 'react';
import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const additionalInformationPartOne = {
  uiSchema: {
    ...titleUI('Additional information about this child'),

    doesChildLiveWithYou: yesNoUI({
      title: 'Does this child live with you?',
      required: () => true,
      errorMessages: {
        required: 'You must answer this question.',
      },
    }),

    hasChildEverBeenMarried: yesNoUI({
      title: 'Has this child ever been married?',
      required: () => true,
      errorMessages: {
        required: 'You must answer this question.',
      },
    }),

    isChildPermanentlyUnableToSupport: yesNoUI({
      title:
        'Is this child permanently unable to support themselves because they developed a permanent mental or physical disability before they turned 18 years old?',
      required: formData => {
        const { addDisabledChild } =
          formData?.['view:selectable686Options'] ?? {};
        return addDisabledChild;
      },
      errorMessages: {
        required: 'You must answer this question.',
      },
      hideIf: (formData, _index) => {
        const { addDisabledChild } =
          formData?.['view:selectable686Options'] ?? {};
        return !addDisabledChild;
      },
    }),

    'view:documentSubmissionInfo': {
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
        hideIf: (formData, index) => {
          return formData?.childrenToAdd?.[index]
            ?.isChildPermanentlyUnableToSupport;
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      doesChildLiveWithYou: yesNoSchema,
      hasChildEverBeenMarried: yesNoSchema,
      isChildPermanentlyUnableToSupport: yesNoSchema,
      'view:documentSubmissionInfo': {
        type: 'object',
        properties: {},
      },
    },
  },
};

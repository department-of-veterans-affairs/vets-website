import React from 'react';
import {
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import AutoSaveNotice from '../../../components/AutoSaveNotice';

const PreneedInfo = () => (
  <va-additional-info trigger="About the Pre-Need decision letter">
    <p>
      The Pre-Need decision letter, or Pre-Need determination of eligibility, is
      a form completed before a person’s death used to determine a person’s
      eligibility for a burial benefit.
    </p>
    <p>
      Keep in mind that the pre-need letter doesn’t guarantee burial in a
      specific cemetery, since it isn’t possible to reserve these in advance.
    </p>
  </va-additional-info>
);

/** @type {PageSchema} */
const applicantPreneedDecisionLetter = {
  uiSchema: {
    'ui:title': 'Pre-Need decision letter',
    'ui:description': <AutoSaveNotice />,
    hasPreneedDecisionLetter: {
      'ui:title': 'Do you have an existing Pre-Need decision letter?',
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          yes: 'Yes',
          no: 'No',
          unknown: 'I don’t know',
        },
      },
    },
    preneedDecisionLetterNumber: {
      ...textUI({
        title: 'Enter the existing Pre-Need decision letter number',
      }),
      'ui:required': formData => formData?.hasPreneedDecisionLetter === 'yes',
      'ui:options': {
        hideIf: formData => formData?.hasPreneedDecisionLetter !== 'yes',
      },
    },
    'view:preneedInfo': {
      'ui:field': () => <PreneedInfo />,
      'ui:options': {
        hideIf: formData => formData?.hasPreneedDecisionLetter !== 'yes',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      hasPreneedDecisionLetter: {
        type: 'string',
        enum: ['yes', 'no', 'unknown'],
        enumNames: ['Yes', 'No', 'I don’t know'],
      },
      preneedDecisionLetterNumber: {
        ...textSchema,
        maxLength: 30,
      },
      'view:preneedInfo': {
        type: 'object',
        properties: {},
      },
    },
    required: ['hasPreneedDecisionLetter'],
  },
};

export default applicantPreneedDecisionLetter;

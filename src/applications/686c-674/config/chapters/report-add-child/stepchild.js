import {
  titleUI,
  yesNoUI,
  yesNoSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  firstNameLastNameNoSuffixUI,
  firstNameLastNameNoSuffixSchema,
  ssnUI,
  ssnSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import React from 'react';

export function required(formData, rawIndex) {
  const index = parseInt(rawIndex, 10);
  if (Number.isFinite(index)) {
    return formData?.childrenToAdd?.[index]?.relationshipToChild?.stepchild;
  }
  return formData?.relationshipToChild?.stepchild;
}

export const stepchild = {
  uiSchema: {
    ...titleUI({
      title: "Child's biological parents",
    }),
    isBiologicalChildOfSpouse: yesNoUI({
      title: 'Is this child the biological child of your current spouse?',
      required,
      errorMessages: {
        required: 'Select Yes or No.',
      },
    }),
    dateEnteredHousehold: currentOrPastDateUI({
      title: 'Date this child entered your household',
      required,
      'ui:errorMessages': {
        required: 'Enter the date.',
      },
    }),
    'view:biologicalParentInfo': {
      'ui:description': () => (
        <va-additional-info trigger="How we define when a child enters your household">
          <ul>
            <li>
              You start supporting them financially, <strong>or</strong>
            </li>
            <li>The child starts living with you</li>
          </ul>
        </va-additional-info>
      ),
    },
    biologicalParentName: firstNameLastNameNoSuffixUI(
      title => `Child’s biological parent’s ${title}`,
    ),
    biologicalParentSsn: {
      ...ssnUI('Child’s biological parent’s Social Security number'),
      'ui:required': required,
    },
    biologicalParentDob: currentOrPastDateUI({
      title: 'Child’s biological parent’s date of birth',
      required,
      'ui:errorMessages': {
        required: 'Enter the date.',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      isBiologicalChildOfSpouse: yesNoSchema,
      dateEnteredHousehold: currentOrPastDateSchema,
      'view:biologicalParentInfo': {
        type: 'object',
        properties: {},
      },
      biologicalParentName: firstNameLastNameNoSuffixSchema,
      biologicalParentSsn: ssnSchema,
      biologicalParentDob: currentOrPastDateSchema,
    },
  },
};

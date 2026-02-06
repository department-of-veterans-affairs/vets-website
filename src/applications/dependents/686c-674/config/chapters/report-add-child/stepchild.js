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

/**
 * Required field function for schema fields
 * @returns {boolean} - always true
 */
function required() {
  return true;
}

export const stepchild = {
  uiSchema: {
    ...titleUI({
      title: 'Child’s biological parents',
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
      dataDogHidden: true,
      required,
      'ui:errorMessages': {
        required: 'Enter the date.',
      },
    }),
  },
  schema: {
    type: 'object',
    required: [
      'isBiologicalChildOfSpouse',
      'dateEnteredHousehold',
      'biologicalParentName',
      'biologicalParentSsn',
      'biologicalParentDob',
    ],
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

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

function required(formData, rawIndex) {
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
    isBiologicalChild: yesNoUI({
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
    biologicalParentName: firstNameLastNameNoSuffixUI(
      title => `Child’s biological parent’s ${title}`,
    ),
    biologicalParentSsn: {
      ...ssnUI('This child’s biological parent’s Social Security number'),
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
      isBiologicalChild: yesNoSchema,
      dateEnteredHousehold: currentOrPastDateSchema,
      biologicalParentName: firstNameLastNameNoSuffixSchema,
      biologicalParentSsn: ssnSchema,
      biologicalParentDob: currentOrPastDateSchema,
    },
  },
};

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

export const stepchild = {
  uiSchema: {
    ...titleUI({
      title: "Child's biological parents",
    }),
    isBiologicalChild: yesNoUI({
      title: 'Is [child’s name] the biological child of your current spouse?',
      required: () => true,
      errorMessages: {
        required: 'Select Yes or No.',
      },
    }),
    dateEnteredHousehold: currentOrPastDateUI({
      title: 'Date [Child’s name] entered your household',
      required: () => true,
      'ui:errorMessages': {
        required: 'Enter the date.',
      },
    }),
    biologicalParentName: firstNameLastNameNoSuffixUI(
      title => `[Child’s name]’s biological parent’s ${title}`,
    ),
    biologicalParentSsn: {
      ...ssnUI('[Child’s name]’s biological parent’s Social Security number'),
      'ui:required': () => true,
    },
    biologicalParentDob: currentOrPastDateUI({
      title: '[Child’s name]’s biological parent’s date of birth',
      required: () => true,
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
    required: [
      'isBiologicalChild',
      'dateEnteredHousehold',
      'biologicalParentName',
      'biologicalParentSsn',
      'biologicalParentDob',
    ],
  },
};

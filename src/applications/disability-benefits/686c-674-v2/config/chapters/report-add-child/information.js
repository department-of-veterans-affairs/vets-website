import {
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  radioUI,
  radioSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  arrayBuilderItemFirstPageTitleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { deceasedDependentOptions } from '../report-dependent-death/deceasedDependentArrayPages';

export const information = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Add a child',
      nounSingular: deceasedDependentOptions.nounSingular,
    }),
    fullName: fullNameNoSuffixUI(),
    birthDate: currentOrPastDateUI({
      title: 'Child’s date of birth',
      required: () => true,
    }),
    'view:isUnmarriedAndInSchool': radioUI({
      title:
        'Is this an unmarried child between ages 18 and 23 who attends school?',
      required: () => true,
      labels: {
        Y: 'Yes',
        N: 'No',
      },
    }),
    'view:hasReceivedBenefits': radioUI({
      title:
        'Have you received disability, pension, or DIC (Dependency and Indemnity Compensation) benefits for this child before?',
      required: () => true,
      labels: {
        Y: 'Yes',
        N: 'No',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      fullName: fullNameNoSuffixSchema,
      birthDate: currentOrPastDateSchema,
      'view:isUnmarriedAndInSchool': radioSchema(['Y', 'N']),
      'view:hasReceivedBenefits': radioSchema(['Y', 'N']),
    },
    required: [
      'fullName',
      'birthDate',
      'view:isUnmarriedAndInSchool',
      'view:hasReceivedBenefits',
    ],
  },
};

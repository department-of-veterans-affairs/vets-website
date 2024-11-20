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
    fullName: fullNameNoSuffixUI(title => `Child’s ${title}`),
    birthDate: currentOrPastDateUI({
      title: 'Child’s date of birth',
      required: () => true,
    }),
    'view:isUnmarriedAndInSchool': radioUI({
      title:
        'Is this an unmarried child between ages 18 and 23 who attends school?',
      required: (formData, _index) => {
        const { addChild, report674: addStudent } =
          formData?.['view:selectable686Options'] || {};
        return addChild && addStudent;
      },
      labels: {
        Y: 'Yes',
        N: 'No',
      },
      hideIf: (formData, _index) => {
        const { addChild, report674: addStudent } =
          formData?.['view:selectable686Options'] || {};
        const shouldShow = addChild && addStudent;
        return !shouldShow;
      },
    }),
    'view:hasReceivedBenefits': radioUI({
      title:
        'Have you received disability, pension, or DIC (Dependency and Indemnity Compensation) benefits for this child before?',
      required: (formData, _index) => {
        const { addChild, report674: addStudent } =
          formData?.['view:selectable686Options'] || {};
        return addChild && addStudent;
      },
      labels: {
        Y: 'Yes',
        N: 'No',
      },
      hideIf: (formData, _index) => {
        const { addChild, report674: addStudent } =
          formData?.['view:selectable686Options'] || {};
        const shouldShow = addChild && addStudent;
        return !shouldShow;
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
    required: ['fullName', 'birthDate'],
  },
};

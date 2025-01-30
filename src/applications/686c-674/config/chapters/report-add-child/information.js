import {
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  arrayBuilderItemFirstPageTitleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderOptions } from './config';

export const information = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Add a child',
      nounSingular: arrayBuilderOptions.nounSingular,
    }),
    fullName: fullNameNoSuffixUI(title => `Child’s ${title}`),
    birthDate: currentOrPastDateUI({
      title: 'Child’s date of birth',
      required: () => true,
    }),
    'view:isUnmarriedAndInSchool': yesNoUI({
      title:
        'Is this an unmarried child between ages 18 and 23 who attends school?',
      required: (formData, _index) => {
        const { addChild, report674: addStudent } =
          formData?.['view:selectable686Options'] || {};
        return addChild && addStudent;
      },
      hideIf: (formData, _index) => {
        const { addChild, report674: addStudent } =
          formData?.['view:selectable686Options'] || {};
        const shouldShow = addChild && addStudent;
        return !shouldShow;
      },
    }),
    'view:hasReceivedBenefits': yesNoUI({
      title:
        'Have you received disability, pension, or DIC (Dependency and Indemnity Compensation) benefits for this child before?',
      required: (formData, _index) => {
        const { addChild, report674: addStudent } =
          formData?.['view:selectable686Options'] || {};
        return addChild && addStudent;
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
      'view:isUnmarriedAndInSchool': yesNoSchema,
      'view:hasReceivedBenefits': yesNoSchema,
    },
  },
};

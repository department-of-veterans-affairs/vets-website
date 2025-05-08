import {
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  arrayBuilderItemFirstPageTitleUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
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
  },
  schema: {
    type: 'object',
    properties: {
      fullName: fullNameNoSuffixSchema,
      birthDate: currentOrPastDateSchema,
    },
  },
};

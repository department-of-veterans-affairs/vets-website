import {
  arrayBuilderItemFirstPageTitleUI,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { conlflictOfInterestPolicy } from '../helpers';

const noSpaceOnlyPattern = '^(?!\\s*$).+';

const uiSchema = {
  allProprietarySchoolsEmployeeInfo: {
    ...arrayBuilderItemFirstPageTitleUI({
      title:
        'Information on an individual with a potential conflict of interest who receives VA educational benefits',
    }),
    'ui:description': conlflictOfInterestPolicy,
    first: textUI({
      title: 'First name of individual ',
      errorMessages: {
        required: 'Please enter a first name',
        pattern: 'You must provide a response',
      },
    }),
    last: textUI({
      title: 'Last name of individual',
      errorMessages: {
        required: 'Please enter a last name',
        pattern: 'You must provide a response',
      },
    }),
    title: textUI({
      title: 'Title of individual',
      errorMessages: {
        required: 'Please enter a title',
        pattern: 'You must provide a response',
      },
    }),
  },
};
const schema = {
  type: 'object',
  properties: {
    allProprietarySchoolsEmployeeInfo: {
      type: 'object',
      required: ['first', 'last', 'title'],
      properties: {
        first: {
          ...textSchema,
          maxLength: 30,
          pattern: noSpaceOnlyPattern,
        },
        last: {
          ...textSchema,
          maxLength: 30,
          pattern: noSpaceOnlyPattern,
        },
        title: {
          ...textSchema,
          maxLength: 30,
          pattern: noSpaceOnlyPattern,
        },
      },
    },
  },
};
export { uiSchema, schema };

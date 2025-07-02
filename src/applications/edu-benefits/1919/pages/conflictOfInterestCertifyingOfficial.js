import {
  arrayBuilderItemFirstPageTitleUI,
  textUI,
  textSchema,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { conflictOfInterestPolicy } from '../helpers';

const noSpaceOnlyPattern = '^(?!\\s*$).+';

const uiSchema = {
  certifyingOfficial: {
    ...arrayBuilderItemFirstPageTitleUI({
      title:
        'Information on an individual with a potential conflict of interest who receives VA educational benefits',
    }),
    ...descriptionUI(conflictOfInterestPolicy),
    first: textUI({
      title: 'First name of individual',
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
    certifyingOfficial: {
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

import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameSchema,
  fullNameUI,
  inlineTitleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { veteranFields } from '../definitions/constants';
import { getFullNameLabels } from '../helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    [veteranFields.parentObject]: {
      ...inlineTitleUI('We\'ll start by confirming your identity and how to reach you.'),
      [veteranFields.fullName]: fullNameUI(label =>
        getFullNameLabels(label, false),
      ),
      [veteranFields.dateOfBirth]: dateOfBirthUI(),
    },
  },
  schema: {
    type: 'object',
    properties: {
      [veteranFields.parentObject]: {
        type: 'object',
        properties: {
          [veteranFields.fullName]: fullNameSchema,
          [veteranFields.dateOfBirth]: dateOfBirthSchema,
        },
        required: ['fullName', 'dateOfBirth'],
      },
    },
  },
};

import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameSchema,
  fullNameUI,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { veteranFields } from '../definitions/constants';
import { getFullNameLabels } from '../helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    [veteranFields.parentObject]: {
      ...titleUI({
        title: 'We need to collect some basic information about you',
      }),
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

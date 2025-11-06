import {
  ssnUI,
  vaFileNumberUI,
  serviceNumberUI,
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameSchema,
  fullNameUI,
  inlineTitleUI,
  ssnSchema,
  vaFileNumberSchema,
  serviceNumberSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { veteranFields } from '../definitions/constants';
import { getFullNameLabels } from '../helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    [veteranFields.parentObject]: {
      ...inlineTitleUI(
        "We'll start by confirming your identity and how to reach you.",
      ),
      [veteranFields.fullName]: fullNameUI(label =>
        getFullNameLabels(label, false),
      ),
      [veteranFields.dateOfBirth]: dateOfBirthUI(),

      [veteranFields.ssn]: ssnUI(),
      [veteranFields.vaFileNumber]: vaFileNumberUI(),
      [veteranFields.veteranServiceNumber]: serviceNumberUI(
        'VA service number',
      ),
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
          [veteranFields.ssn]: ssnSchema,
          [veteranFields.vaFileNumber]: vaFileNumberSchema,
          [veteranFields.veteranServiceNumber]: serviceNumberSchema,
        },
        required: ['fullName', 'dateOfBirth', veteranFields.ssn],
      },
    },
  },
};

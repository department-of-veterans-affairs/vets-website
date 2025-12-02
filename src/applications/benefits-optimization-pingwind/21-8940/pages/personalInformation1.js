import {
  ssnUI,
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  inlineTitleUI,
  ssnSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import VaDateField from '~/platform/forms-system/src/js/web-component-fields/VaDateField';
import { veteranFields } from '../definitions/constants';
import { getFullNameLabels } from '../helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    [veteranFields.parentObject]: {
      ...inlineTitleUI(
        "We'll start by confirming your identity and how to reach you.",
      ),
      [veteranFields.fullName]: fullNameNoSuffixUI(label =>
        getFullNameLabels(label, false),
      ),
      [veteranFields.dateOfBirth]: {
        ...dateOfBirthUI({
          hint: 'For example: January 19 2022',
        }),
        'ui:webComponentField': VaDateField,
      },
      [veteranFields.ssn]: ssnUI(),
    },
  },
  schema: {
    type: 'object',
    properties: {
      [veteranFields.parentObject]: {
        type: 'object',
        properties: {
          [veteranFields.fullName]: fullNameNoSuffixSchema,
          [veteranFields.dateOfBirth]: dateOfBirthSchema,
          [veteranFields.ssn]: ssnSchema,
        },
        required: [
          veteranFields.fullName,
          veteranFields.dateOfBirth,
          veteranFields.ssn,
        ],
      },
    },
  },
};

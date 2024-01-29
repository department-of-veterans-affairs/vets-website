import {
  firstNameLastNameNoSuffixSchema,
  firstNameLastNameNoSuffixUI,
  dateOfBirthSchema,
  dateOfBirthUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { getNameAndDobPageTitle } from '../helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    // TODO: Use ...titleUI() once that supports functions for title
    'ui:title': ({ formData }) => getNameAndDobPageTitle(formData),
    fullName: firstNameLastNameNoSuffixUI(),
    dateOfBirth: dateOfBirthUI({ required: true }),
  },
  schema: {
    type: 'object',
    properties: {
      fullName: firstNameLastNameNoSuffixSchema,
      dateOfBirth: dateOfBirthSchema,
    },
    required: ['fullName', 'dateOfBirth'],
  },
};

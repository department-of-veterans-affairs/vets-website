import {
  ssnOrVaFileNumberSchema,
  ssnOrVaFileNumberUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { getIdentityInfoPageTitle } from '../helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(({ formData }) => getIdentityInfoPageTitle(formData)),
    veteranId: ssnOrVaFileNumberUI(),
    veteranInsuranceFileNumber: {
      'ui:title': 'VA insurance file number',
      'ui:options': {
        charcount: 9,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      veteranId: ssnOrVaFileNumberSchema,
      // TODO: Determine pattern for insurance file number
      veteranInsuranceFileNumber: {
        type: 'string',
        maxLength: 9,
      },
    },
  },
};

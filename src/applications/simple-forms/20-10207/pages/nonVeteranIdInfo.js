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
    nonVeteranId: ssnOrVaFileNumberUI(),
  },
  schema: {
    type: 'object',
    properties: {
      nonVeteranId: ssnOrVaFileNumberSchema,
    },
  },
};

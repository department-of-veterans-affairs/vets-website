import {
  ssnOrVaFileNumberSchema,
  ssnOrVaFileNumberUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { getIdentityInfoPageTitle } from '../helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': ({ formData }) => getIdentityInfoPageTitle(formData),
    id: ssnOrVaFileNumberUI(),
  },
  schema: {
    type: 'object',
    properties: {
      id: ssnOrVaFileNumberSchema,
    },
  },
};

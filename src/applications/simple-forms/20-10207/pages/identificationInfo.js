import {
  ssnOrVaFileNumberSchema,
  ssnOrVaFileNumberUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { getIdentityPageTitle } from '../helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': ({ formData }) => getIdentityPageTitle(formData),
    id: ssnOrVaFileNumberUI(),
  },
  schema: {
    type: 'object',
    properties: {
      id: ssnOrVaFileNumberSchema,
    },
  },
};

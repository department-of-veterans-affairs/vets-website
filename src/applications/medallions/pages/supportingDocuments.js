import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { supportingDocsInfo } from '../utils/helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Supporting documents'),
    'ui:description': formData => supportingDocsInfo(formData),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

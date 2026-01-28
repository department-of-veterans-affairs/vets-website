import {
  fullNameUI,
  fullNameSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { requiresSpouseInfo } from './helpers';
import { showMultiplePageResponse } from '../../../helpers';

/** @type {PageSchema} */
export default {
  title: 'Spouse Name',
  path: 'household/current-marriage/spouse-name',
  depends: formData =>
    showMultiplePageResponse() && requiresSpouseInfo(formData),
  uiSchema: {
    ...titleUI('Spouse’s Name'),
    spouseFullName: fullNameUI(title => `Spouse’s ${title}`),
  },
  schema: {
    type: 'object',
    required: ['spouseFullName'],
    properties: {
      spouseFullName: fullNameSchema,
    },
  },
};

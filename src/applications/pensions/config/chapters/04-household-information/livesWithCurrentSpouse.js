import get from 'platform/utilities/data/get';
import {
  yesNoUI,
  yesNoSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { requiresSpouseInfo } from './helpers';
import { showMultiplePageResponse } from '../../../helpers';

const generateSpouseLabel = formData => {
  const spouseName = get('spouseFullName', formData);
  return {
    title: `Do you live with ${spouseName.first} ${spouseName.last}?`,
  };
};

/** @type {PageSchema} */
export default {
  title: 'Spouse Name',
  path: 'household/current-marriage/lives-with-spouse',
  depends: formData =>
    showMultiplePageResponse() && requiresSpouseInfo(formData),
  uiSchema: {
    ...titleUI('Additional marriage information'),
    'view:liveWithSpouse': yesNoUI({
      updateSchema: formData => generateSpouseLabel(formData),
    }),
  },
  schema: {
    type: 'object',
    required: ['view:liveWithSpouse'],
    properties: {
      'view:liveWithSpouse': yesNoSchema,
    },
  },
};

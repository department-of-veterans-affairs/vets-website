import VaTextareaField from 'platform/forms-system/src/js/web-component-fields/VaTextareaField';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

import { ADDITIONAL_INFO_OTHER_HOUSING_RISKS_3RD_PTY_VET } from '../config/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Other housing risks'),
    otherHousingRisks: {
      'ui:title':
        'Tell us about other housing risks the Veteran is experiencing',
      'ui:webComponentField': VaTextareaField,
      'ui:options': {
        charcount: true,
      },
    },
    'view:additionalInfo': {
      'ui:description': ADDITIONAL_INFO_OTHER_HOUSING_RISKS_3RD_PTY_VET,
    },
  },
  schema: {
    type: 'object',
    properties: {
      otherHousingRisks: {
        type: 'string',
        maxLength: 100,
      },
      'view:additionalInfo': {
        type: 'object',
        properties: {},
      },
    },
  },
};

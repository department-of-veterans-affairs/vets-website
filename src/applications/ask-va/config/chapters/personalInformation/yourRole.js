import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import PageFieldSummary from '../../../components/PageFieldSummary';
import { CHAPTER_3, yourRoleOptions } from '../../../constants';

const yourRolePage = {
  uiSchema: {
    'ui:objectViewField': PageFieldSummary,
    yourRole: radioUI({
      title: CHAPTER_3.YOUR_ROLE.TITLE,
      labelHeaderLevel: '3',
      labels: yourRoleOptions,
      errorMessages: {
        required: 'Please select your role',
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['yourRole'],
    properties: {
      yourRole: radioSchema(Object.keys(yourRoleOptions)),
    },
  },
};

export default yourRolePage;

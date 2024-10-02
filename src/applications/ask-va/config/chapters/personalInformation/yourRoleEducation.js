import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import PageFieldSummary from '../../../components/PageFieldSummary';
import { CHAPTER_3, yourRoleOptionsEducation } from '../../../constants';

const yourRoleEducationPage = {
  uiSchema: {
    'ui:objectViewField': PageFieldSummary,
    yourRoleEducation: radioUI({
      title: CHAPTER_3.YOUR_ROLE.TITLE,
      labelHeaderLevel: '3',
      labels: yourRoleOptionsEducation,
      errorMessages: {
        required: 'Please select your role',
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['yourRoleEducation'],
    properties: {
      yourRoleEducation: radioSchema(Object.keys(yourRoleOptionsEducation)),
    },
  },
};

export default yourRoleEducationPage;

import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import PageFieldSummary from '../../../components/PageFieldSummary';
import { CHAPTER_3, yourRoleOptionsEducation } from '../../../constants';

const yourRoleEducationPage = {
  uiSchema: {
    'ui:objectViewField': PageFieldSummary,
    yourRole: radioUI({
      title: CHAPTER_3.YOUR_ROLE.TITLE,
      labelHeaderLevel: '3',
      labels: yourRoleOptionsEducation,
      errorMessages: {
        required: 'Select your role',
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['yourRole'],
    properties: {
      yourRole: radioSchema(Object.values(yourRoleOptionsEducation)),
    },
  },
};

export default yourRoleEducationPage;

import {
  radioSchema,
  radioUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
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
        required: 'Please select your role',
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

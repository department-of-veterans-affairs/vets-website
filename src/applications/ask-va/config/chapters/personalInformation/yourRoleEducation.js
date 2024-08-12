import FormElementTitle from '../../../components/FormElementTitle';
import PageFieldSummary from '../../../components/PageFieldSummary';
import { CHAPTER_3, yourRoleOptionsEducation } from '../../../constants';
import { radioSchema, radioUI } from '../../schema-helpers/radioHelper';

const yourRoleEducationPage = {
  uiSchema: {
    'ui:description': FormElementTitle({ title: CHAPTER_3.YOUR_ROLE.TITLE }),
    'ui:objectViewField': PageFieldSummary,
    yourRoleEducation: radioUI({
      title: CHAPTER_3.YOUR_ROLE.QUESTION_1,
      labels: yourRoleOptionsEducation,
    }),
  },
  schema: {
    type: 'object',
    required: ['yourRoleEducation'],
    properties: {
      yourRoleEducation: radioSchema(Object.values(yourRoleOptionsEducation)),
    },
  },
};

export default yourRoleEducationPage;

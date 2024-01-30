import FormElementTitle from '../../../components/FormElementTitle';
import PageFieldSummary from '../../../components/PageFieldSummary';
import { CHAPTER_3, yourRoleOptions } from '../../../constants';
import { radioSchema, radioUI } from '../../schema-helpers/radioHelper';

const yourRolePage = {
  uiSchema: {
    'ui:description': FormElementTitle({ title: CHAPTER_3.YOUR_ROLE.TITLE }),
    'ui:objectViewField': PageFieldSummary,
    yourRole: radioUI({
      title: CHAPTER_3.YOUR_ROLE.QUESTION_1,
      labels: yourRoleOptions,
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

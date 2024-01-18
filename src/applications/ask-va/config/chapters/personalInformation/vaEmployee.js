import FormElementTitle from '../../../components/FormElementTitle';
import { radioUI, radioSchema } from '../../schema-helpers/radioHelper';
import { CHAPTER_3, yesNoOptions } from '../../../constants';

const vaEmployeePage = {
  uiSchema: {
    'ui:description': FormElementTitle({
      title: CHAPTER_3.PAGE_8.TITLE,
    }),
    isVAEmployee: radioUI({
      title: CHAPTER_3.PAGE_8.QUESTION_1,
      description: '',
      labels: yesNoOptions,
    }),
  },
  schema: {
    type: 'object',
    required: ['isVAEmployee'],
    properties: {
      isVAEmployee: radioSchema(Object.keys(yesNoOptions)),
    },
  },
};

export default vaEmployeePage;

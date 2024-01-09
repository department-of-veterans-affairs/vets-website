import FormElementTitle from '../../../components/FormElementTitle';
import { CHAPTER_2, reasonOptions } from '../../../constants';
import { radioSchema, radioUI } from '../../schema-helpers/radioHelper';

const reasonContactPage = {
  uiSchema: {
    'ui:description': FormElementTitle({ title: CHAPTER_2.PAGE_2.TITLE }),
    question: radioUI({
      title: CHAPTER_2.PAGE_2.QUESTION_1,
      labels: reasonOptions,
    }),
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      question: radioSchema(Object.keys(reasonOptions)),
    },
  },
};

export default reasonContactPage;

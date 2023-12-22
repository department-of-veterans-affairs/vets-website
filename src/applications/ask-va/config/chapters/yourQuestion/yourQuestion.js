import FormElementTitle from '../../../components/FormElementTitle';
import { CHAPTER_2 } from '../../../constants';

const yourQuestionPage = {
  uiSchema: {
    'ui:description': FormElementTitle({ title: CHAPTER_2.PAGE_3.TITLE }),
    question: {
      'ui:title': CHAPTER_2.PAGE_3.QUESTION_1,
      'ui:widget': 'textarea',
    },
  },
  schema: {
    type: 'object',
    required: ['question'],
    properties: {
      question: {
        type: 'string',
      },
    },
  },
};

export default yourQuestionPage;

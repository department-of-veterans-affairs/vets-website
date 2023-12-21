import FormElementTitle from '../../../components/FormElementTitle';
import PageFieldSummary from '../../../components/PageFieldSummary';
import { CHAPTER_2 } from '../../../constants';

const questionAboutPage = {
  uiSchema: {
    'ui:description': FormElementTitle({ title: CHAPTER_2.PAGE_1.TITLE }),
    'ui:objectViewField': PageFieldSummary,
    question: {
      'ui:title': CHAPTER_2.PAGE_1.QUESTION_1,
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          myOwn: 'My own VA benefits',
          someoneElse: "Someone else's VA benefits",
          general: "It's a general question",
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['question'],
    properties: {
      question: {
        type: 'string',
        enum: ['myOwn', 'someoneElse', 'general'],
      },
    },
  },
};

export default questionAboutPage;

import VaTextareaField from 'platform/forms-system/src/js/web-component-fields/VaTextareaField';
import FormElementTitle from '../../../components/FormElementTitle';
import PageFieldSummary from '../../../components/PageFieldSummary';
import { CHAPTER_2 } from '../../../constants';

const yourQuestionPageB = {
  uiSchema: {
    'ui:description': FormElementTitle({ title: CHAPTER_2.PAGE_3.TITLE }),
    'ui:objectViewField': PageFieldSummary,
    question: {
      'ui:title': CHAPTER_2.PAGE_3.QUESTION_1,
      'ui:webComponentField': VaTextareaField,
      'ui:required': () => true,
      'ui:errorMessages': {
        required: 'Please let us know what your question is about.',
      },
      'ui:options': {
        required: true,
        charcount: true,
        useFormsPattern: 'single',
      },
    },
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      question: {
        type: 'string',
        maxLength: 10000,
      },
    },
  },
};

export default yourQuestionPageB;

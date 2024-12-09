import PageFieldSummary from '../../../components/PageFieldSummary';
import { CHAPTER_2 } from '../../../constants';

const whoIsYourQuestionAboutPage = {
  uiSchema: {
    'ui:objectViewField': PageFieldSummary,
    whoIsYourQuestionAbout: {
      'ui:title': CHAPTER_2.PAGE_1.TITLE,
    },
  },
  schema: {
    type: 'object',
    required: ['whoIsYourQuestionAbout'],
    properties: {
      whoIsYourQuestionAbout: {
        type: 'string',
      },
    },
  },
};

export default whoIsYourQuestionAboutPage;

import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import PageFieldSummary from '../../../components/PageFieldSummary';
import SignInMayBeRequired from '../../../components/SignInMyBeRequired';
import {
  CHAPTER_2,
  whoIsYourQuestionAboutDescriptions,
  whoIsYourQuestionAboutLabels,
} from '../../../constants';

const whoIsYourQuestionAboutPage = {
  uiSchema: {
    'ui:description': SignInMayBeRequired,
    'ui:objectViewField': PageFieldSummary,
    whoIsYourQuestionAbout: {
      ...radioUI({
        title: CHAPTER_2.PAGE_1.TITLE,
        labelHeaderLevel: '3',
        labels: whoIsYourQuestionAboutLabels,
        descriptions: whoIsYourQuestionAboutDescriptions,
        required: () => true,
        errorMessages: {
          required: 'Please select who your question is about',
        },
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['whoIsYourQuestionAbout'],
    properties: {
      whoIsYourQuestionAbout: radioSchema(
        Object.values(whoIsYourQuestionAboutLabels),
      ),
    },
  },
};

export default whoIsYourQuestionAboutPage;

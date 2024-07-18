import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import PageFieldSummary from '../../../components/PageFieldSummary';
import SignInMayBeRequired from '../../../components/SignInMyBeRequired';
import {
  CHAPTER_2,
  questionAboutDescriptions,
  questionAboutLabels,
} from '../../../constants';

const questionAboutPage = {
  uiSchema: {
    'ui:description': SignInMayBeRequired,
    'ui:objectViewField': PageFieldSummary,
    questionAbout: {
      ...radioUI({
        title: CHAPTER_2.PAGE_1.TITLE,
        labelHeaderLevel: '3',
        labels: questionAboutLabels,
        descriptions: questionAboutDescriptions,
        required: () => true,
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['questionAbout'],
    properties: {
      questionAbout: radioSchema(Object.values(questionAboutLabels)),
    },
  },
};

export default questionAboutPage;

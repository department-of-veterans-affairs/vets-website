import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import SignInMayBeRequired from '../../../components/SignInMyBeRequired';
import {
  CHAPTER_2,
  questionAboutDescriptions,
  questionAboutLabels,
} from '../../../constants';

const questionAboutPage = {
  uiSchema: {
    'ui:description': SignInMayBeRequired,
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
      questionAbout: radioSchema(Object.keys(questionAboutLabels)),
    },
  },
};

export default questionAboutPage;

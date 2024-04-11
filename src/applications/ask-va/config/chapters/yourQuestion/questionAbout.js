import {
  radioSchema,
  radioUI,
} from '@department-of-veterans-affairs/platform-forms-system/src/js/web-component-patterns/radioPattern';
import FormElementTitle from '../../../components/FormElementTitle';
import {
  CHAPTER_2,
  questionAboutDescriptions,
  questionAboutLabels,
} from '../../../constants';

const questionAboutPage = {
  uiSchema: {
    'ui:description': FormElementTitle({ title: CHAPTER_2.PAGE_1.TITLE }),
    questionAbout: {
      ...radioUI({
        title: CHAPTER_2.PAGE_1.QUESTION_1,
        labels: questionAboutLabels,
        descriptions: questionAboutDescriptions,
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

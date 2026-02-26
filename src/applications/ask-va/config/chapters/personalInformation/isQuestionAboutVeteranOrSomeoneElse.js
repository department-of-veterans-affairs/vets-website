import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  CHAPTER_3,
  isQuestionAboutVeteranOrSomeoneElseLabels,
} from '../../../constants';

const isQuestionAboutVeteranOrSomeoneElsePage = {
  uiSchema: {
    isQuestionAboutVeteranOrSomeoneElse: radioUI({
      title: CHAPTER_3.WHO_QUES_IS_ABOUT.TITLE,
      labelHeaderLevel: '3',
      labels: isQuestionAboutVeteranOrSomeoneElseLabels,
      errorMessages: {
        required: 'Let us know who your question is about.',
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['isQuestionAboutVeteranOrSomeoneElse'],
    properties: {
      isQuestionAboutVeteranOrSomeoneElse: radioSchema(
        Object.values(isQuestionAboutVeteranOrSomeoneElseLabels),
      ),
    },
  },
};

export default isQuestionAboutVeteranOrSomeoneElsePage;

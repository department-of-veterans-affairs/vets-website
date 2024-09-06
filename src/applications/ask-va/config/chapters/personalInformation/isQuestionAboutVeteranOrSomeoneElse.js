import React from 'react';
import {
  CHAPTER_3,
  isQuestionAboutVeteranOrSomeoneElseLabels,
} from '../../../constants';
import { radioSchema, radioUI } from '../../schema-helpers/radioHelper';

const question = (
  <h3 className="vads-u-display--inline">
    {CHAPTER_3.WHO_QUES_IS_ABOUT.TITLE}
  </h3>
);

const isQuestionAboutVeteranOrSomeoneElsePage = {
  uiSchema: {
    'ui:title': question,
    isQuestionAboutVeteranOrSomeoneElse: radioUI({
      title: CHAPTER_3.WHO_QUES_IS_ABOUT.QUESTION_1,
      labels: isQuestionAboutVeteranOrSomeoneElseLabels,
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

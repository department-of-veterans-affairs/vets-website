import React from 'react';
import { radioUI, radioSchema } from '../../schema-helpers/radioHelper';
import { CHAPTER_3, whoYourQuestionIsAbout } from '../../../constants';

const question = (
  <h3 className="vads-u-display--inline">
    {CHAPTER_3.WHO_QUES_IS_ABOUT.TITLE}
  </h3>
);

const whoQuestionAboutPage = {
  uiSchema: {
    'ui:title': question,
    whoQuestionAbout: radioUI({
      title: CHAPTER_3.WHO_QUES_IS_ABOUT.QUESTION_1,
      labels: whoYourQuestionIsAbout,
    }),
  },
  schema: {
    type: 'object',
    required: ['whoQuestionAbout'],
    properties: {
      whoQuestionAbout: radioSchema(Object.keys(whoYourQuestionIsAbout)),
    },
  },
};

export default whoQuestionAboutPage;

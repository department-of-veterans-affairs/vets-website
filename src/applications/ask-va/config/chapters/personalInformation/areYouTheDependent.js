import React from 'react';
import { radioUI, radioSchema } from '../../schema-helpers/radioHelper';
import { CHAPTER_3, yesNoOptions } from '../../../constants';

const questionHeader = (
  <h4 className="vads-u-margin-bottom--1 vads-u-display--inline">
    {CHAPTER_3.PAGE_4.TITLE}
  </h4>
);

const areYouTheDependentPage = {
  uiSchema: {
    'ui:title': questionHeader,
    isTheDependent: radioUI({
      title: CHAPTER_3.PAGE_4.QUESTION_1,
      description: '',
      labels: yesNoOptions,
    }),
  },
  schema: {
    type: 'object',
    required: ['isTheDependent'],
    properties: {
      isTheDependent: radioSchema(Object.keys(yesNoOptions)),
    },
  },
};

export default areYouTheDependentPage;

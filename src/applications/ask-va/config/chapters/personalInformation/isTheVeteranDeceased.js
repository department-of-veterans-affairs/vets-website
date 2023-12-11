import React from 'react';
import { radioUI, radioSchema } from '../../schema-helpers/radioHelper';
import { CHAPTER_3, yesNoOptions } from '../../../constants';

const question = (
  <h4 className="vads-u-margin-bottom--1 vads-u-display--inline">
    {CHAPTER_3.PAGE_6.QUESTION_1}
  </h4>
);

const isTheVeteranDeceasedPage = {
  uiSchema: {
    isVeteranDeceased: radioUI({
      title: question,
      description: '',
      labels: yesNoOptions,
    }),
  },
  schema: {
    type: 'object',
    required: ['isVeteranDeceased'],
    properties: {
      isVeteranDeceased: radioSchema(Object.keys(yesNoOptions)),
    },
  },
};

export default isTheVeteranDeceasedPage;

import React from 'react';
import { radioUI, radioSchema } from '../../schema-helpers/radioHelper';
import { CHAPTER_3, yesNoOptions } from '../../../constants';

const questionHeader = (
  <h4 className="vads-u-margin-bottom--1 vads-u-display--inline">
    {CHAPTER_3.VET_DECEASED.TITLE}
  </h4>
);

const isTheVeteranDeceasedPage = {
  uiSchema: {
    'ui:title': questionHeader,
    isVeteranDeceased: radioUI({
      title: CHAPTER_3.VET_DECEASED.QUESTION_1,
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

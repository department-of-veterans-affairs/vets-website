import React from 'react';
import { radioUI, radioSchema } from '../../schema-helpers/radioHelper';
import { CHAPTER_3, yesNoOptions } from '../../../constants';

const questionHeader = (
  <h4 className="vads-u-margin-bottom--1 vads-u-display--inline">
    {CHAPTER_3.PAGE_3.TITLE}
  </h4>
);

const areYouTheVeteranPage = {
  uiSchema: {
    'ui:title': questionHeader,
    isTheVeteran: radioUI({
      title: CHAPTER_3.PAGE_3.QUESTION_1,
      description: '',
      labels: yesNoOptions,
    }),
  },
  schema: {
    type: 'object',
    required: ['isTheVeteran'],
    properties: {
      isTheVeteran: radioSchema(Object.keys(yesNoOptions)),
    },
  },
};

export default areYouTheVeteranPage;

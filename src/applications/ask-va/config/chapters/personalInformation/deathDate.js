import React from 'react';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { CHAPTER_3 } from '../../../constants';

const question = (
  <h4 className="vads-u-display--inline">{CHAPTER_3.PAGE_7.QUESTION_1}</h4>
);

const deathDatePage = {
  uiSchema: {
    dateOfDeath: currentOrPastDateUI(question),
  },
  schema: {
    type: 'object',
    required: ['dateOfDeath'],
    properties: {
      dateOfDeath: {
        type: 'string',
      },
    },
  },
};

export default deathDatePage;

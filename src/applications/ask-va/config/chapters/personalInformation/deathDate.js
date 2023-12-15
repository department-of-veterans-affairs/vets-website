import React from 'react';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { CHAPTER_3 } from '../../../constants';

const questionHeader = (
  <h4 className="vads-u-display--inline">{CHAPTER_3.PAGE_7.TITLE}</h4>
);

const deathDatePage = {
  uiSchema: {
    'ui:title': questionHeader,
    dateOfDeath: currentOrPastDateUI(CHAPTER_3.PAGE_7.QUESTION_1),
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

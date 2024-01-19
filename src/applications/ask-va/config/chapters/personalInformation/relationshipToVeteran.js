import React from 'react';
import { radioUI, radioSchema } from '../../schema-helpers/radioHelper';
import { CHAPTER_3, relationshipOptions } from '../../../constants';

const question = (
  <h3 className="vads-u-display--inline">{CHAPTER_3.PAGE_1.TITLE}</h3>
);

const relationshipToVeteranPage = {
  uiSchema: {
    'ui:title': question,
    'ui:description': CHAPTER_3.PAGE_1.PAGE_DESCRIPTION,
    personalRelationship: radioUI({
      title: CHAPTER_3.PAGE_1.QUESTION_1,
      labels: relationshipOptions,
    }),
  },
  schema: {
    type: 'object',
    required: ['personalRelationship'],
    properties: {
      personalRelationship: radioSchema(Object.keys(relationshipOptions)),
    },
  },
};

export default relationshipToVeteranPage;

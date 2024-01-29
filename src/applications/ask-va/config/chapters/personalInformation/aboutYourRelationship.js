import React from 'react';
import { radioUI, radioSchema } from '../../schema-helpers/radioHelper';
import { CHAPTER_3, aboutRelationship } from '../../../constants';

const question = (
  <h3 className="vads-u-display--inline">
    {CHAPTER_3.ABOUT_YOUR_RELATIONSHIP.TITLE}
  </h3>
);

const aboutYourRelationshipPage = {
  uiSchema: {
    'ui:title': question,
    aboutYourRelationship: radioUI({
      title: CHAPTER_3.ABOUT_YOUR_RELATIONSHIP.QUESTION_1,
      labels: aboutRelationship,
    }),
  },
  schema: {
    type: 'object',
    required: ['aboutYourRelationship'],
    properties: {
      aboutYourRelationship: radioSchema(Object.keys(aboutRelationship)),
    },
  },
};

export default aboutYourRelationshipPage;

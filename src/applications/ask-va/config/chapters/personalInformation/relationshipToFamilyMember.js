import React from 'react';
import { radioUI, radioSchema } from '../../schema-helpers/radioHelper';
import { CHAPTER_3, aboutRelationship } from '../../../constants';

const question = (
  <h3 className="vads-u-display--inline">{CHAPTER_3.PAGE_17.TITLE}</h3>
);

const aboutYourRelationshipToFamilyMemberPage = {
  uiSchema: {
    'ui:title': question,
    aboutYourRelationshipToFamilyMember: radioUI({
      title: CHAPTER_3.PAGE_11.QUESTION_1,
      labels: aboutRelationship,
    }),
  },
  schema: {
    type: 'object',
    required: ['aboutYourRelationshipToFamilyMember'],
    properties: {
      aboutYourRelationshipToFamilyMember: radioSchema(
        Object.keys(aboutRelationship),
      ),
    },
  },
};

export default aboutYourRelationshipToFamilyMemberPage;

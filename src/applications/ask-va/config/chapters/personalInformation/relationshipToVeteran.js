import React from 'react';
import { radioUI, radioSchema } from '../../schema-helpers/radioHelper';
import {
  CHAPTER_3,
  personalOptions,
  businessOptions,
} from '../../../constants';

const question = (
  <h4 className="vads-u-display--inline">{CHAPTER_3.PAGE_5.TITLE}</h4>
);

const personal = <strong>Personal relationship</strong>;

const business = <strong>Business relationship</strong>;

const relationshipToVeteranPage = {
  uiSchema: {
    'ui:description': question,
    personalRelationship: radioUI({
      title: personal,
      labels: personalOptions,
    }),
    businessRelationship: radioUI({
      title: business,
      labels: businessOptions,
    }),
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      personalRelationship: radioSchema(Object.keys(personalOptions)),
      businessRelationship: radioSchema(Object.keys(businessOptions)),
    },
  },
};

export default relationshipToVeteranPage;

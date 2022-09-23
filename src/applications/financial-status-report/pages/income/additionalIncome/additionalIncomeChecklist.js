import React from 'react';
import AdditionalIncomeCheckList from '../../../components/AdditionalIncomeCheckList';

export const uiSchema = {
  'ui:title': () => (
    <>
      <legend className="schemaform-block-title">Your other income</legend>
      <p className="vads-u-padding-top--neg2 vads-u-margin-bottom--3">
        Select any additional income you receive:
      </p>
    </>
  ),
  additionalIncome: {
    'ui:title': 'Your other income checklist',
    'ui:field': AdditionalIncomeCheckList,
  },
};

export const schema = {
  type: 'object',
  properties: {
    additionalIncome: {
      type: 'object',
      properties: {},
    },
  },
};

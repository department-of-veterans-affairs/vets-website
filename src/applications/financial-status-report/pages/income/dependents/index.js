import React from 'react';
import DependentExplainer from '../../../components/household/DependentExplainer';

export const uiSchemaEnhanced = {
  'ui:title': () => (
    <>
      <legend className="schemaform-block-title">
        <h3 className="vads-u-margin--0">Your dependents</h3>
      </legend>
    </>
  ),
  questions: {
    'ui:options': {
      hideOnReview: false, // change this to true to hide this question on review page
    },
    hasDependents: {
      'ui:title': 'Number of dependents',
    },
  },
  'view:components': {
    'view:dependentsAdditionalInfo': {
      'ui:description': DependentExplainer,
    },
  },
};

export const schemaEnhanced = {
  type: 'object',
  properties: {
    questions: {
      type: 'object',
      required: ['hasDependents'],
      properties: {
        hasDependents: {
          type: 'string',
        },
      },
    },
    'view:components': {
      type: 'object',
      properties: {
        'view:dependentsAdditionalInfo': {
          type: 'object',
          properties: {},
        },
      },
    },
  },
};

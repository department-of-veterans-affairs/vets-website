import React from 'react';
import Benefits from '../../components/debtsAndCopays/Benefits';
import EnhancedBenefits from '../../components/debtsAndCopays/EnhancedBenefits';

export const uiSchema = {
  'ui:title': 'Your VA benefits',
  'view:components': {
    'view:vaBenefitsOnFile': {
      'ui:field': Benefits,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:components': {
      type: 'object',
      properties: {
        'view:vaBenefitsOnFile': {
          type: 'object',
          properties: {},
        },
      },
    },
  },
};

export const enhancedUiSchema = {
  'ui:title': () => (
    <>
      <legend className="schemaform-block-title">
        <h3 className="vads-u-margin--0">Your VA benefits</h3>
      </legend>
    </>
  ),
  'view:components': {
    'view:vaBenefitsOnFile': {
      'ui:field': EnhancedBenefits,
    },
  },
};

export const enhancedSchema = {
  type: 'object',
  properties: {
    'view:components': {
      type: 'object',
      properties: {
        'view:vaBenefitsOnFile': {
          type: 'object',
          properties: {},
        },
      },
    },
  },
};

import React from 'react';
import DependentExplainer from '../../../components/household/DependentExplainer';
import { validateIsNumber } from '../../../utils/validations';

export const uiSchema = {
  'ui:title': 'Your dependents',
  questions: {
    hasDependents: {
      'ui:title': 'Number of dependents',
      'ui:description':
        'Dependents include your spouse, unmarried children under 18 years old, and other dependents.',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
      'ui:options': {
        classNames: 'no-wrap',
      },
      'ui:errorMessages': {
        required: 'Please enter your dependent(s) information.',
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    questions: {
      type: 'object',
      properties: {
        hasDependents: {
          type: 'boolean',
        },
      },
    },
  },
};

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
      'ui:description': (
        <p className="formfield-subtitle">
          Dependents include your spouse, unmarried children under 18 years old,
          and other dependents.
        </p>
      ),
      'ui:widget': 'TextWidget',
      'ui:required': () => true,
      'ui:errorMessages': {
        required: 'Please enter your dependent(s) information.',
      },
      'ui:validations': [validateIsNumber],
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
      required: ['hasDependents'],
      type: 'object',
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

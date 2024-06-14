import React from 'react';
import DependentAges from '../../../components/household/DependentAges';

export const uiSchemaEnhanced = {
  'ui:title': () => (
    <>
      <legend className="schemaform-block-title">
        <h3 className="vads-u-margin--0">Your dependents</h3>
      </legend>
      <p>Enter each dependent’s age separately.</p>
    </>
  ),
  personalData: {
    dependents: {
      'ui:field': DependentAges,
    },
  },
};

export const schemaEnhanced = {
  type: 'object',
  properties: {
    personalData: {
      type: 'object',
      properties: {
        dependents: {
          type: 'array',
          items: {
            type: 'object',
            required: ['dependentAge'],
            properties: {
              dependentAge: {
                type: 'string',
                pattern: '^\\d+$',
              },
            },
          },
        },
      },
    },
  },
};

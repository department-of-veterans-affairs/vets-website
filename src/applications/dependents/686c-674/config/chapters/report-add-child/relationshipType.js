import React from 'react';

import {
  titleUI,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const labels = {
  BIOLOGICAL: 'They’re my biological child',
  STEPCHILD: 'They’re my stepchild',
  ADOPTED: 'They’re my adopted child',
};

export const relationshipType = {
  uiSchema: {
    ...titleUI({
      title: ({ formData }) => (
        <h3 className="vads-u-margin-top--0">
          {`Your relationship to ${formData?.fullName?.first || 'this child'}`}
        </h3>
      ),
      description: (
        <>
          <strong>Note:</strong> You can’t add a grandchild as a dependent, even
          if you’re their legal guardian.
        </>
      ),
    }),
    relationshipType: radioUI({
      title: 'What’s your relationship to this child?',
      labels,
      required: () => true,
      errorMessages: {
        required: 'Select a relationship type',
      },
      updateSchema: (_formData, schema, _uiSchema, index, _path, fullData) => {
        const itemData = fullData?.childrenToAdd?.[index] || {};
        const isBiologicalChild = itemData.relationshipType === 'BIOLOGICAL';

        // Clear out stepchild fields if biological child is selected
        if (isBiologicalChild) {
          [
            'biologicalParentDob',
            'biologicalParentName',
            'biologicalParentSsn',
            'isBiologicalChildOfSpouse',
            'dateEnteredHousehold',
          ].forEach(field => {
            itemData[field] = undefined;
          });
        }

        // Update fields based on relationship type to match previous data
        // structure
        itemData.isBiologicalChild = isBiologicalChild;
        itemData.relationshipToChild = {
          stepchild: itemData.relationshipType === 'STEPCHILD',
          adopted: itemData.relationshipType === 'ADOPTED',
        };

        return schema;
      },
    }),
    'view:stepchildInfo': {
      'ui:description': (
        <>
          <p>
            Based on your answers, you’ll need to submit additional evidence to
            add this child as your dependent.
          </p>
          <p>We’ll ask you to submit this evidence at the end of this form.</p>
          <p>
            You’ll need to submit a copy of your child’s birth certificate. The
            birth certificate needs to show the names of both of the child’s
            biological parents.
          </p>
        </>
      ),
      'ui:options': {
        hideIf: formData => formData.relationshipType !== 'STEPCHILD',
      },
    },
    'view:adoptedChildInfo': {
      'ui:description': (
        <>
          <p>
            Based on your answers, you’ll need to submit additional evidence to
            add this child as your dependent.
          </p>
          <p>We’ll ask you to submit this evidence at the end of this form.</p>
          <p>You’ll need to submit a copy of 1 of these 4 documents:</p>
          <ul>
            <li>
              The final decree of adoption,
              <strong> or</strong>
            </li>
            <li>
              The adoptive placement agreement,
              <strong> or</strong>
            </li>
            <li>
              The interlocutory decree of adoptions,
              <strong> or</strong>
            </li>
            <li>The revised birth certificate</li>
          </ul>
        </>
      ),
      'ui:options': {
        hideIf: formData => formData.relationshipType !== 'ADOPTED',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['relationshipType'],
    properties: {
      relationshipType: radioSchema(Object.keys(labels)),
      'view:stepchildInfo': { type: 'object', properties: {} },
      'view:adoptedChildInfo': { type: 'object', properties: {} },
    },
  },
};

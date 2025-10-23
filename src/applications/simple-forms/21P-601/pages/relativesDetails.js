import React from 'react';
import {
  titleUI,
  fullNameUI,
  fullNameSchema,
  selectUI,
  selectSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  addressUI,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const relationshipOptions = {
  spouse: 'Spouse',
  child: 'Child',
  parent: 'Parent',
};

export default {
  uiSchema: {
    ...titleUI('List all surviving relatives'),
    'ui:description':
      'Provide information for each surviving relative. Each person must be listed separately.',
    survivingRelatives: {
      'ui:title': 'Surviving relatives',
      'ui:options': {
        itemName: 'Relative',
        viewField: ({ formData }) => {
          const name = formData.fullName
            ? `${formData.fullName.first || ''} ${formData.fullName.middle ||
                ''} ${formData.fullName.last || ''}`.trim()
            : 'Unknown';
          const relationship =
            relationshipOptions[formData.relationship] ||
            formData.relationship ||
            'Unknown';
          return (
            <div>
              <strong>{name}</strong>
              <br />
              {relationship}
              {formData.dateOfBirth && ` • Born: ${formData.dateOfBirth}`}
            </div>
          );
        },
        keepInPageOnReview: true,
        confirmRemove: true,
        useDlWrap: true,
        customTitle: ' ', // prevent <dl> around the schemaform-field-container (fixes a11y dl error)
        showSave: true,
        updateSchema: (formData, schema) => {
          // Only require if they have relatives
          if (formData.hasNone === true) {
            return {
              ...schema,
              minItems: 0,
            };
          }
          return schema;
        },
      },
      items: {
        fullName: fullNameUI(),
        relationship: selectUI('Relationship to deceased'),
        dateOfBirth: currentOrPastDateUI('Date of birth'),
        address: addressUI(),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      survivingRelatives: {
        type: 'array',
        minItems: 1,
        maxItems: 10,
        items: {
          type: 'object',
          required: ['fullName', 'relationship'],
          properties: {
            fullName: fullNameSchema,
            relationship: selectSchema(Object.keys(relationshipOptions)),
            dateOfBirth: currentOrPastDateSchema,
            address: addressSchema(),
          },
        },
      },
    },
  },
};

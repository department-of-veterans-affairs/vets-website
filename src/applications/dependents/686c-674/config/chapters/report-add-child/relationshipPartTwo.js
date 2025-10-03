import React from 'react';
import {
  titleUI,
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { scrollTo } from 'platform/utilities/scroll';

const CommonEvidenceInfo = (
  <>
    <p>
      Based on your answers, you’ll need to submit additional evidence to add
      this child as your dependent.
    </p>
    <p>We’ll ask you to submit this document at the end of this form.</p>
  </>
);

const AdoptedAdditionalEvidence = (
  <div>
    <p>You’ll need to submit a copy of 1 of these 4 documents:</p>
    <ul>
      <li>The final decree of adoption, or</li>
      <li>The adoptive placement agreement, or</li>
      <li>The interlocutory decree of adoptions, or</li>
      <li>The revised birth certificate</li>
    </ul>
  </div>
);

const StepchildAdditionalEvidence = (
  <div>
    <p>
      You’ll need to submit a copy of your child’s birth certificate. The birth
      certificate needs to show the names of both of the child’s biological
      parents.
    </p>
  </div>
);

export const relationshipPartTwo = {
  uiSchema: {
    ...titleUI({
      title: 'Your relationship to this child',
    }),
    relationshipToChild: {
      ...checkboxGroupUI({
        title: 'What’s your relationship to this child?',
        hint: 'Check all that apply',
        labels: {
          adopted: 'They’re my adopted child',
          stepchild: 'They’re my stepchild',
        },
        required: () => true,
        errorMessages: {
          required: 'Select at least one relationship.',
        },
      }),
      'ui:options': {
        classNames: 'relationship-checkbox-group',
        updateSchema: (formData, schema, _uiSchema, index) => {
          const rel = formData?.relationshipToChild || {};
          const shouldShowEvidence = rel.adopted || rel.stepchild;
          const itemData = formData?.childrenToAdd?.[index] || formData;

          if (!itemData?.relationshipToChild?.stepchild) {
            itemData.biologicalParentDob = undefined;
            itemData.biologicalParentName = undefined;
            itemData.biologicalParentSsn = undefined;
            itemData.isBiologicalChildOfSpouse = undefined;
            itemData.dateEnteredHousehold = undefined;
          }

          setTimeout(() => {
            if (shouldShowEvidence) {
              const el = document.querySelector('.relationship-checkbox-group');
              if (el) {
                const rect = el.getBoundingClientRect();
                if (rect.top < 0 || rect.bottom > window.innerHeight) {
                  scrollTo('.relationship-checkbox-group');
                }
              }
            }
          }, 0);

          return schema;
        },
      },
    },
    'view:commonEvidenceInfo': {
      'ui:description': CommonEvidenceInfo,
      'ui:options': {
        hideIf: (formData, index) => {
          const addMode = formData?.childrenToAdd?.[index]?.relationshipToChild;
          const editMode = formData?.relationshipToChild;

          if (!addMode && !editMode) return true;

          const isAdopted = addMode?.adopted || editMode?.adopted;
          const isStepchild = addMode?.stepchild || editMode?.stepchild;

          return !(isAdopted || isStepchild);
        },
      },
    },
    'view:stepchildAdditionalEvidenceDescription': {
      'ui:description': StepchildAdditionalEvidence,
      'ui:options': {
        hideIf: (formData, index) => {
          const addMode = formData?.childrenToAdd?.[index]?.relationshipToChild;
          const editMode = formData?.relationshipToChild;
          return !(addMode?.stepchild || editMode?.stepchild);
        },
      },
    },
    'view:adoptedAdditionalEvidenceDescription': {
      'ui:description': AdoptedAdditionalEvidence,
      'ui:options': {
        hideIf: (formData, index) => {
          const addMode = formData?.childrenToAdd?.[index]?.relationshipToChild;
          const editMode = formData?.relationshipToChild;
          return !(addMode?.adopted || editMode?.adopted);
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      relationshipToChild: checkboxGroupSchema(['adopted', 'stepchild']),
      'view:commonEvidenceInfo': {
        type: 'object',
        properties: {},
      },
      'view:stepchildAdditionalEvidenceDescription': {
        type: 'object',
        properties: {},
      },
      'view:adoptedAdditionalEvidenceDescription': {
        type: 'object',
        properties: {},
      },
    },
    required: ['relationshipToChild'],
  },
};

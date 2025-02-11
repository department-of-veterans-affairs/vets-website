import React from 'react';
import {
  titleUI,
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';

const CommonEvidenceInfo = (
  <>
    <p>
      Based on your answers, you’ll need to submit a copy of this child’s birth
      certificate to add them as your dependent.
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

export const relationship = {
  uiSchema: {
    ...titleUI({
      title: 'Your relationship to this child',
    }),
    relationshipToChild: checkboxGroupUI({
      title: 'What’s your relationship to this child?',
      'ui:description': 'Check all that apply',
      'ui:webComponentField': VaCheckboxField,
      labels: {
        biological: 'They’re my biological child',
        adopted: 'They’re my adopted child',
        stepchild: 'They’re my stepchild',
      },
      required: () => true,
      errorMessages: {
        required: 'Select at least one relationship.',
      },
    }),
    'view:commonEvidenceInfo': {
      'ui:description': CommonEvidenceInfo,
      'ui:options': {
        hideIf: (rawForm, rawIndex) => {
          const index = parseInt(rawIndex, 10);
          let form = rawForm;
          if (Number.isFinite(index)) {
            form = rawForm?.childrenToAdd?.[index];
          }
          return !(
            form?.relationshipToChild?.adopted ||
            form?.relationshipToChild?.stepchild
          );
        },
      },
    },
    'view:adoptedAdditionalEvidenceDescription': {
      'ui:description': AdoptedAdditionalEvidence,
      'ui:options': {
        hideIf: (rawForm, rawIndex) => {
          const index = parseInt(rawIndex, 10);
          let form = rawForm;
          if (Number.isFinite(index)) {
            form = rawForm?.childrenToAdd?.[index];
          }
          return !form?.relationshipToChild?.adopted;
        },
      },
    },
    'view:stepchildAdditionalEvidenceDescription': {
      'ui:description': StepchildAdditionalEvidence,
      'ui:options': {
        hideIf: (rawForm, rawIndex) => {
          const index = parseInt(rawIndex, 10);
          let form = rawForm;
          if (Number.isFinite(index)) {
            form = rawForm?.childrenToAdd?.[index];
          }
          return !form?.relationshipToChild?.stepchild;
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      relationshipToChild: checkboxGroupSchema([
        'biological',
        'adopted',
        'stepchild',
      ]),
      'view:commonEvidenceInfo': {
        type: 'object',
        properties: {},
      },
      'view:adoptedAdditionalEvidenceDescription': {
        type: 'object',
        properties: {},
      },
      'view:stepchildAdditionalEvidenceDescription': {
        type: 'object',
        properties: {},
      },
    },
  },
};

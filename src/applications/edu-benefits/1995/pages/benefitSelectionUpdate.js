import fullSchema from 'vets-json-schema/dist/22-1995-schema.json';
import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import React from 'react';
import { benefitsLabelsUpdate } from '../../utils/labels';
import { showRudisill1995 } from '../helpers';

const { benefitUpdate, benefitAppliedFor } = fullSchema.properties;

const displayBenefit = {
  ...benefitUpdate,
  enum: [...(benefitUpdate?.enum || [])],
};

const displayNewBenefit = {
  ...benefitAppliedFor,
  enum: [...(benefitAppliedFor?.enum || [])],
};

/*
  the schema has post9/11 listed as chapter33Post911
  and fry scholarship listed as chapter33FryScholarship
  In order to use the benefitsLabelsUpdate import we rename
  the benefits from chapter33Post911 to chapter33
  and chapter33FryScholarship to fryScholarship

  Once the applicant submits the form, the function
  fryScholarshipTransform() located in the
  submit-transform.js file runs.
  This changes back chapter33 to chapter33Post911
  and changes fryScholarship to chapter33FryScholarship
  to align with the values listed in the JSON Schema
*/
displayBenefit.enum.splice(0, 1, 'chapter33');
displayBenefit.enum.splice(1, 1, 'fryScholarship');
displayNewBenefit.enum.splice(0, 1, 'chapter33');
displayNewBenefit.enum.splice(1, 1, 'fryScholarship');

const changeAnotherBenefitDescription = (
  <p className="vads-u-color--gray-medium">
    Note: if you select yes, this change will be applied with your next
    enrollment certification if you are eligible for the benefit selected.
  </p>
);

export const uiSchema = {
  benefitUpdate: {
    'ui:widget': 'radio',
    'ui:title': 'Which benefit have you most recently used?',
    'ui:options': {
      labels: benefitsLabelsUpdate,
    },
  },
  ...(showRudisill1995()
    ? {
        rudisillReview: {
          ...radioUI({
            title: 'Do you wish to request a Rudisill review?',
            required: () => true,
          }),
        },
      }
    : {
        changeAnotherBenefit: {
          ...radioUI({
            title: 'Do you want to change to another benefit?',
            description: changeAnotherBenefitDescription,
          }),
        },
        benefitAppliedFor: {
          'ui:title': 'Which benefit do you want to change to?',
          'ui:widget': 'radio',
          'ui:required': formData => formData.changeAnotherBenefit === 'Yes',
          'ui:options': {
            labels: benefitsLabelsUpdate,
            hideIf: formData => formData.changeAnotherBenefit !== 'Yes',
          },
        },
      }),
};

export const schema = {
  type: 'object',
  required: showRudisill1995()
    ? ['benefitUpdate', 'rudisillReview']
    : ['benefitUpdate'],
  properties: {
    benefitUpdate: displayBenefit,
    ...(!showRudisill1995()
      ? {
          changeAnotherBenefit: radioSchema(['Yes', 'No']),
          benefitAppliedFor: displayNewBenefit,
        }
      : {
          rudisillReview: radioSchema(['Yes', 'No']),
        }),
  },
};

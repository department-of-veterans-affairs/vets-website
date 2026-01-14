import fullSchema from 'vets-json-schema/dist/22-1995-schema.json';
import React from 'react';
import { benefitsLabelsUpdate } from '../../utils/labels';
import BenefitReviewField from '../components/BenefitReviewField';

const { changeAnotherBenefit, benefitAppliedFor } = fullSchema.properties;

const displayNewBenefit = {
  ...benefitAppliedFor,
  enum: [...(benefitAppliedFor?.enum || [])],
};
const changeAnotherBenefitDescription = (
  <p className="vads-u-color--gray-medium">
    Note: if you select yes, this change will be applied with your next
    enrollment certification if you are eligible for the benefit selected.
  </p>
);
displayNewBenefit.enum.splice(0, 1, 'chapter33');
displayNewBenefit.enum.splice(1, 1, 'fryScholarship');
export const uiSchema = {
  changeAnotherBenefit: {
    'ui:title': 'Do you want to change to another benefit?',
    'ui:description': changeAnotherBenefitDescription,
    'ui:widget': 'radio',
  },
  benefitAppliedFor: {
    'ui:widget': 'radio',
    'ui:title': 'Which benefit do you want to change to?',
    'ui:reviewField': BenefitReviewField,
    'ui:required': formData => formData.changeAnotherBenefit === 'Yes',
    'ui:options': {
      labels: benefitsLabelsUpdate,
      hideIf: formData => formData.changeAnotherBenefit !== 'Yes',
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    changeAnotherBenefit,
    benefitAppliedFor: displayNewBenefit,
  },
};

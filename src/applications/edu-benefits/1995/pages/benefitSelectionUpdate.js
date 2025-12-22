import fullSchema from 'vets-json-schema/dist/22-1995-schema.json';
import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { benefitsLabelsUpdate } from '../../utils/labels';
import BenefitReviewField from '../components/BenefitReviewField';

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

export const uiSchema = {
  benefitUpdate: {
    'ui:widget': 'radio',
    'ui:title': 'Which benefit have you most recently used?',
    'ui:reviewField': BenefitReviewField,
    'ui:options': {
      labels: benefitsLabelsUpdate,
    },
  },
  rudisillReview: {
    ...radioUI({
      title: 'Do you wish to request a Rudisill review?',
      required: () => true,
    }),
    'ui:onChange': (value, oldValue, formData, onChange) => {
      // Clear changeAnotherBenefit page data and sponsor information when rudisillReview changes to Yes
      if (value === 'Yes' && oldValue !== 'Yes') {
        onChange({
          ...formData,
          rudisillReview: value,
          changeAnotherBenefit: undefined,
          benefitAppliedFor: undefined,
          sponsorFullName: undefined,
          sponsorSocialSecurityNumber: undefined,
          vaFileNumber: undefined,
          'view:noSSN': undefined,
        });
      }
    },
  },
};

export const schema = {
  type: 'object',
  required: ['benefitUpdate', 'rudisillReview'],
  properties: {
    benefitUpdate: displayBenefit,
    rudisillReview: radioSchema(['Yes', 'No']),
  },
};

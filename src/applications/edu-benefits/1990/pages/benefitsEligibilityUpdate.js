import { benefitsLabels } from '../../utils/labels';

export const benefitsEligibilityUpdate = benefitsEligibilityBox => {
  const uiSchema = {
    'ui:description': benefitsEligibilityBox,
    'view:selectedBenefits': {
      'ui:title': 'Select the benefit that is the best match for you.',
      'ui:errorMessages': {
        atLeastOne: 'You must select a benefit',
      },
      'ui:options': {
        showFieldLabel: true,
      },
      chapter33: {
        'ui:widget': 'radio',
        'ui:required': formData => !formData.chapter33,
        'ui:options': {
          labels: benefitsLabels,
          hideLabelText: true,
        },
        'ui:errorMessages': {
          required: 'You must select a benefit',
        },
      },
    },
  };
  const schema = {
    type: 'object',
    required: ['view:selectedBenefits'],
    properties: {
      'view:selectedBenefits': {
        type: 'object',
        properties: {
          chapter33: {
            type: 'string',
            enum: ['chapter33', 'chapter30', 'chapter1606'],
          },
          'view:chapter33ExpandedContent': {
            type: 'object',
            properties: {},
          },
        },
      },
    },
  };
  return {
    uiSchema,
    schema,
  };
};

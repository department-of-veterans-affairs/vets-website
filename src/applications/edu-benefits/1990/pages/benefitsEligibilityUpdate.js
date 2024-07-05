import { isProductionOfTestProdEnv } from '../helpers';
import { benefitsLabels } from '../../utils/labels';

export const benefitsEligibilityUpdate = (
  benefitsEligibilityBox,
  validateBooleanGroup,
  chapter33,
  chapter30,
  chapter1606,
) => {
  const uiSchema = isProductionOfTestProdEnv()
    ? {
        'ui:description': benefitsEligibilityBox,
        'view:selectedBenefits': {
          'ui:title': 'Select the benefit that is the best match for you.',
          'ui:validations': [validateBooleanGroup],
          'ui:errorMessages': {
            atLeastOne: 'Please select at least one benefit',
          },
          'ui:options': {
            showFieldLabel: true,
          },
          chapter33: {
            'ui:title': benefitsLabels.chapter33,
            'ui:options': {
              expandUnderClassNames: 'schemaform-expandUnder-indent',
            },
          },
          'view:chapter33ExpandedContent': {
            'ui:description': benefitsLabels.chapter33Description,
            'ui:options': {
              expandUnder: 'chapter33',
            },
          },
          chapter30: {
            'ui:title': benefitsLabels.chapter30,
          },
          chapter1606: {
            'ui:title': benefitsLabels.chapter1606,
          },
        },
      }
    : {
        'ui:description': benefitsEligibilityBox,
        'view:selectedBenefits': {
          'ui:title': 'Select the benefit that is the best match for you.',
          'ui:errorMessages': {
            atLeastOne: 'Please select at least one benefit',
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
              nestedContent: {
                chapter33: benefitsLabels.chapter33Description,
              },
            },
            'ui:errorMessages': {
              required: 'Please select at least one benefit',
            },
          },
        },
      };
  const schema = isProductionOfTestProdEnv()
    ? {
        type: 'object',
        required: ['view:selectedBenefits'],
        properties: {
          'view:selectedBenefits': {
            type: 'object',
            properties: {
              chapter33,
              'view:chapter33ExpandedContent': {
                type: 'object',
                properties: {},
              },
              chapter30,
              chapter1606,
            },
          },
        },
      }
    : {
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

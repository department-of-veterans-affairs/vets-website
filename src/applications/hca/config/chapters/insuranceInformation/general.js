import merge from 'lodash/merge';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';

import CustomYesNoReviewField from '../../../components/FormReview/CustomYesNoReviewField';
import CustomReviewField from '../../../components/FormReview/CustomReviewField';
import InsuranceProviderViewField from '../../../components/FormFields/InsuranceProviderViewField';
import {
  GroupCodeDescription,
  HealthInsuranceDescription,
  HealthInsuranceCoverageDescription,
  PolicyNumberDescription,
  PolicyOrDescription,
  PolicyOrGroupDescription,
  TricarePolicyDescription,
} from '../../../components/FormDescriptions';
import ShortFormAlert from '../../../components/FormAlerts/ShortFormAlert';
import {
  getInsuranceAriaLabel,
  isShortFormEligible,
} from '../../../utils/helpers';
import { emptyObjectSchema } from '../../../definitions';

const { providers, isCoveredByHealthInsurance } = fullSchemaHca.properties;
const { items: provider } = providers;

export default {
  uiSchema: {
    'view:generalShortFormMessage': {
      'ui:description': ShortFormAlert,
      'ui:options': {
        hideIf: formData => !isShortFormEligible(formData),
      },
    },
    'view:healthInsuranceDescription': {
      'ui:description': HealthInsuranceDescription,
    },
    isCoveredByHealthInsurance: {
      'ui:title': 'Do you have health insurance coverage?',
      'ui:description': HealthInsuranceCoverageDescription,
      'ui:reviewField': CustomYesNoReviewField,
      'ui:widget': 'yesNo',
    },
    providers: {
      'ui:options': {
        expandUnder: 'isCoveredByHealthInsurance',
        itemName: 'insurance policy',
        hideTitle: true,
        viewField: InsuranceProviderViewField,
        itemAriaLabel: formData => getInsuranceAriaLabel(formData),
      },
      'ui:errorMessages': {
        minItems: 'You need to at least one provider.',
      },
      items: {
        'ui:options': {
          itemAriaLabel: formData => getInsuranceAriaLabel(formData),
        },
        insuranceName: {
          'ui:title': 'Name of insurance provider',
        },
        insurancePolicyHolderName: {
          'ui:title':
            'Name of policyholder (the person whose name the policy is in)',
        },
        'view:policyOrGroupDesc': {
          'ui:description': PolicyOrGroupDescription,
        },
        'view:hasTricare': {
          'ui:description': TricarePolicyDescription,
        },
        insurancePolicyNumber: {
          'ui:title': 'Policy Number',
          'ui:description': PolicyNumberDescription,
          'ui:reviewField': CustomReviewField,
        },
        'view:or': {
          'ui:description': PolicyOrDescription,
        },
        insuranceGroupCode: {
          'ui:title': 'Group Code',
          'ui:description': GroupCodeDescription,
          'ui:reviewField': CustomReviewField,
        },
        'ui:validations': [
          (errors, field) => {
            if (!field.insurancePolicyNumber && !field.insuranceGroupCode) {
              errors.insuranceGroupCode.addError(
                'Group code (either this or the policy number is required)',
              );
              errors.insurancePolicyNumber.addError(
                'Policy number (either this or the group code is required)',
              );
            }
          },
        ],
        'ui:order': [
          'insuranceName',
          'insurancePolicyHolderName',
          'view:policyOrGroupDesc',
          'view:hasTricare',
          'insurancePolicyNumber',
          'view:or',
          'insuranceGroupCode',
        ],
      },
    },
  },
  schema: {
    type: 'object',
    required: ['isCoveredByHealthInsurance'],
    properties: {
      'view:generalShortFormMessage': emptyObjectSchema,
      'view:healthInsuranceDescription': emptyObjectSchema,
      isCoveredByHealthInsurance,
      providers: {
        type: 'array',
        minItems: 1,
        items: merge({}, provider, {
          required: ['insuranceName', 'insurancePolicyHolderName'],
          properties: {
            'view:policyOrGroupDesc': emptyObjectSchema,
            'view:hasTricare': emptyObjectSchema,
            'view:or': emptyObjectSchema,
          },
        }),
      },
    },
  },
};

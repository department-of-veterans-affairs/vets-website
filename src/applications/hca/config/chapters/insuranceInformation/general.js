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
import { validatePolicyNumber } from '../../../utils/validation';
import { getInsuranceAriaLabel } from '../../../utils/helpers';
import { notShortFormEligible } from '../../../utils/helpers/form-config';
import { emptyObjectSchema } from '../../../definitions';

const { providers, isCoveredByHealthInsurance } = fullSchemaHca.properties;
const { items: provider } = providers;

export default {
  uiSchema: {
    'view:generalShortFormMessage': {
      'ui:description': ShortFormAlert,
      'ui:options': {
        hideIf: notShortFormEligible,
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
        itemAriaLabel: getInsuranceAriaLabel,
      },
      'ui:errorMessages': {
        minItems: 'You need to at least one provider.',
      },
      items: {
        'ui:options': {
          itemAriaLabel: getInsuranceAriaLabel,
        },
        insuranceName: {
          'ui:title': 'Name of insurance provider',
          'ui:errorMessages': {
            pattern: 'Enter the insurance provider name',
          },
        },
        insurancePolicyHolderName: {
          'ui:title':
            'Name of policyholder (the person whose name the policy is in)',
          'ui:errorMessages': {
            pattern: 'Enter the policyholder\u2019s name',
          },
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
          'ui:errorMessages': {
            pattern: 'Enter a valid policy number',
          },
        },
        'view:or': {
          'ui:description': PolicyOrDescription,
        },
        insuranceGroupCode: {
          'ui:title': 'Group Code',
          'ui:description': GroupCodeDescription,
          'ui:reviewField': CustomReviewField,
          'ui:errorMessages': {
            pattern: 'Enter a valid group code',
          },
        },
        'ui:validations': [validatePolicyNumber],
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

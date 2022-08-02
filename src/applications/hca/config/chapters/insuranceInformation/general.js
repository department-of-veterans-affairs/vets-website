import merge from 'lodash/merge';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';

import InsuranceProviderView from '../../../components/InsuranceProviderView';
import {
  GroupCodeDescription,
  HealthInsuranceDescription,
  HealthInsuranceCoverageDescription,
  PolicyNumberDescription,
  PolicyOrDescription,
  PolicyOrGroupDescription,
  TricarePolicyDescription,
} from '../../../components/FormDescriptions';
import { ShortFormAlert } from '../../../components/FormAlerts';
import { HIGH_DISABILITY, emptyObjectSchema } from '../../../helpers';

const { provider } = fullSchemaHca.definitions;
const { isCoveredByHealthInsurance } = fullSchemaHca.properties;

const ariaLabelfunc = data => {
  const INSURANCE_TITLE = `${data.insuranceName} ${data.insurancePolicyNumber ??
    data.insuranceGroupCode}`;
  return data.insuranceName ? INSURANCE_TITLE : 'insurance policy';
};

export default {
  uiSchema: {
    'view:generalShortFormMessage': {
      'ui:description': ShortFormAlert,
      'ui:options': {
        hideIf: form =>
          !form['view:hcaShortFormEnabled'] ||
          (form.vaCompensationType !== 'highDisability' &&
            !(
              form['view:totalDisabilityRating'] &&
              form['view:totalDisabilityRating'] >= HIGH_DISABILITY
            )),
      },
    },
    'view:healthInsuranceDescription': {
      'ui:description': HealthInsuranceDescription,
    },
    isCoveredByHealthInsurance: {
      'ui:title': 'Do you have health insurance coverage?',
      'ui:description': HealthInsuranceCoverageDescription,
      'ui:widget': 'yesNo',
    },
    providers: {
      'ui:options': {
        expandUnder: 'isCoveredByHealthInsurance',
        itemName: 'insurance policy',
        hideTitle: true,
        viewField: InsuranceProviderView,
        itemAriaLabel: ariaLabelfunc,
      },
      'ui:errorMessages': {
        minItems: 'You need to at least one provider.',
      },
      items: {
        'ui:options': {
          itemAriaLabel: ariaLabelfunc,
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
          'ui:title': PolicyNumberDescription,
        },
        'view:or': {
          'ui:description': PolicyOrDescription,
        },
        insuranceGroupCode: {
          'ui:title': GroupCodeDescription,
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

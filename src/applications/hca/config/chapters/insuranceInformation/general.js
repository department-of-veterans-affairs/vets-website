import { merge, get } from 'lodash/fp';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';

import InsuranceProviderView from '../../../components/InsuranceProviderView';

const { provider } = fullSchemaHca.definitions;
const { isCoveredByHealthInsurance } = fullSchemaHca.properties;

export default {
  uiSchema: {
    'ui:title': 'Other coverage',
    isCoveredByHealthInsurance: {
      'ui:title':
        'Are you covered by health insurance? (Including coverage through a spouse or another person)',
      'ui:widget': 'yesNo',
    },
    providers: {
      'ui:options': {
        itemName: 'Insurance Policy',
        expandUnder: 'isCoveredByHealthInsurance',
        viewField: InsuranceProviderView,
      },
      'ui:errorMessages': {
        minItems: 'You need to at least one provider.',
      },
      items: {
        insuranceName: {
          'ui:title': 'Name of provider',
        },
        insurancePolicyHolderName: {
          'ui:title': 'Name of policyholder',
        },
        insurancePolicyNumber: {
          'ui:title':
            'Policy number (either this or the group code is required)',
          'ui:required': (formData, index) =>
            !get(`providers[${index}].insuranceGroupCode`, formData),
          'ui:errorMessages': {
            pattern: 'Please provide a valid policy number.',
          },
        },
        insuranceGroupCode: {
          'ui:title': 'Group code (either this or policy number is required)',
          'ui:required': (formData, index) =>
            !get(`providers[${index}].insurancePolicyNumber`, formData),
          'ui:errorMessages': {
            pattern: 'Please provide a valid group code.',
          },
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['isCoveredByHealthInsurance'],
    properties: {
      isCoveredByHealthInsurance,
      providers: {
        type: 'array',
        minItems: 1,
        items: merge(provider, {
          required: [
            'insuranceName',
            'insurancePolicyHolderName',
            'insurancePolicyNumber',
            'insuranceGroupCode',
          ],
        }),
      },
    },
  },
};

import _ from 'platform/utilities/data';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';
import { validateDate } from 'platform/forms-system/src/js/validation';
import {
  recordReleaseDescription,
  limitedConsentTitle,
  limitedConsentTextTitle,
  limitedConsentDescription,
} from '../content/privateMedicalRecordsRelease';

import PrivateProviderTreatmentView from '../components/PrivateProviderTreatmentView';

import { validateZIP } from '../validations';

const { form4142 } = fullSchema.properties;

const {
  providerFacilityName,
  providerFacilityAddress,
} = form4142.properties.providerFacility.items.properties;
const { limitedConsent } = form4142.properties;

export const uiSchema = {
  'ui:description': recordReleaseDescription,
  'view:limitedConsent': {
    'ui:title': limitedConsentTitle,
  },
  limitedConsent: {
    'ui:title': limitedConsentTextTitle,
    'ui:options': {
      expandUnder: 'view:limitedConsent',
      expandUnderCondition: true,
    },
    'ui:required': formData => _.get('view:limitedConsent', formData, false),
  },
  'view:privateRecordsChoiceHelp': {
    'ui:description': limitedConsentDescription,
  },
  providerFacility: {
    'ui:options': {
      itemName: 'Provider Facility',
      viewField: PrivateProviderTreatmentView,
      hideTitle: true,
    },
    items: {
      providerFacilityName: {
        'ui:title': 'Name of private provider or hospital',
      },
      'ui:validations': [validateDate],
      treatmentDateRange: dateRangeUI(
        'First treatment date (you can provide an estimated date)',
        'Last treatment date (you can provide an estimated date)',
        'End of treatment must be after start of treatment',
      ),
      providerFacilityAddress: {
        'ui:order': [
          'country',
          'street',
          'street2',
          'city',
          'state',
          'postalCode',
        ],
        country: {
          'ui:title': 'Country',
          'ui:autocomplete': 'off',
        },
        street: {
          'ui:title': 'Street',
          'ui:autocomplete': 'off',
        },
        street2: {
          'ui:title': 'Street 2',
          'ui:autocomplete': 'off',
        },
        city: {
          'ui:title': 'City',
          'ui:autocomplete': 'off',
        },
        state: {
          'ui:title': 'State',
          'ui:autocomplete': 'off',
        },
        postalCode: {
          'ui:title': 'Postal code',
          'ui:autocomplete': 'off',
          'ui:validations': [validateZIP],
          'ui:errorMessages': {
            pattern:
              'Please enter a valid 5- or 9-digit Postal code (dashes allowed)',
          },
          'ui:options': {
            widgetClassNames: 'usa-input-medium',
          },
        },
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    providerFacility: {
      type: 'array',
      minItems: 1,
      maxItems: 100,
      items: {
        type: 'object',
        required: [
          'providerFacilityName',
          'treatmentDateRange',
          'providerFacilityAddress',
        ],
        properties: {
          providerFacilityName,
          treatmentDateRange: {
            type: 'object',
            $ref: '#/definitions/dateRangeAllRequired',
          },
          providerFacilityAddress,
        },
      },
    },
    'view:limitedConsent': {
      type: 'boolean',
    },
    limitedConsent,
    'view:privateRecordsChoiceHelp': {
      type: 'object',
      properties: {},
    },
  },
};

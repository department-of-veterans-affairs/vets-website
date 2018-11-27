import _ from '../../../../platform/utilities/data';
import fullSchema from '../config/schema';
import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';
import {
  recordReleaseDescription,
  limitedConsentTitle,
  limitedConsentTextTitle,
  limitedConsentDescription,
} from '../content/privateMedicalRecordsRelease';

import PrivateProviderTreatmentView from '../components/PrivateProviderTreatmentView';
import { validateDate } from 'us-forms-system/lib/js/validation';

const { form4142 } = fullSchema.definitions;

const providerFacilities = form4142.properties.providerFacility;
const limitedConsent = form4142.properties.limitedConsent;

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
    'ui:required': (formData, index) =>
      _.get(`disabilities.${index}.view:limitedConsent`, formData),
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
        'Approximate date of first treatment',
        'Approximate date of last treatment',
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
        },
        street: {
          'ui:title': 'Street',
        },
        street2: {
          'ui:title': 'Street 2',
        },
        city: {
          'ui:title': 'City',
        },
        state: {
          'ui:title': 'State',
        },
        postalCode: {
          'ui:title': 'Postal Code',
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
    providerFacility: providerFacilities,
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

import _ from 'platform/utilities/data';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';
import {
  validateDate,
  validateBooleanGroup,
} from 'platform/forms-system/src/js/validation';
import { yesNoUI } from 'platform/forms-system/src/js/web-component-patterns';
import {
  recordReleaseDescription,
  limitedConsentTitle,
  limitedConsentTextTitle,
  limitedConsentDescription,
} from '../content/privateMedicalRecordsRelease';
import { isCompletingForm0781 } from '../utils/form0781';
import { standardTitle } from '../content/form0781';
// import { makeSchemaForAllDisabilities } from '../utils/schemas';
import { isCompletingModern4142 } from '../utils';

import PrivateProviderTreatmentView from '../components/PrivateProviderTreatmentView';
import TreatedDisabilitiesCheckboxGroup from '../../components/TreatedDisabilitiesCheckboxGroup';

import { validateZIP } from '../validations';

const { form4142 } = fullSchema.properties;

const {
  providerFacilityName,
  providerFacilityAddress,
} = form4142.properties.providerFacility.items.properties;
const { limitedConsent } = form4142.properties;

export const uiSchema = {
  'ui:title': standardTitle('Request medical records from private providers'),
  'ui:description': recordReleaseDescription,
  'view:limitedConsent': {
    'ui:webComponentField': VaCheckboxField,
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
      itemName: 'Provider or hospital',
      viewField: PrivateProviderTreatmentView,
      hideTitle: true,
      reviewMode: true,
    },
    items: {
      'ui:errorMessages': {
        required: 'Please complete all required fields for this provider',
      },
      providerFacilityName: {
        'ui:title': 'Name of private provider or hospital',
        'ui:errorMessages': {
          required: 'Please enter the name of the provider or hospital',
        },
      },
      treatmentLocation0781Related: {
        ...yesNoUI({
          title:
            'Did you receive treatment at this facility related to the impact of any of your traumatic events?',
        }),
        'ui:options': {
          hideIf: formData => !isCompletingForm0781(formData),
        },
        'ui:required': formData => isCompletingForm0781(formData),
        'ui:errorMessages': {
          required:
            'Please indicate if you received treatment at this facility related to your traumatic events',
        },
      },
      treatedDisabilityNames: {
        'ui:title': 'What conditions were you treated for?',
        'ui:field': TreatedDisabilitiesCheckboxGroup,
        'ui:options': {
          // {
          // updateSchema: makeSchemaForAllDisabilities,
          itemAriaLabel: data => data.treatmentCenterName,
          showFieldLabel: true,
          hideIf: formData => !isCompletingModern4142(formData),
        },
        'ui:validations': [validateBooleanGroup],
        'ui:errorMessages': {
          atLeastOne: 'Please select at least one condition for this provider',
          required: 'Please select at least one condition',
        },
        'ui:required': formData => isCompletingModern4142(formData),
      },
      'ui:validations': [validateDate],
      treatmentDateRange: {
        ...dateRangeUI(
          'When did your treatment start? (You can provide an estimated date)',
          'When did your treatment end? (You can provide an estimated date)',
          'End of treatment must be after start of treatment',
        ),
        'ui:errorMessages': {
          required: 'Please provide treatment dates',
        },
      },
      providerFacilityAddress: {
        'ui:title': 'Address of provider or hospital',
        'ui:order': [
          'country',
          'street',
          'street2',
          'city',
          'state',
          'postalCode',
        ],
        'ui:errorMessages': {
          required: 'Please enter the address',
        },
        country: {
          'ui:title': 'Country',
          'ui:autocomplete': 'off',
          'ui:errorMessages': {
            required: 'Please select a country',
          },
        },
        street: {
          'ui:title': 'Street',
          'ui:autocomplete': 'off',
          'ui:errorMessages': {
            required: 'Please enter a street address',
          },
        },
        street2: {
          'ui:title': 'Street 2',
          'ui:autocomplete': 'off',
        },
        city: {
          'ui:title': 'City',
          'ui:autocomplete': 'off',
          'ui:errorMessages': {
            required: 'Please enter a city',
          },
        },
        state: {
          'ui:title': 'State',
          'ui:autocomplete': 'off',
          'ui:errorMessages': {
            required: 'Please select a state',
          },
        },
        postalCode: {
          'ui:title': 'Postal code',
          'ui:autocomplete': 'off',
          'ui:validations': [validateZIP],
          'ui:errorMessages': {
            pattern:
              'Please enter a valid 5- or 9-digit Postal code (dashes allowed)',
            required: 'Please enter a postal code',
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
          'treatmentLocation0781Related',
          'treatedDisabilityNames',
        ],
        properties: {
          providerFacilityName,
          treatmentLocation0781Related: {
            type: 'boolean',
            properties: {},
          },
          treatedDisabilityNames: {
            type: 'object',
            properties: {},
          },
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

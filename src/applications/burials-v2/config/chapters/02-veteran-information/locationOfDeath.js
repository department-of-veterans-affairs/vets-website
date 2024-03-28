import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
import get from '@department-of-veterans-affairs/platform-forms-system/get';
import { radioUI } from 'platform/forms-system/src/js/web-component-patterns';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import { generateTitle } from '../../../utils/helpers';
import { locationOfDeathLabels } from '../../../utils/labels';

const { locationOfDeath } = fullSchemaBurials.properties;

export default {
  uiSchema: {
    'ui:title': generateTitle('Veteran death location'),
    locationOfDeath: {
      location: {
        ...radioUI({
          title: `Where did the Veteran’s death occur?`,
          labels: locationOfDeathLabels,
          errorMessages: {
            required: `Select where the Veteran’s death happened`,
          },
          labelHeaderLevel: '',
        }),
      },
      nursingHomeUnpaid: {
        facilityName: {
          'ui:title':
            'Name of the facility or nursing home that VA doesn’t pay for',
          'ui:required': form =>
            get('locationOfDeath.location', form) === 'nursingHomeUnpaid' &&
            !form.facilityName,
          'ui:errorMessages': {
            required:
              'Enter the name of the facility or nursing home that VA doesn’t pay for',
          },
          'ui:webComponentField': VaTextInputField,
        },
        facilityLocation: {
          'ui:title':
            'City and state of the facility or nursing home that VA doesn’t pay for',
          'ui:required': form =>
            get('locationOfDeath.location', form) === 'nursingHomeUnpaid' &&
            !form.facilityLocation,
          'ui:errorMessages': {
            required:
              'Enter the city and state of the facility or nursing home that VA doesn’t pay for',
          },
          'ui:webComponentField': VaTextInputField,
        },
        'ui:options': {
          hideIf: form =>
            get('locationOfDeath.location', form) !== 'nursingHomeUnpaid',
        },
      },
      nursingHomePaid: {
        facilityName: {
          'ui:title': 'Name of the facility or nursing home that VA pays for',
          'ui:required': form =>
            get('locationOfDeath.location', form) === 'nursingHomePaid' &&
            !form.facilityName,
          'ui:errorMessages': {
            required:
              'Enter the name of the facility or nursing home that VA pays for',
          },
          'ui:webComponentField': VaTextInputField,
        },
        facilityLocation: {
          'ui:title':
            'City and state of the facility or nursing home that VA pays for',
          'ui:required': form =>
            get('locationOfDeath.location', form) === 'nursingHomePaid' &&
            !form.facilityLocation,
          'ui:errorMessages': {
            required:
              'Enter the city and state of the facility or nursing home that VA pays for',
          },
          'ui:webComponentField': VaTextInputField,
        },
        'ui:options': {
          hideIf: form =>
            get('locationOfDeath.location', form) !== 'nursingHomePaid',
        },
      },
      vaMedicalCenter: {
        facilityName: {
          'ui:title': 'Name of the VA medical center',
          'ui:required': form =>
            get('locationOfDeath.location', form) === 'vaMedicalCenter' &&
            !form.facilityName,
          'ui:errorMessages': {
            required: 'Enter the Name of the VA medical center',
          },
          'ui:webComponentField': VaTextInputField,
        },
        facilityLocation: {
          'ui:title': 'City and state of the VA medical center',
          'ui:required': form =>
            get('locationOfDeath.location', form) === 'vaMedicalCenter' &&
            !form.facilityLocation,
          'ui:errorMessages': {
            required: 'Enter the city and state of the VA medical center',
          },
          'ui:webComponentField': VaTextInputField,
        },
        'ui:options': {
          hideIf: form =>
            get('locationOfDeath.location', form) !== 'vaMedicalCenter',
        },
      },
      stateVeteransHome: {
        facilityName: {
          'ui:title': 'Name of the state Veterans facility',
          'ui:required': form =>
            get('locationOfDeath.location', form) === 'stateVeteransHome' &&
            !form.facilityName,
          'ui:errorMessages': {
            required: 'Enter the name of the state Veterans facility',
          },
          'ui:webComponentField': VaTextInputField,
        },
        facilityLocation: {
          'ui:title': 'City and state of the state Veterans facility',
          'ui:required': form =>
            get('locationOfDeath.location', form) === 'stateVeteransHome' &&
            !form.facilityLocation,
          'ui:errorMessages': {
            required: 'Enter the city and state of the state Veterans facility',
          },
          'ui:webComponentField': VaTextInputField,
        },
        'ui:options': {
          hideIf: form =>
            get('locationOfDeath.location', form) !== 'stateVeteransHome',
        },
      },
      other: {
        'ui:title': 'Place where the Veteran’s death happened',
        'ui:errorMessages': {
          required: 'Enter where the Veteran’s death happened',
        },
        'ui:required': form =>
          get('locationOfDeath.location', form) === 'other',
        'ui:options': {
          hideIf: form => get('locationOfDeath.location', form) !== 'other',
          classNames: 'vads-u-margin-top--2',
        },
        'ui:webComponentField': VaTextInputField,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['locationOfDeath'],
    properties: {
      locationOfDeath,
    },
  },
};

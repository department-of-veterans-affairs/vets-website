import fullSchemaBurials from 'vets-json-schema/dist/21P-530EZ-schema.json';
import get from '@department-of-veterans-affairs/platform-forms-system/get';
import {
  radioUI,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { generateTitle } from '../../../utils/helpers';
import { locationOfDeathLabels } from '../../../utils/labels';

const { locationOfDeath } = fullSchemaBurials.properties;

export default {
  uiSchema: {
    'ui:title': generateTitle('Veteran death location'),
    locationOfDeath: {
      location: radioUI({
        title: `Where did the Veteran’s death occur?`,
        labels: locationOfDeathLabels,
        errorMessages: {
          required: `Select where the Veteran’s death happened`,
        },
        labelHeaderLevel: '',
      }),
      nursingHomeUnpaid: {
        facilityName: textUI({
          title: 'Name of the facility or nursing home that VA doesn’t pay for',
          required: form =>
            get('locationOfDeath.location', form) === 'nursingHomeUnpaid' &&
            !form.facilityName,
          errorMessages: {
            required:
              'Enter the name of the facility or nursing home that VA doesn’t pay for',
          },
        }),
        facilityLocation: textUI({
          title:
            'City and state of the facility or nursing home that VA doesn’t pay for',
          required: form =>
            get('locationOfDeath.location', form) === 'nursingHomeUnpaid' &&
            !form.facilityLocation,
          errorMessages: {
            required:
              'Enter the city and state of the facility or nursing home that VA doesn’t pay for',
          },
        }),
        'ui:options': {
          hideIf: form =>
            get('locationOfDeath.location', form) !== 'nursingHomeUnpaid',
        },
      },
      nursingHomePaid: {
        facilityName: textUI({
          title: 'Name of the facility or nursing home that VA pays for',
          required: form =>
            get('locationOfDeath.location', form) === 'nursingHomePaid' &&
            !form.facilityName,
          errorMessages: {
            required:
              'Enter the name of the facility or nursing home that VA pays for',
          },
        }),
        facilityLocation: textUI({
          title:
            'City and state of the facility or nursing home that VA pays for',
          required: form =>
            get('locationOfDeath.location', form) === 'nursingHomePaid' &&
            !form.facilityLocation,
          errorMessages: {
            required:
              'Enter the city and state of the facility or nursing home that VA pays for',
          },
        }),
        'ui:options': {
          hideIf: form =>
            get('locationOfDeath.location', form) !== 'nursingHomePaid',
        },
      },
      vaMedicalCenter: {
        facilityName: textUI({
          title: 'Name of the VA medical center',
          required: form =>
            get('locationOfDeath.location', form) === 'vaMedicalCenter' &&
            !form.facilityName,
          errorMessages: {
            required: 'Enter the Name of the VA medical center',
          },
        }),
        facilityLocation: textUI({
          title: 'City and state of the VA medical center',
          required: form =>
            get('locationOfDeath.location', form) === 'vaMedicalCenter' &&
            !form.facilityLocation,
          errorMessages: {
            required: 'Enter the city and state of the VA medical center',
          },
        }),
        'ui:options': {
          hideIf: form =>
            get('locationOfDeath.location', form) !== 'vaMedicalCenter',
        },
      },
      stateVeteransHome: {
        facilityName: textUI({
          title: 'Name of the state Veterans facility',
          required: form =>
            get('locationOfDeath.location', form) === 'stateVeteransHome' &&
            !form.facilityName,
          errorMessages: {
            required: 'Enter the name of the state Veterans facility',
          },
        }),
        facilityLocation: textUI({
          title: 'City and state of the state Veterans facility',
          required: form =>
            get('locationOfDeath.location', form) === 'stateVeteransHome' &&
            !form.facilityLocation,
          errorMessages: {
            required: 'Enter the city and state of the state Veterans facility',
          },
        }),
        'ui:options': {
          hideIf: form =>
            get('locationOfDeath.location', form) !== 'stateVeteransHome',
        },
      },
      other: {
        ...textUI({
          title: 'Place where the Veteran’s death happened',
          errorMessages: {
            required: 'Enter where the Veteran’s death happened',
          },
          required: form => get('locationOfDeath.location', form) === 'other',
        }),
        'ui:options': {
          hideIf: form => get('locationOfDeath.location', form) !== 'other',
          classNames: 'vads-u-margin-top--2',
        },
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

import ssnUI from '@department-of-veterans-affairs/platform-forms-system/ssn';
import currentOrPastDateUI from '@department-of-veterans-affairs/platform-forms-system/currentOrPastDate';
import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
import { generateDescription, generateHelpText } from '../../../utils/helpers';

const {
  veteranSocialSecurityNumber,
  vaFileNumber,
  veteranDateOfBirth,
} = fullSchemaBurials.properties;

export default {
  uiSchema: {
    'ui:description': generateDescription('Personal information'),
    veteranSocialSecurityNumber: {
      ...ssnUI,
      'ui:title': 'Veteran’s Social Security number',
      'ui:required': form => !form.vaFileNumber,
      'ui:description': generateHelpText('example, 123 45 6789'),
      'ui:errorMessages': {
        required: 'Enter the Veteran’s Social Security number',
      },
    },
    vaFileNumber: {
      'ui:title': 'Veteran’s VA file number',
      'ui:description': generateHelpText(
        'Enter Veteran’s VA file number if it doesn’t match their SSN',
      ),
      'ui:errorMessages': {
        pattern: 'Enter a valid VA file number',
      },
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
      },
    },
    veteranDateOfBirth: {
      ...currentOrPastDateUI('Veteran’s date of birth'),
      'ui:errorMessages': {
        required: 'Enter the Veteran’s date of birth',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['veteranSocialSecurityNumber', 'veteranDateOfBirth'],
    properties: {
      veteranSocialSecurityNumber,
      vaFileNumber,
      veteranDateOfBirth,
    },
  },
};

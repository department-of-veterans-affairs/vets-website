import definitions from 'vets-json-schema/dist/definitions.json';
import { validateDateOfBirth } from 'platform/forms/validations';
import { fullNameDeprecatedUI } from '../../shared/definitions/rjsfPatterns';
import { pdfFullNameNoSuffixSchema } from '../../shared/definitions/pdfFullNameNoSuffix';
import VetPersInfoUiTitle from '../components/VetPersInfoUiTitle';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': VetPersInfoUiTitle,
    veteranFullName: fullNameDeprecatedUI,
    veteranDateOfBirth: {
      'ui:title': 'Date of birth',
      'ui:widget': 'date',
      'ui:validations': [validateDateOfBirth],
      'ui:errorMessages': {
        required: 'Please provide a date of birth',
        pattern: 'Please provide a valid date of birth',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['veteranFullName', 'veteranDateOfBirth'],
    properties: {
      veteranFullName: pdfFullNameNoSuffixSchema(),
      veteranDateOfBirth: definitions.date,
    },
  },
};

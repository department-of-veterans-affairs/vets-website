import definitions from 'vets-json-schema/dist/definitions.json';
import { validateDateOfBirth } from 'platform/forms/validations';
import { fullNameDeprecatedUI } from '../../shared/definitions/rjsfPatterns';
import { pdfFullNameNoSuffixSchema } from '../../shared/definitions/pdfFullNameNoSuffix';
import ClaimantPersInfoUiTitle from '../components/ClaimantPersInfoUiTitle';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': ClaimantPersInfoUiTitle,
    claimantFullName: fullNameDeprecatedUI,
    claimantDateOfBirth: {
      'ui:title': 'Date of birth',
      'ui:widget': 'date',
      'ui:validations': [validateDateOfBirth],
      'ui:errorMessages': {
        required: 'Please provide a date of birth',
        pattern: 'Please provide a valid date of birth',
      },
      'ui:confirmationField': ({ formData }) => ({
        data: new Date(`${formData}T00:00:00`).toLocaleDateString('en-us', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['claimantFullName', 'claimantDateOfBirth'],
    properties: {
      claimantFullName: pdfFullNameNoSuffixSchema(),
      claimantDateOfBirth: definitions.date,
    },
  },
};

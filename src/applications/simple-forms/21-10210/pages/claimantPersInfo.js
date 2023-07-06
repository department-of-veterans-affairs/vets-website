import definitions from 'vets-json-schema/dist/definitions.json';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import { schema } from '../../shared/definitions/pdfFullNameNoSuffix';
import ClaimantPersInfoUiTitle from '../components/ClaimantPersInfoUiTitle';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': ClaimantPersInfoUiTitle,
    claimantFullName: fullNameUI,
    claimantDateOfBirth: {
      'ui:title': 'Date of birth',
      'ui:widget': 'date',
    },
  },
  schema: {
    type: 'object',
    required: ['claimantFullName', 'claimantDateOfBirth'],
    properties: {
      claimantFullName: schema(),
      claimantDateOfBirth: definitions.date,
    },
  },
};

import definitions from 'vets-json-schema/dist/definitions.json';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import { schema } from '../../shared/definitions/pdfFullNameNoSuffix';
import VetPersInfoUiTitle from '../components/VetPersInfoUiTitle';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': VetPersInfoUiTitle,
    veteranFullName: fullNameUI,
    veteranDateOfBirth: {
      'ui:title': 'Date of birth',
      'ui:widget': 'date',
    },
  },
  schema: {
    type: 'object',
    required: ['veteranFullName', 'veteranDateOfBirth'],
    properties: {
      veteranFullName: schema(),
      veteranDateOfBirth: definitions.date,
    },
  },
};

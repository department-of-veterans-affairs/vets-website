import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import { validateBooleanGroup } from 'platform/forms-system/src/js/validation';
import { authorizeMedicalSelect } from '../content/authorizeMedicalSelect';
import { saveYourApplication } from '../content/saveYourApplication';

export default {
  uiSchema: {
    'view:saveYourApplication': {
      'ui:description': saveYourApplication,
    },
    'view:authorizeMedicalSelect': {
      'ui:description': authorizeMedicalSelect,
    },
    'view:authorizeRecordsCheckbox': {
      'ui:title': 'Select the types of records they can access',
      'ui:options': {
        showFieldLabel: true,
      },
      'ui:validations': [validateBooleanGroup],
      'ui:errorMessages': {
        atLeastOne: 'Please select at least one type',
        required: 'Please select at least one type',
      },
      'view:alcoholRecords': {
        'ui:webComponentField': VaCheckboxField,
        'ui:title': 'Alcoholism and alcohol abuse records',
      },
      'view:drugAbuseRecords': {
        'ui:webComponentField': VaCheckboxField,
        'ui:title': 'Drug abuse records',
      },
      'view:HIVRecords': {
        'ui:webComponentField': VaCheckboxField,
        'ui:title': 'HIV (human immunodeficiency virus) records',
      },
      'view:sickleCellRecords': {
        'ui:webComponentField': VaCheckboxField,
        'ui:title': 'Sickle cell anemia records',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:saveYourApplication': {
        type: 'object',
        properties: {},
      },
      'view:authorizeMedicalSelect': {
        type: 'object',
        formData: { prop1: 'test' },
        properties: {},
      },
      'view:authorizeRecordsCheckbox': {
        type: 'object',
        properties: {
          'view:alcoholRecords': { type: 'boolean' },
          'view:drugAbuseRecords': { type: 'boolean' },
          'view:HIVRecords': { type: 'boolean' },
          'view:sickleCellRecords': { type: 'boolean' },
        },
      },
    },
  },
};

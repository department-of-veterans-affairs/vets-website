import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';

const { ssn } = commonDefinitions;
const personalInformation2 = {
  uiSchema: {
    ssn: {
      ...ssnUI,
      'ui:title': 'Your social security number',
    },
    vaFileNumber: {
      'ui:title': 'Your VA file number',
      'ui:errorMessages': {
        pattern: 'Sorry, number must be 7 to 9 digits.',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['ssn'],
    properties: {
      ssn,
      vaFileNumber: {
        type: 'number',
        pattern: '^[0-9]{7,9}$',
      },
    },
  },
};

export default personalInformation2;

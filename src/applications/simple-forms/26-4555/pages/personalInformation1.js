import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';

const { fullName } = commonDefinitions;
const personalInformation1 = {
  uiSchema: {
    fullName: fullNameUI,
    birthDate: {
      'ui:title': 'Your date of birth',
      'ui:widget': 'date',
    },
  },
  schema: {
    type: 'object',
    required: ['fullName'],
    properties: {
      fullName,
      birthDate: {
        pattern:
          '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$',
        type: 'string',
      },
    },
  },
};

export default personalInformation1;

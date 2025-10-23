// In a real app this would not be imported directly; instead the schema that
// is imported from vets-json-schema should include these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';

const { fullName, ssn } = commonDefinitions;

const applicantInformation = {
  uiSchema: {
    fullName: fullNameUI,
    ssn: ssnUI,
  },
  schema: {
    type: 'object',
    required: ['fullName'],
    properties: {
      fullName,
      ssn,
    },
  },
};

export default applicantInformation;

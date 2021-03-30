import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import fullNameUI from 'platform/forms/definitions/fullName';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import fullSchema from 'vets-json-schema/dist/VRRAP-schema.json';

const {
  veteranFullName,
  veteranSocialSecurityNumber,
  dateOfBirth,
} = fullSchema.properties;

const path = 'form';
const title = 'Application';
const uiSchema = {
  applicantFullName: fullNameUI,
  applicantSocialSecurityNumber: ssnUI,
  dateOfBirth: {
    ...currentOrPastDateUI('Date of birth'),
    'ui:errorMessages': {
      required: 'Please provide a valid date',
      futureDate: 'Please provide a valid date',
    },
  },
};

const schema = {
  required: ['applicantSocialSecurityNumber', 'dateOfBirth'],
  type: 'object',
  properties: {
    veteranFullName,
    veteranSocialSecurityNumber,
    dateOfBirth,
  },
};

export { path, title, uiSchema, schema };

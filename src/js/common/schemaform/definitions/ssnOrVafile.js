import { validateSSNorVAfile } from '../validation';

const uiSchema = {
  'ui:title': 'Social or VA File',
  'ui:validations': [
    validateSSNorVAfile
  ],
  'ui:errorMessages': {
    pattern: 'Please enter a valid 9 digit SSN (dashes allowed) or a valid VA file number'
  }
};

export default uiSchema;

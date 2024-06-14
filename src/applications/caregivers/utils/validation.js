import {
  hasPrimaryCaregiver,
  hasSecondaryCaregiverOne,
  isSsnUnique,
} from './helpers';
import content from '../locales/en/content.json';

export const validateSsnIsUnique = (errors, _, formData) => {
  if (!isSsnUnique(formData)) {
    errors.addError(content['validation-ssn-unique']);
  }
};

export const validateCaregivers = (errors, _, formData) => {
  const hasPrimary = hasPrimaryCaregiver(formData);
  const hasSecondary = hasSecondaryCaregiverOne(formData);
  const hasCaregiver = hasPrimary || hasSecondary;

  // add a blank error to disable the ability to continue the form while not displaying the error itself
  if (!hasCaregiver) {
    errors.addError(' ');
  }
};

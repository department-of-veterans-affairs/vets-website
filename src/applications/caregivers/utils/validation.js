import {
  isSsnUnique,
  hasPrimaryCaregiver,
  hasSecondaryCaregiverOne,
} from './helpers';
import { REQUIRED_ADDRESS_FIELDS } from './constants';
import content from '../locales/en/content.json';

export const requireAddressFields = (errors, fieldData) => {
  /* adding blank error(s) to disable the ability to continue the form when there are validation issues
   * in the the address-with-autofill field. The field component handles all validation messaging, we
   * just need to block navigation.
   */
  REQUIRED_ADDRESS_FIELDS.forEach(field => {
    if (!fieldData[field]) errors[field].addError(' ');
  });
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

export const validatePlannedClinic = (errors, _, formData) => {
  const { veteranPlannedClinic } = formData;

  /* adding blank error(s) to disable the ability to continue the form when there are validation issues
   * in the the facility search field. The field component handles all validation messaging, we
   * just need to block navigation.
   */
  if (!veteranPlannedClinic) {
    errors.addError(' ');
  }
};

export const validateSsnIsUnique = (errors, _, formData) => {
  if (!isSsnUnique(formData)) {
    errors.addError(content['validation-ssn-unique']);
  }
};

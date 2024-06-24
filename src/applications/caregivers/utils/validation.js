import {
  isSsnUnique,
  hasPrimaryCaregiver,
  hasSecondaryCaregiverOne,
} from './helpers';
import content from '../locales/en/content.json';

export const requireAddressFields = (errors, fieldData) => {
  const { street, city, state, postalCode, county } = fieldData;

  /* adding blank error(s) to disable the ability to continue the form when there are validation issues
   * in the the address-with-autofill field. The field component handles all validation messaging, we
   * just need to block navigation.
   */
  if (!street) errors.street.addError(' ');
  if (!city) errors.city.addError(' ');
  if (!state) errors.state.addError(' ');
  if (!postalCode) errors.postalCode.addError(' ');
  if (!county) errors.county.addError(' ');
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

export const validateSsnIsUnique = (errors, _, formData) => {
  if (!isSsnUnique(formData)) {
    errors.addError(content['validation-ssn-unique']);
  }
};

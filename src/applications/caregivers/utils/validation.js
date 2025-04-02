import {
  hasPrimaryCaregiver,
  hasSecondaryCaregiverOne,
  hasSecondaryCaregiverTwo,
} from './helpers';
import { ADDRESS_REGEX, REQUIRED_ADDRESS_FIELDS } from './constants';
import content from '../locales/en/content.json';

export const validateCaregivers = (errors, _, formData) => {
  const hasPrimary = hasPrimaryCaregiver(formData);
  const hasSecondary = hasSecondaryCaregiverOne(formData);
  const hasCaregiver = hasPrimary || hasSecondary;

  // add a blank error to disable the ability to continue the form while not displaying the error itself
  if (!hasCaregiver) {
    errors.addError(' ');
  }
};

export const validateCountyInput = (errors, fieldData) => {
  const regex = new RegExp(ADDRESS_REGEX.county(), 'i');
  if (!regex.test(fieldData?.trim())) {
    errors.addError(content['validation-address--county-pattern']);
  }
};

export const validatePlannedClinic = (errors, _, formData) => {
  /* adding blank error(s) to disable the ability to continue the form when there are validation issues
   * in the the facility search field. The field component handles all validation messaging, we
   * just need to block navigation.
   */
  if (Object.keys(formData['view:plannedClinic'] ?? {}).length === 0) {
    errors.addError(' ');
  }
};

export const validateSsnIsUnique = (errors, _, formData) => {
  const {
    veteranSsnOrTin,
    primarySsnOrTin,
    secondaryOneSsnOrTin,
    secondaryTwoSsnOrTin,
  } = formData;

  const allValidSSNs = [
    veteranSsnOrTin,
    hasPrimaryCaregiver(formData) ? primarySsnOrTin : undefined,
    hasSecondaryCaregiverOne(formData) ? secondaryOneSsnOrTin : undefined,
    hasSecondaryCaregiverTwo(formData) ? secondaryTwoSsnOrTin : undefined,
  ].filter(Boolean);

  if (allValidSSNs.length !== new Set(allValidSSNs).size) {
    errors.addError(content['validation-ssn-unique']);
  }
};

export const validateAddressFields = (errors, fieldData) => {
  /* adding blank error(s) to disable the ability to continue the form when there are validation issues
   * in the the address-with-autofill field. The field component handles all validation messaging, we
   * just need to block navigation.
   */
  REQUIRED_ADDRESS_FIELDS.forEach(field => {
    if (!fieldData[field]) errors[field].addError(' ');
    // this is a hack to block navigation with an invalid county response
    if (field === 'county') {
      validateCountyInput(errors[field], fieldData[field]);
    }
  });
};

import {
  facilityTypeChoices,
  facilityTypeError,
} from '../content/facilityTypes';

export const validateFacilityTypes = (errors, fieldData) => {
  // facilityTypeChoices = checkboxes & other = text input
  const keys = [...Object.keys(facilityTypeChoices), 'other'];
  const noFacilityTypes = !keys.some(key => fieldData[key]);
  if (noFacilityTypes) {
    errors.addError(facilityTypeError);
  }
};

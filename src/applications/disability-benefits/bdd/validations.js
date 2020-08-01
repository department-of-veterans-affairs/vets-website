import separationLocations from './content/separationLocations';

export const checkSeparationLocation = (errors, values = {}, formData) => {
  const data = formData?.serviceInformation?.separationLocation?.label;
  const isValid =
    data && separationLocations.some(({ description }) => data === description);
  if (!isValid) {
    errors.addError('Please select an option from the suggestions');
  }
};

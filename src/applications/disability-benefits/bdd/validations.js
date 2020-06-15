import separationLocations from './content/separationLocations';

export const checkSeparationLocation = (errors, values = {}, formData) => {
  const isValid =
    (formData?.separationLocation &&
      separationLocations.some(
        ({ description }) => formData.separationLocation === description,
      )) ||
    false;

  if (!isValid) {
    errors.addError('Please select a location from the list');
  }
};

import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import { durationInDays } from '../utils/helpers';

function calculateSeparationDuration(formData) {
  const parsedFormData = JSON.parse(formData);
  const transformedValue = { ...parsedFormData };

  // Calculate separation duration if both dates are present
  if (
    transformedValue.separationStartDate &&
    transformedValue.separationEndDate
  ) {
    transformedValue.separationDurationInDays = durationInDays(
      transformedValue.separationStartDate,
      transformedValue.separationEndDate,
    );
  }

  return JSON.stringify(transformedValue);
}

export const transform = (formConfig, form) => {
  let transformedData = transformForSubmit(formConfig, form);
  transformedData = calculateSeparationDuration(transformedData);
  return transformedData;
};

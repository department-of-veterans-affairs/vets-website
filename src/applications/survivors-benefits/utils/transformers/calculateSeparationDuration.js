import { durationInDays } from '../helpers';
import { separationReasonOptions } from '../labels';

export function calculateSeparationDuration(formData) {
  const parsedFormData = JSON.parse(formData);
  const transformedValue = parsedFormData;

  let calculatedDuration = null;

  if (
    parsedFormData?.separationStartDate &&
    parsedFormData?.separationEndDate
  ) {
    calculatedDuration = durationInDays(
      parsedFormData?.separationStartDate,
      parsedFormData?.separationEndDate,
    );
  }

  if (parsedFormData?.separationExplanation) {
    const originalExplanation = parsedFormData.separationExplanation;
    const additionalItems = [];

    if (parsedFormData?.separationDueToAssignedReasons) {
      // Get the display value from the labels object
      const reasonKey = parsedFormData.separationDueToAssignedReasons;
      const reasonLabel = separationReasonOptions[reasonKey];
      additionalItems.push(`Reason: ${reasonLabel}`);
    }

    if (parsedFormData?.separationStartDate) {
      additionalItems.push(`Start Date: ${parsedFormData.separationStartDate}`);
    }

    if (parsedFormData?.separationEndDate) {
      additionalItems.push(`End Date: ${parsedFormData.separationEndDate}`);
    }

    if (calculatedDuration) {
      additionalItems.push(`Duration: ${calculatedDuration} days`);
    }

    if (parsedFormData?.courtOrderedSeparation !== undefined) {
      const courtOrderValue = parsedFormData.courtOrderedSeparation
        ? 'Yes'
        : 'No';
      additionalItems.push(`Court Ordered: ${courtOrderValue}`);
    }

    const additionalInfo = additionalItems.join(' | ');

    transformedValue.separationExplanation = additionalInfo
      ? `${originalExplanation} | ${additionalInfo}`
      : originalExplanation;
  }

  return JSON.stringify(transformedValue);
}

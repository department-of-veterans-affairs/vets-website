export function truncateMiddleInitials(formData) {
  const parsedFormData = JSON.parse(formData);
  const transformedValue = parsedFormData;
  if (parsedFormData?.veteranFullName?.middle) {
    transformedValue.veteranFullName.middle = parsedFormData?.veteranFullName?.middle.charAt(
      0,
    );
  }
  if (parsedFormData?.claimantFullName?.middle) {
    transformedValue.claimantFullName.middle = parsedFormData?.claimantFullName?.middle.charAt(
      0,
    );
  }
  return JSON.stringify(transformedValue);
}

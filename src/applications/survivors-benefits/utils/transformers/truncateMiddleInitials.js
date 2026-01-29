export function truncateMiddleInitials(formData) {
  const parsedFormData = JSON.parse(formData);
  const transformedValue = parsedFormData;
  if (parsedFormData?.veteranFullName?.middle) {
    transformedValue.veteranFullName.middle = parsedFormData?.veteranFullName?.middle.charAt();
  }
  if (parsedFormData?.claimantFullName?.middle) {
    transformedValue.claimantFullName.middle = parsedFormData?.claimantFullName?.middle.charAt();
  }
  if (parsedFormData?.veteranPreviousNames?.length) {
    transformedValue.veteranPreviousNames = parsedFormData.veteranPreviousNames.map(
      name => {
        if (name?.otherServiceName?.middle) {
          return {
            ...name,
            otherServiceName: {
              ...name.otherServiceName,
              middle: name.otherServiceName.middle.charAt(),
            },
          };
        }
        return name;
      },
    );
  }
  return JSON.stringify(transformedValue);
}

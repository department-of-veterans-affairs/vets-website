export function unnestOtherServiceNames(formData) {
  const parsedFormData = JSON.parse(formData);
  const transformedValue = parsedFormData;
  if (parsedFormData?.veteranPreviousNames?.length) {
    transformedValue.veteranPreviousNames = parsedFormData.veteranPreviousNames.map(
      name => {
        return {
          ...name.otherServiceName,
        };
      },
    );
  }
  return JSON.stringify(transformedValue);
}

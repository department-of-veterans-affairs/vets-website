export function splitVaSsnField(formData) {
  const parsedFormData = JSON.parse(formData);
  const transformedValue = { ...parsedFormData };
  if (parsedFormData?.veteranSocialSecurityNumber?.ssn) {
    transformedValue.veteranSocialSecurityNumber =
      parsedFormData?.veteranSocialSecurityNumber?.ssn;
  } else {
    delete transformedValue.veteranSocialSecurityNumber;
  }
  if (parsedFormData?.veteranSocialSecurityNumber?.vaFileNumber) {
    transformedValue.vaFileNumber =
      parsedFormData?.veteranSocialSecurityNumber?.vaFileNumber;
  }
  return JSON.stringify(transformedValue);
}

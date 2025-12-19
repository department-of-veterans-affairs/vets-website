export function updateBankValues(formData) {
  const parsedFormData = JSON.parse(formData);
  const transformedValue = parsedFormData;
  if (parsedFormData?.bankAccount?.accountType) {
    transformedValue.bankAccount.accountType = parsedFormData.bankAccount.accountType.toUpperCase();
  }
  return JSON.stringify(transformedValue);
}

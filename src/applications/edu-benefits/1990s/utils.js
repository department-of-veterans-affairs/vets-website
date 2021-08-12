export const hasNewBankInformation = (bankAccount = {}) => {
  const { accountType, accountNumber, routingNumber } = bankAccount;
  return (
    typeof accountType !== 'undefined' ||
    typeof accountNumber !== 'undefined' ||
    typeof routingNumber !== 'undefined'
  );
};

export const deviewifyFields = formData => {
  const newFormData = {};
  Object.keys(formData).forEach(key => {
    const nonViewKey = /^view:/.test(key) ? key.replace('view:', '') : key;
    // Recurse if necessary
    newFormData[nonViewKey] =
      typeof formData[key] === 'object' && !Array.isArray(formData[key])
        ? deviewifyFields(formData[key])
        : formData[key];
  });
  return newFormData;
};

/**
 * Use this function in the prefillTransformer to move all bank account
 * information into `view:originalBankAccount`. This is useful when using the
 * PaymentView component, which will display either `bankAccount` or
 * `view:originalBankAccount`.
 *
 * @param {object} data - All the pre-filled form data
 * @returns {object} - A new pre-filled form data object after transformation.
 */
export const prefillBankInformation = (
  data,
  prefilledFieldNames = defaultFieldNames,
) => {
  const newData = _.omit(
    [
      prefilledFieldNames.accountType,
      prefilledFieldNames.accountNumber,
      prefilledFieldNames.routingNumber,
      prefilledFieldNames.bankName,
    ],
    data,
  );

  const accountType = data[prefilledFieldNames.accountType];
  const accountNumber = data[prefilledFieldNames.accountNumber];
  const routingNumber = data[prefilledFieldNames.routingNumber];
  const bankName = data[prefilledFieldNames.bankName];

  if (accountType && accountNumber && routingNumber && bankName) {
    newData['view:originalBankAccount'] = viewifyFields({
      accountType,
      accountNumber,
      routingNumber,
      bankName,
    });

    // start the bank section in 'review' mode
    newData.bankAccount = { 'view:hasPrefilledBank': true };
  }

  return newData;
};
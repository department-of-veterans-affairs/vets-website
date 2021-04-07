/**
 * Different than hasNewBankInformation because plucked property names are different
 * @param {*} bankAccount prefill bank account information object
 */
export const hasPrefillBankInformation = (bankAccount = {}) => {
  const { bankAccountType, bankAccountNumber, bankRoutingNumber } = bankAccount;
  return (
    typeof bankAccountType !== 'undefined' ||
    typeof bankAccountNumber !== 'undefined' ||
    typeof bankRoutingNumber !== 'undefined'
  );
};

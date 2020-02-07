export function getRoutingNumberErrorMessage(routingNumber) {
  if (!routingNumber.match(/^\d{9}$/)) {
    return 'Please enter the bank’s 9-digit routing number.';
  }
  return null;
}

export function getAccountNumberErrorMessage(accountNumber) {
  if (!accountNumber.match(/^\d{1,17}$/)) {
    return 'Please enter an account number.';
  }
  return null;
}

export function getAccountTypeErrorMessage(accountType) {
  if (!accountType) {
    return 'Please select the type that best describes the account.';
  }
  return null;
}

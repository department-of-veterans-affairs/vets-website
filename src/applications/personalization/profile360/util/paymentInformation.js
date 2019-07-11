export function getRoutingNumberErrorMessage(routingNumber) {
  if (!routingNumber.match(/^\d{9}$/)) {
    return 'Please enter your bank’s 9-digit routing number.';
  }
  return null;
}

export function getAccountNumberErrorMessage(accountNumber) {
  if (!accountNumber.match(/^\d{1,17}$/)) {
    return 'Please enter your account number.';
  }
  return null;
}

export function getAccountTypeErrorMessage(accountType) {
  if (!accountType) {
    return 'Please select the type that best describes your account.';
  }
  return null;
}

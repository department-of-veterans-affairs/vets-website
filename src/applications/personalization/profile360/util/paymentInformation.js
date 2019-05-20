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

const ACCOUNT_FLAGGED_FOR_FRAUD = 'Account Flagged';
const FRAUDULENT_ROUTING_NUMBER = 'Potential Fraud';

function hasError(errors, errorTitle) {
  return errors.some(err => err.title === errorTitle);
}

export function getUpdateErrorMessage(responseError) {
  const { errors = [] } = responseError.error;

  if (hasError(errors, ACCOUNT_FLAGGED_FOR_FRAUD)) {
    return 'This account has an active fraud report and cannot be updated at this time.';
  }

  if (hasError(errors, FRAUDULENT_ROUTING_NUMBER)) {
    return 'The submitted routing number has been associated with fraudulent activity.';
  }

  return 'We’re sorry. We couldn’t update your payment information. Please try again later.';
}

import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import capitalize from 'lodash/capitalize';
import recordAnalyticsEvent from '~/platform/monitoring/record-event';

export const LH_CNP_ENDPOINT =
  '/profile/direct_deposits/disability_compensations';

// generates the options object for the fetch call
// since the api is expecting a different format for the request body
// than what the data from the form fields looks like
export const generateApiRequestOptions = fields => {
  return {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify({
      accountType: fields.accountType,
      accountNumber: fields.accountNumber,
      routingNumber: fields.financialInstitutionRoutingNumber,
    }),
    mode: 'cors',
  };
};

// formats the response in a way that is consistent with the legacy PPIU endpoint
// and also is consistent with the way the data is used in the form UI fields
export const formatDirectDepositResponse = response => {
  const result = cloneDeep(response);

  set(result, 'paymentAccount', {
    financialInstitutionName: result?.paymentAccount?.name,
    financialInstitutionRoutingNumber: response?.paymentAccount?.routingNumber,
    accountNumber: response?.paymentAccount?.accountNumber,
    accountType: capitalize(response?.paymentAccount?.accountType) || undefined,
  });

  return result;
};

export const recordCNPEvent = (
  { status, method, extraProperties = {} },
  recordEvent = recordAnalyticsEvent,
) => {
  // only add the error-key property if it exists on extraProperties
  const payload = {
    event: 'api_call',
    'api-name': `${method} ${LH_CNP_ENDPOINT}`,
    'api-status': status,
    ...(extraProperties?.['error-key'] && {
      'error-key': extraProperties['error-key'],
    }),
  };

  recordEvent(payload);
};

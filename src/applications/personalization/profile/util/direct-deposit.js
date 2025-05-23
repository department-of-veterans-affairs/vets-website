import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import capitalize from 'lodash/capitalize';
import recordAnalyticsEvent from '~/platform/monitoring/record-event';

export class DirectDepositClient {
  #LH_ENDPOINT = '/profile/direct_deposits/disability_compensations';

  #DEFAULT_FIELDS = {
    accountType: '',
    accountNumber: '',
    routingNumber: '',
  };

  constructor({ recordEvent = recordAnalyticsEvent } = {}) {
    this.recordAnalyticsEvent = recordEvent;
  }

  get endpoint() {
    return this.#LH_ENDPOINT;
  }

  formatDirectDepositResponseFromLighthouse = response => {
    const result = cloneDeep(response);

    set(result, 'paymentAccount', {
      financialInstitutionName: result?.paymentAccount?.name || undefined,
      financialInstitutionRoutingNumber:
        response?.paymentAccount?.routingNumber || undefined,
      accountNumber: response?.paymentAccount?.accountNumber || undefined,
      accountType:
        capitalize(response?.paymentAccount?.accountType) || undefined,
    });

    return result;
  };

  generateApiRequestOptions(fields) {
    const formattedFields = {
      accountType: fields.accountType,
      accountNumber: fields.accountNumber,
      routingNumber: fields.financialInstitutionRoutingNumber,
    };
    return {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify({ ...this.#DEFAULT_FIELDS, ...formattedFields }),
      mode: 'cors',
    };
  }

  recordDirectDepositEvent({
    endpoint,
    status,
    method = 'GET',
    extraProperties = {},
  }) {
    const apiEndpoint = endpoint || this.endpoint;
    const payload = {
      event: 'api_call',
      'api-name': `${method} ${apiEndpoint}`,
      'api-status': status,
    };

    const errorKey = extraProperties?.['error-key'];
    if (errorKey) {
      payload['error-key'] = errorKey;
    }
    const veteranStatus = extraProperties?.veteranStatus;
    if (veteranStatus) {
      payload['veteran-status'] = veteranStatus;
    }

    this.recordAnalyticsEvent(payload);
  }
}

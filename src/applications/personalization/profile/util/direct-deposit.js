import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import capitalize from 'lodash/capitalize';
import recordAnalyticsEvent from '~/platform/monitoring/record-event';
import { API_STATUS } from '../constants';

export class DirectDepositClient {
  #PPIU_ENDPOINT = '/ppiu/payment_information';

  #LH_ENDPOINT = '/profile/direct_deposits/disability_compensations';

  constructor({
    useLighthouseDirectDepositEndpoint = true,
    recordEvent = recordAnalyticsEvent,
  } = {}) {
    this.useLighthouseEndpoint = useLighthouseDirectDepositEndpoint;
    this.recordAnalyticsEvent = recordEvent;
  }

  get endpoint() {
    return this.useLighthouseEndpoint ? this.#LH_ENDPOINT : this.#PPIU_ENDPOINT;
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
    // The PPIU endpoint REQUIRES a financialInstitutionName field, but the
    // Lighthouse endpoint does not. We set a dummy value here
    // to avoid 500 errors from vets-api
    set(fields, 'financialInstitutionName', 'Hidden form field');

    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify(fields),
      mode: 'cors',
    };

    if (this.useLighthouseEndpoint) {
      options.body = JSON.stringify({
        accountType: fields.accountType,
        accountNumber: fields.accountNumber,
        routingNumber: fields.financialInstitutionRoutingNumber,
      });
    }

    return options;
  }

  recordLighthouseEvent({ method, status, errorKey = '' }) {
    const payload = {
      event: 'api_call',
      'api-name': `${method} ${this.endpoint}`,
      'api-status': status,
    };

    if (errorKey) {
      payload['error-key'] = errorKey;
    }

    this.recordAnalyticsEvent(payload);
  }

  recordPPIUEvent({ status, method, extraProperties }) {
    const result =
      status === API_STATUS.SUCCESSFUL && method === 'GET'
        ? 'retrieved'
        : status.toLowerCase();

    const payload = {
      event: `profile-${method.toLowerCase()}-cnp-direct-deposit-${result}`,
      ...extraProperties,
    };

    this.recordAnalyticsEvent(payload);
  }

  recordCNPEvent({ status, method = 'GET', extraProperties = {} }) {
    if (this.useLighthouseEndpoint) {
      this.recordLighthouseEvent({
        method,
        status,
        errorKey: extraProperties?.['error-key'],
      });
      return;
    }
    this.recordPPIUEvent({ status, method, extraProperties });
  }
}

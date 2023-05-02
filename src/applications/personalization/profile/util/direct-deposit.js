import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';

export class DirectDepositClient {
  #PPIU_ENDPOINT = '/ppiu/payment_information';

  #LH_ENDPOINT = '/profile/direct_deposits/disability_compensations';

  constructor({ useLighthouseDirectDepositEndpoint = false }) {
    this.useLighthouseEndpoint = useLighthouseDirectDepositEndpoint;
  }

  get endpoint() {
    return this.useLighthouseEndpoint ? this.#LH_ENDPOINT : this.#PPIU_ENDPOINT;
  }

  generateApiRequestOptions(fields) {
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

  formatDirectDepositResponseFromLighthouse = response => {
    const result = cloneDeep(response);
    if (result?.paymentAccount?.name) {
      set(
        result,
        'paymentAccount.financialInstitutionName',
        result.paymentAccount.name,
      );
    }
    if (result.paymentAccount?.routingNumber) {
      set(
        result,
        'paymentAccount.financialInstitutionRoutingNumber',
        result.paymentAccount.routingNumber,
      );
    }
    return result;
  };
}

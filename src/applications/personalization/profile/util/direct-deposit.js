import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import capitalize from 'lodash/capitalize';

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
    // The PPIU endpoint REQUIRES a financialInstitutionName field, but the
    // Lighthouse endpoint does not. We set a dummy value here to avoid
    // validation errors aka 500s from vets-api
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

  formatDirectDepositResponseFromLighthouse = response => {
    const result = cloneDeep(response);
    set(result, 'paymentAccount', {
      financialInstitutionName: result?.paymentAccount?.name,
      financialInstitutionRoutingNumber:
        response?.paymentAccount?.routingNumber,
      accountNumber: response?.paymentAccount?.accountNumber,
      accountType:
        capitalize(response?.paymentAccount?.accountType) || undefined,
    });

    return result;
  };
}

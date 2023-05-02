import { expect } from 'chai';

import { DirectDepositClient } from '@@profile/util/direct-deposit';

describe('DirectDepositClient', () => {
  const legacyClient = new DirectDepositClient({
    useLighthouseDirectDepositEndpoint: false,
  });

  const lighthouseClient = new DirectDepositClient({
    useLighthouseDirectDepositEndpoint: true,
  });

  it('returns the correct endpoint', () => {
    expect(legacyClient.endpoint).to.equal('/ppiu/payment_information');
    expect(lighthouseClient.endpoint).to.equal(
      '/profile/direct_deposits/disability_compensations',
    );
  });

  it('generates the correct request options', () => {
    const fields = {
      accountType: 'checking',
      accountNumber: '123456789',
      financialInstitutionRoutingNumber: '987654321',
    };

    const legacyOptions = legacyClient.generateApiRequestOptions(fields);
    const lighthouseOptions = lighthouseClient.generateApiRequestOptions(
      fields,
    );

    expect(legacyOptions.body).to.equal(JSON.stringify(fields));

    expect(lighthouseOptions.body).to.equal(
      JSON.stringify({
        accountType: fields.accountType,
        accountNumber: fields.accountNumber,
        routingNumber: fields.financialInstitutionRoutingNumber,
      }),
    );
  });

  it('formats the response from lighthouse', () => {
    const response = {
      paymentAccount: {
        accountType: 'CHECKING',
        accountNumber: '123456789',
        routingNumber: '987654321',
        name: 'Bank of America',
      },
    };

    const formattedResponse = lighthouseClient.formatDirectDepositResponseFromLighthouse(
      response,
    );

    expect(formattedResponse).to.deep.equal({
      paymentAccount: {
        accountType: 'CHECKING',
        accountNumber: '123456789',
        financialInstitutionRoutingNumber: '987654321',
        routingNumber: '987654321',
        financialInstitutionName: 'Bank of America',
        name: 'Bank of America',
      },
    });
  });

  it('passes response back unformatted if keys do not exist', () => {
    const response = {
      test: true,
    };

    const formattedResponse = lighthouseClient.formatDirectDepositResponseFromLighthouse(
      response,
    );

    expect(formattedResponse).to.deep.equal(response);
  });
});

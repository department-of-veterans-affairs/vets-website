import { expect } from 'chai';
import sinon from 'sinon';

import { DirectDepositClient } from '@@profile/util/direct-deposit';
import { API_STATUS } from '../../constants';

describe('DirectDepositClient', () => {
  const fields = {
    accountType: 'checking',
    accountNumber: '123456789',
    financialInstitutionRoutingNumber: '987654321',
  };

  describe('ppiu legacy client', () => {
    let legacyClient;
    let legacyRecordEventSpy;
    beforeEach(() => {
      legacyRecordEventSpy = sinon.spy();
      legacyClient = new DirectDepositClient({
        recordEvent: legacyRecordEventSpy,
      });
    });

    it('returns the correct endpoint', () => {
      expect(legacyClient.endpoint).to.equal('/ppiu/payment_information');
    });

    it('generates the correct request options', () => {
      const legacyOptions = legacyClient.generateApiRequestOptions(fields);

      // IMPORTANT: The PPIU endpoint REQUIRES a financialInstitutionName field,
      // it doesn't matter what the value is, but it must be present.
      expect(legacyOptions.body).to.equal(
        JSON.stringify({
          ...fields,
          financialInstitutionName: 'Hidden form field',
        }),
      );
    });

    it('records legacy analytics event', () => {
      legacyClient.recordCNPEvent({
        status: API_STATUS.STARTED,
        method: 'GET',
      });

      expect(legacyRecordEventSpy.firstCall.args[0]).to.deep.equal({
        event: 'profile-get-cnp-direct-deposit-started',
      });
    });
  });

  describe('lighthouse client', () => {
    let lighthouseClient;
    let lighthouseRecordEventSpy;

    beforeEach(() => {
      lighthouseRecordEventSpy = sinon.spy();
      lighthouseClient = new DirectDepositClient({
        useLighthouseDirectDepositEndpoint: true,
        recordEvent: lighthouseRecordEventSpy,
      });
    });

    it('returns the correct endpoint', () => {
      expect(lighthouseClient.endpoint).to.equal(
        '/profile/direct_deposits/disability_compensations',
      );
    });

    it('generates the correct request options', () => {
      const lighthouseOptions = lighthouseClient.generateApiRequestOptions(
        fields,
      );

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
          accountType: 'Checking',
          accountNumber: '123456789',
          financialInstitutionRoutingNumber: '987654321',
          financialInstitutionName: 'Bank of America',
        },
      });
    });

    it('passes response back with undefined values if not present', () => {
      const response = {
        paymentAccount: {
          financialInstitutionName: undefined,
          financialInstitutionRoutingNumber: undefined,
          accountNumber: undefined,
          accountType: undefined,
        },
      };

      const formattedResponse = lighthouseClient.formatDirectDepositResponseFromLighthouse(
        {},
      );

      expect(formattedResponse).to.deep.equal(response);
    });

    it('records lighthouse analytics event', () => {
      const errorMessage = 'test-error-message';
      lighthouseClient.recordCNPEvent({
        status: API_STATUS.FAILED,
        method: 'PUT',
        extraProperties: {
          'error-key': errorMessage,
        },
      });

      expect(lighthouseRecordEventSpy.firstCall.args[0]).to.deep.equal({
        event: 'api_call',
        'api-name': 'PUT /profile/direct_deposits/disability_compensations',
        'api-status': API_STATUS.FAILED,
        'error-key': errorMessage,
      });
    });

    it('records lighthouse analytics event without error', () => {
      lighthouseClient.recordCNPEvent({
        status: API_STATUS.SUCCESSFUL,
        method: 'PUT',
      });

      expect(lighthouseRecordEventSpy.firstCall.args[0]).to.deep.equal({
        event: 'api_call',
        'api-name': 'PUT /profile/direct_deposits/disability_compensations',
        'api-status': API_STATUS.SUCCESSFUL,
      });
    });
  });
});

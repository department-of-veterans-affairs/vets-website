import { expect } from 'chai';
import sinon from 'sinon';

import {
  generateApiRequestOptions,
  formatDirectDepositResponse,
  recordCNPEvent,
} from '@@profile/util/direct-deposit';
import { API_STATUS } from '../../constants';

describe('DirectDepositClient', () => {
  const fields = {
    accountType: 'checking',
    accountNumber: '123456789',
    financialInstitutionRoutingNumber: '987654321',
  };

  describe('direct deposit utilities', () => {
    it('generates the correct request options', () => {
      const requestOptions = generateApiRequestOptions(fields);

      expect(requestOptions.body).to.equal(
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

      const formattedResponse = formatDirectDepositResponse(response);

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

      const formattedResponse = formatDirectDepositResponse({});

      expect(formattedResponse).to.deep.equal(response);
    });

    it('records lighthouse analytics event', () => {
      const lighthouseRecordEventSpy = sinon.spy();
      const errorMessage = 'test-error-message';
      recordCNPEvent(
        {
          status: API_STATUS.FAILED,
          method: 'PUT',
          extraProperties: {
            'error-key': errorMessage,
          },
        },
        lighthouseRecordEventSpy,
      );

      expect(lighthouseRecordEventSpy.firstCall.args[0]).to.deep.equal({
        event: 'api_call',
        'api-name': 'PUT /profile/direct_deposits/disability_compensations',
        'api-status': API_STATUS.FAILED,
        'error-key': errorMessage,
      });
    });

    it('records lighthouse analytics event without error', () => {
      const lighthouseRecordEventSpy = sinon.spy();
      recordCNPEvent(
        {
          status: API_STATUS.SUCCESSFUL,
          method: 'PUT',
        },
        lighthouseRecordEventSpy,
      );

      expect(lighthouseRecordEventSpy.firstCall.args[0]).to.deep.equal({
        event: 'api_call',
        'api-name': 'PUT /profile/direct_deposits/disability_compensations',
        'api-status': API_STATUS.SUCCESSFUL,
      });
    });
  });
});

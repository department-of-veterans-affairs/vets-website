import { expect } from 'chai';
import sinon from 'sinon';

import {
  mockFetch,
  setFetchJSONFailure,
  setFetchJSONResponse,
} from '~/platform/testing/unit/helpers';

import * as paymentInformationActions from '../../actions/paymentInformation';

// since we are migrating to the lighthouse endpoint, we want to check that the actions are being called correctly
// and that the old endpoint still works when needed, and that GA events are correct payloads

const setup = () => {
  mockFetch();
  setFetchJSONResponse(global.fetch.onFirstCall(), {
    data: {
      attributes: {},
    },
  });
};

describe('saveCNPPaymentInformation FAILURE', () => {
  context(
    'using legacy PPIU endpoint with invalid routing number response',
    () => {
      it('should dispatch correct actions and capture error in GA and Sentry', async () => {
        setup();

        const recordEvent = sinon.spy();
        const captureCNPError = sinon.spy();

        setFetchJSONFailure(global.fetch.onFirstCall(), {
          errors: [
            {
              title: 'Internal server error',
              detail: 'Internal server error',
              code: '500',
              source: 'EVSS::PPIU::Service',
              status: '500',
              meta: {
                messages: [
                  {
                    key: 'payment.accountRoutingNumber.invalidCheckSum',
                    severity: 'ERROR',
                    text: 'Account Routing Number contains invalid checksum',
                  },
                ],
              },
            },
          ],
        });

        const actionCreator = paymentInformationActions.saveCNPPaymentInformation(
          {
            fields: { value: 'test' },
            isEnrollingInDirectDeposit: false,
            useLighthouseDirectDepositEndpoint: false,
            recordEvent,
            captureCNPError,
          },
        );

        const dispatch = sinon.spy();

        await actionCreator(dispatch);

        expect(global.fetch.called).to.be.true;
        expect(dispatch.calledTwice).to.be.true;

        // expect GA events to be called
        expect(recordEvent.firstCall.args[0]).to.be.deep.equal({
          event: 'profile-put-cnp-direct-deposit-started',
        });

        expect(recordEvent.secondCall.args[0]).to.be.deep.equal({
          event: 'profile-edit-failure',
          'profile-action': 'save-failure',
          'profile-section': 'cnp-direct-deposit-information',
          'error-key': 'invalid-routing-number-error-update',
        });

        // expect Sentry to be called
        expect(captureCNPError.firstCall.args[1]).to.be.deep.equal({
          eventName: 'cnp-put-direct-deposit-failed',
          useLighthouseDirectDepositEndpoint: false,
        });
      });
    },
  );

  context(
    'using Lighthouse endpoint with invalid routing number response',
    () => {
      it('should dispatch correct actions and capture error in GA and Sentry', async () => {
        setup();

        const recordEvent = sinon.spy();
        const captureCNPError = sinon.spy();

        setFetchJSONFailure(global.fetch.onFirstCall(), {
          errors: [
            {
              title: 'Test for invalid routing number based on code property',
              detail: 'test detail',
              code: 'cnp.payment.routing.number.invalid.checksum',
              status: '500',
            },
          ],
        });

        const actionCreator = paymentInformationActions.saveCNPPaymentInformation(
          {
            fields: { value: 'test' },
            isEnrollingInDirectDeposit: false,
            useLighthouseDirectDepositEndpoint: true,
            recordEvent,
            captureCNPError,
          },
        );

        const dispatch = sinon.spy();

        await actionCreator(dispatch);

        expect(global.fetch.called).to.be.true;
        expect(dispatch.calledTwice).to.be.true;

        // expect GA events to be called using standard api_call event instead of PPIU custom event
        expect(recordEvent.firstCall.args[0]).to.be.deep.equal({
          event: 'api_call',
          'api-name': 'PUT /profile/direct_deposits/disability_compensations',
          'api-status': 'started',
        });

        expect(recordEvent.secondCall.args[0]).to.be.deep.equal({
          event: 'api_call',
          'api-name': 'PUT /profile/direct_deposits/disability_compensations',
          'api-status': 'failed',
          'error-key':
            'cnp.payment.routing.number.invalid.checksum test detail-update',
        });

        // expect Sentry to be called
        expect(captureCNPError.firstCall.args[1]).to.be.deep.equal({
          eventName: 'cnp-put-direct-deposit-failed',
          useLighthouseDirectDepositEndpoint: true,
        });
      });
    },
  );
});

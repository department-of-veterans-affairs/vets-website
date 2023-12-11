import { expect } from 'chai';
import sinon from 'sinon';

import {
  mockFetch,
  setFetchJSONFailure,
  setFetchJSONResponse,
} from '~/platform/testing/unit/helpers';

import * as paymentInformationActions from '../../actions/paymentInformation';
import { LIGHTHOUSE_ERROR_KEYS } from '../../util';

// since we are migrating to the lighthouse endpoint, we want to check that the actions are being called correctly
// and that the old endpoint still works when needed, and that GA events are correct payloads

const setup = () => {
  mockFetch();
};

const testLighthouseFailure = ({ errorKey, isEnrolling = false }) => {
  context(`using Lighthouse endpoint with error code: ${errorKey}`, () => {
    it('should dispatch correct actions and capture error in GA and Sentry', async () => {
      setup();

      const recordEvent = sinon.spy();
      const captureCNPError = sinon.spy();

      setFetchJSONFailure(global.fetch.onFirstCall(), {
        errors: [
          {
            title: 'Test for invalid routing number based on code property',
            detail: 'test detail',
            code: errorKey,
            status: '500',
          },
        ],
      });

      const actionCreator = paymentInformationActions.saveCNPPaymentInformation(
        {
          fields: { value: 'test' },
          isEnrollingInDirectDeposit: isEnrolling,
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
        'error-key': `${errorKey} | test detail${
          isEnrolling ? '-enroll' : '-update'
        }`,
      });

      // expect Sentry to be called
      expect(captureCNPError.firstCall.args[1]).to.be.deep.equal({
        eventName: 'cnp-put-direct-deposit-failed',
      });
    });
  });
};

describe('saveCNPPaymentInformation', () => {
  context('Failures', () => {
    // testing for -update
    Object.values(LIGHTHOUSE_ERROR_KEYS).forEach(errorKey => {
      testLighthouseFailure({ errorKey });
    });

    // testing for -enroll
    Object.values(LIGHTHOUSE_ERROR_KEYS).forEach(errorKey => {
      testLighthouseFailure({ errorKey, isEnrolling: true });
    });
  });

  context('Success', () => {
    context(
      'using /profile/direct_deposits/disability_compensations endpoint',
      () => {
        it('should dispatch correct actions', async () => {
          setup();

          const recordEvent = sinon.spy();
          const captureCNPError = sinon.spy();

          setFetchJSONResponse(global.fetch.onFirstCall(), {
            data: {
              id: 'testId',
              type: 'CHECKING',
              attributes: {
                controlInformation: {
                  canUpdateDirectDeposit: true,
                },
                paymentAccount: {
                  name: 'WELLS FARGO BANK',
                  accountType: 'Checking',
                  accountNumber: '******7890',
                  routingNumber: '*****0503',
                },
              },
            },
          });

          const actionCreator = paymentInformationActions.saveCNPPaymentInformation(
            {
              fields: { value: 'test' },
              isEnrollingInDirectDeposit: false,
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
            event: 'api_call',
            'api-name': 'PUT /profile/direct_deposits/disability_compensations',
            'api-status': 'started',
          });

          expect(recordEvent.secondCall.args[0]).to.be.deep.equal({
            event: 'api_call',
            'api-name': 'PUT /profile/direct_deposits/disability_compensations',
            'api-status': 'successful',
          });
        });
      },
    );
  });
});

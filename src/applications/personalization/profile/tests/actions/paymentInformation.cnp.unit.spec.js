import { expect } from 'chai';
import sinon from 'sinon';

import {
  mockFetch,
  setFetchJSONFailure,
  setFetchJSONResponse,
} from '~/platform/testing/unit/helpers';

import * as paymentInformationActions from '../../actions/paymentInformation';
import { LIGHTHOUSE_ERROR_KEYS, PPIU_ERROR_MAP } from '../../util';

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
        'error-key': `${errorKey} test detail${
          isEnrolling ? '-enroll' : '-update'
        }`,
      });

      // expect Sentry to be called
      expect(captureCNPError.firstCall.args[1]).to.be.deep.equal({
        eventName: 'cnp-put-direct-deposit-failed',
        useLighthouseDirectDepositEndpoint: true,
      });
    });
  });
};

const testPPIUFailure = ({ errorKey, gaKey, isEnrolling = false } = {}) => {
  context(`using legacy PPIU endpoint with error key: ${errorKey}`, () => {
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
                  key: errorKey,
                  severity: 'ERROR',
                  text: 'nothing here for this test',
                },
              ],
            },
          },
        ],
      });

      const actionCreator = paymentInformationActions.saveCNPPaymentInformation(
        {
          fields: { value: 'test' },
          isEnrollingInDirectDeposit: isEnrolling,
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
        'error-key': `${gaKey}${isEnrolling ? '-enroll' : '-update'}`,
      });

      // expect Sentry to be called
      expect(captureCNPError.firstCall.args[1]).to.be.deep.equal({
        eventName: 'cnp-put-direct-deposit-failed',
        useLighthouseDirectDepositEndpoint: false,
      });
    });
  });
};

describe('saveCNPPaymentInformation', () => {
  context('Failures', () => {
    // testing for -update
    Object.values(PPIU_ERROR_MAP).forEach(({ RESPONSE_KEY, GA_KEY }) => {
      if (RESPONSE_KEY) {
        testPPIUFailure({ errorKey: RESPONSE_KEY, gaKey: GA_KEY });
      }
    });

    // testing for -enroll
    Object.values(PPIU_ERROR_MAP).forEach(({ RESPONSE_KEY, GA_KEY }) => {
      if (RESPONSE_KEY) {
        testPPIUFailure({
          errorKey: RESPONSE_KEY,
          gaKey: GA_KEY,
          isEnrolling: true,
        });
      }
    });

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
    context('using Lighthouse endpoint', () => {
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
            useLighthouseDirectDepositEndpoint: true,
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
    });
  });
});

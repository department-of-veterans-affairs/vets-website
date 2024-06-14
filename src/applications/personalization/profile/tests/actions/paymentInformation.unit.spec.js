import { expect } from 'chai';
import sinon from 'sinon';

import mockDisabilityCompensations from '@@profile/mocks/endpoints/disability-compensations';

import {
  mockFetch,
  setFetchJSONFailure,
  setFetchJSONResponse,
} from '~/platform/testing/unit/helpers';

import * as paymentInformationActions from '../../actions/paymentInformation';

let oldGA;

const setup = ({ mockGA }) => {
  oldGA = global.ga;
  mockFetch();
  setFetchJSONResponse(global.fetch.onFirstCall(), {
    data: {
      attributes: {},
    },
  });
  if (mockGA) {
    global.ga = sinon.stub();
    global.ga.getAll = sinon.stub();
    global.ga.getAll.returns([
      {
        get: key => (key === 'clientId' ? '1234567890:0987654321' : undefined),
      },
    ]);
  }
};

const teardown = () => {
  global.ga = oldGA;
};

describe('actions/paymentInformation', () => {
  describe('when global `ga` is set up correctly', () => {
    let actionCreator;
    let dispatch;
    let recordEventSpy;
    let captureErrorSpy;

    describe('fetchCNPPaymentInformation', () => {
      beforeEach(() => {
        setup({ mockGA: true });
        recordEventSpy = sinon.spy();
        captureErrorSpy = sinon.spy();
        actionCreator = paymentInformationActions.fetchCNPPaymentInformation({
          recordEvent: recordEventSpy,
          captureCNPError: captureErrorSpy,
        });
        dispatch = sinon.spy();
        setFetchJSONResponse(global.fetch.onFirstCall(), {
          data: {
            attributes: {
              responses: [
                {
                  paymentAccount: {
                    accountType: 'Savings',
                    financialInstitutionName: 'TD BANK NA',
                    accountNumber: '************4569',
                    financialInstitutionRoutingNumber: '*****3093',
                  },
                },
              ],
            },
          },
        });
      });

      afterEach(teardown);

      it('calls fetch to `GET v0/profile/direct_deposits/disability_compensations`', async () => {
        await actionCreator(dispatch);

        expect(global.fetch.firstCall.args[1].method).to.equal('GET');
        expect(
          global.fetch.firstCall.args[0].endsWith(
            '/direct_deposits/disability_compensations',
          ),
        ).to.be.true;
      });

      it('dispatches CNP_PAYMENT_INFORMATION_FETCH_STARTED', async () => {
        await actionCreator(dispatch);

        expect(dispatch.firstCall.args[0].type).to.be.equal(
          paymentInformationActions.CNP_PAYMENT_INFORMATION_FETCH_STARTED,
        );
      });

      describe('if the call succeeds and the user is not eligible direct deposit', () => {
        beforeEach(async () => {
          setFetchJSONResponse(
            global.fetch.onFirstCall(),
            mockDisabilityCompensations.isNotEligible,
          );
          await actionCreator(dispatch);
        });

        it('dispatches CNP_PAYMENT_INFORMATION_FETCH_SUCCEEDED and formats data it got from the endpoint, when not eligible all account info should be undefined', () => {
          expect(dispatch.secondCall.args[0].type).to.be.equal(
            paymentInformationActions.CNP_PAYMENT_INFORMATION_FETCH_SUCCEEDED,
          );
          expect(
            dispatch.secondCall.args[0].response.paymentAccount,
          ).to.deep.equal({
            accountType: undefined,
            financialInstitutionName: undefined,
            accountNumber: undefined,
            financialInstitutionRoutingNumber: undefined,
          });
        });

        it('reports the correct data to Google Analytics', () => {
          expect(recordEventSpy.firstCall.args[0].event).to.equal('api_call');
          expect(recordEventSpy.firstCall.args[0]['api-name']).to.equal(
            'GET /profile/direct_deposits/disability_compensations',
          );

          expect(recordEventSpy.secondCall.args[0].event).to.equal('api_call');
          expect(recordEventSpy.secondCall.args[0]['api-status']).to.equal(
            'successful',
          );
        });
      });

      describe('if the call succeeds and the user is eligible to sign up for direct deposit', () => {
        beforeEach(async () => {
          setFetchJSONResponse(
            global.fetch.onFirstCall(),
            mockDisabilityCompensations.isEligible,
          );
          await actionCreator(dispatch);
        });

        it('dispatches CNP_PAYMENT_INFORMATION_FETCH_SUCCEEDED and passes along the data it got from the endpoint', () => {
          expect(dispatch.secondCall.args[0].type).to.be.equal(
            paymentInformationActions.CNP_PAYMENT_INFORMATION_FETCH_SUCCEEDED,
          );
          expect(
            dispatch.secondCall.args[0].response.paymentAccount,
          ).to.deep.equal({
            accountType: undefined,
            financialInstitutionName: undefined,
            accountNumber: undefined,
            financialInstitutionRoutingNumber: undefined,
          });

          expect(
            dispatch.secondCall.args[0].response.controlInformation
              .canUpdateDirectDeposit,
          ).to.be.true;
        });

        it('reports the correct data to Google Analytics', () => {
          expect(recordEventSpy.firstCall.args[0].event).to.equal('api_call');
          expect(recordEventSpy.firstCall.args[0]['api-name']).to.equal(
            'GET /profile/direct_deposits/disability_compensations',
          );

          expect(recordEventSpy.secondCall.args[0].event).to.equal('api_call');
          expect(recordEventSpy.secondCall.args[0]['api-status']).to.equal(
            'successful',
          );
        });
      });

      describe('if the call succeeds and the user is signed up for direct deposit', () => {
        beforeEach(async () => {
          setFetchJSONResponse(
            global.fetch.onFirstCall(),
            mockDisabilityCompensations.base,
          );
          await actionCreator(dispatch);
        });

        it('dispatches CNP_PAYMENT_INFORMATION_FETCH_SUCCEEDED and passes along the data it got from the endpoint', () => {
          expect(dispatch.secondCall.args[0].type).to.be.equal(
            paymentInformationActions.CNP_PAYMENT_INFORMATION_FETCH_SUCCEEDED,
          );
          expect(
            dispatch.secondCall.args[0].response.paymentAccount,
          ).to.deep.equal({
            accountType: 'Checking', // CHECKING is capitalized
            financialInstitutionName:
              mockDisabilityCompensations.base.data.attributes.paymentAccount
                .name,
            accountNumber:
              mockDisabilityCompensations.base.data.attributes.paymentAccount
                .accountNumber,
            financialInstitutionRoutingNumber:
              mockDisabilityCompensations.base.data.attributes.paymentAccount
                .routingNumber,
          });
        });

        it('reports the correct data to Google Analytics', () => {
          expect(recordEventSpy.firstCall.args[0].event).to.equal('api_call');
          expect(recordEventSpy.firstCall.args[0]['api-name']).to.equal(
            'GET /profile/direct_deposits/disability_compensations',
          );

          expect(recordEventSpy.secondCall.args[0].event).to.equal('api_call');
          expect(recordEventSpy.secondCall.args[0]['api-status']).to.equal(
            'successful',
          );
        });
      });

      describe('if the call fails', () => {
        it('dispatches the correct actions', async () => {
          setFetchJSONFailure(global.fetch.onFirstCall(), {});
          await actionCreator(dispatch);

          expect(dispatch.firstCall.args[0].type).to.be.equal(
            paymentInformationActions.CNP_PAYMENT_INFORMATION_FETCH_STARTED,
          );
          expect(dispatch.secondCall.args[0].type).to.be.equal(
            paymentInformationActions.CNP_PAYMENT_INFORMATION_FETCH_FAILED,
          );
        });
      });
    });

    describe('saveCNPPaymentInformation', () => {
      beforeEach(() => {
        setup({ mockGA: true });
        recordEventSpy = sinon.spy();
        captureErrorSpy = sinon.spy();
        actionCreator = paymentInformationActions.saveCNPPaymentInformation({
          fields: { data: 'value' },
          recordEvent: recordEventSpy,
          captureCNPError: captureErrorSpy,
        });
        dispatch = sinon.spy();
        setFetchJSONResponse(
          global.fetch.onFirstCall(),
          mockDisabilityCompensations.base,
        );
      });
      afterEach(teardown);

      it('calls fetch to `PUT direct_deposits/disability_compensations`', async () => {
        await actionCreator(dispatch);

        expect(global.fetch.firstCall.args[1].method).to.equal('PUT');
        expect(
          global.fetch.firstCall.args[0].endsWith(
            '/direct_deposits/disability_compensations',
          ),
        ).to.be.true;
      });

      it('dispatches CNP_PAYMENT_INFORMATION_SAVE_STARTED', async () => {
        await actionCreator(dispatch);

        expect(dispatch.firstCall.args[0].type).to.be.equal(
          paymentInformationActions.CNP_PAYMENT_INFORMATION_SAVE_STARTED,
        );
      });

      describe('if the call succeeds', () => {
        beforeEach(async () => {
          await actionCreator(dispatch);
        });

        it('dispatches CNP_PAYMENT_INFORMATION_SAVE_SUCCEEDED', () => {
          expect(dispatch.secondCall.args[0].type).to.be.equal(
            paymentInformationActions.CNP_PAYMENT_INFORMATION_SAVE_SUCCEEDED,
          );
        });

        it('reports the correct data to Google Analytics', () => {
          expect(recordEventSpy.firstCall.args[0].event).to.equal('api_call');
          expect(recordEventSpy.firstCall.args[0]['api-name']).to.equal(
            'PUT /profile/direct_deposits/disability_compensations',
          );

          expect(recordEventSpy.secondCall.args[0].event).to.equal('api_call');
          expect(recordEventSpy.secondCall.args[0]['api-status']).to.equal(
            'successful',
          );
        });
      });

      describe('if the call fails', async () => {
        beforeEach(async () => {
          setFetchJSONFailure(
            global.fetch.onFirstCall(),
            mockDisabilityCompensations.updates.errors.accountNumberFlagged,
          );
          await actionCreator(dispatch);
        });

        it('dispatches CNP_PAYMENT_INFORMATION_SAVE_FAILED', () => {
          expect(dispatch.secondCall.args[0].type).to.be.equal(
            paymentInformationActions.CNP_PAYMENT_INFORMATION_SAVE_FAILED,
          );
        });

        it('reports the correct data to Google Analytics', () => {
          expect(recordEventSpy.firstCall.args[0].event).to.equal('api_call');
          expect(recordEventSpy.firstCall.args[0]['api-name']).to.equal(
            'PUT /profile/direct_deposits/disability_compensations',
          );

          expect(recordEventSpy.secondCall.args[0]).to.deep.equal({
            event: 'api_call',
            'api-name': 'PUT /profile/direct_deposits/disability_compensations',
            'api-status': 'failed',
            'error-key':
              'cnp.payment.account.number.fraud | Unspecified Error Detail-update',
          });
        });
      });
    });

    describe('fetchEDUPaymentInformation', () => {
      beforeEach(() => {
        setup({ mockGA: true });
        recordEventSpy = sinon.spy();
        actionCreator = paymentInformationActions.fetchEDUPaymentInformation(
          recordEventSpy,
        );
        dispatch = sinon.spy();
      });

      afterEach(teardown);

      it('calls fetch to `GET profile/ch33_bank_accounts`', async () => {
        await actionCreator(dispatch);

        expect(global.fetch.firstCall.args[1].method).to.equal('GET');
        expect(
          global.fetch.firstCall.args[0].endsWith(
            '/profile/ch33_bank_accounts',
          ),
        ).to.be.true;
      });

      it('immediately dispatches an EDU_PAYMENT_INFORMATION_FETCH_STARTED action', async () => {
        await actionCreator(dispatch);

        expect(dispatch.firstCall.args[0].type).to.be.equal(
          paymentInformationActions.EDU_PAYMENT_INFORMATION_FETCH_STARTED,
        );
      });

      describe('if the call succeeds and the user is signed up for direct deposit', () => {
        const response = {
          accountType: 'Checking',
          accountNumber: '*****6789',
          financialInstitutionRoutingNumber: '*****3133',
        };

        beforeEach(async () => {
          setFetchJSONResponse(global.fetch.onFirstCall(), {
            data: {
              attributes: response,
            },
          });
          await actionCreator(dispatch);
        });

        it('dispatches EDU_PAYMENT_INFORMATION_FETCH_SUCCEEDED and passes along the data it got from the endpoint', () => {
          expect(dispatch.secondCall.args[0].type).to.be.equal(
            paymentInformationActions.EDU_PAYMENT_INFORMATION_FETCH_SUCCEEDED,
          );
          expect(dispatch.secondCall.args[0].response).to.deep.equal({
            paymentAccount: response,
          });
        });

        it('reports the correct data to Google Analytics', () => {
          expect(recordEventSpy.firstCall.args[0].event).to.equal(
            'profile-get-edu-direct-deposit-started',
          );
          expect(recordEventSpy.secondCall.args[0].event).to.equal(
            'profile-get-edu-direct-deposit-retrieved',
          );
          expect(
            recordEventSpy.secondCall.args[0]['direct-deposit-setup-complete'],
          ).to.be.true;
        });
      });

      describe('if the call succeeds and the user is not signed up for direct deposit', () => {
        const response = {
          accountType: null,
          accountNumber: null,
          financialInstitutionRoutingNumber: null,
        };

        beforeEach(async () => {
          setFetchJSONResponse(global.fetch.onFirstCall(), {
            data: {
              attributes: response,
            },
          });
          await actionCreator(dispatch);
        });

        it('dispatches EDU_PAYMENT_INFORMATION_FETCH_SUCCEEDED and passes along the data it got from the endpoint', () => {
          expect(dispatch.secondCall.args[0].type).to.be.equal(
            paymentInformationActions.EDU_PAYMENT_INFORMATION_FETCH_SUCCEEDED,
          );
          expect(dispatch.secondCall.args[0].response).to.deep.equal({
            paymentAccount: response,
          });
        });

        it('reports the correct data to Google Analytics', () => {
          expect(recordEventSpy.firstCall.args[0].event).to.equal(
            'profile-get-edu-direct-deposit-started',
          );
          expect(recordEventSpy.secondCall.args[0].event).to.equal(
            'profile-get-edu-direct-deposit-retrieved',
          );
          expect(
            recordEventSpy.secondCall.args[0]['direct-deposit-setup-complete'],
          ).to.be.false;
        });
      });
    });

    describe('saveEDUPaymentInformation', () => {
      beforeEach(() => {
        setup({ mockGA: true });
        recordEventSpy = sinon.spy();
        captureErrorSpy = sinon.spy();
        actionCreator = paymentInformationActions.saveEDUPaymentInformation({
          fields: {
            data: 'value',
          },
          recordEvent: recordEventSpy,
          captureEDUError: captureErrorSpy,
        });
        dispatch = sinon.spy();
      });
      afterEach(teardown);

      it('calls fetch to `PUT profile/ch33_bank_accounts', async () => {
        await actionCreator(dispatch);

        expect(global.fetch.firstCall.args[1].method).to.equal('PUT');
        expect(
          global.fetch.firstCall.args[0].endsWith(
            '/profile/ch33_bank_accounts',
          ),
        ).to.be.true;
      });

      describe('if the call succeeds', () => {
        beforeEach(async () => {
          await actionCreator(dispatch);
        });

        it('dispatches EDU_PAYMENT_INFORMATION_SAVE_STARTED', async () => {
          expect(dispatch.firstCall.args[0].type).to.be.equal(
            paymentInformationActions.EDU_PAYMENT_INFORMATION_SAVE_STARTED,
          );
        });

        it('dispatches EDU_PAYMENT_INFORMATION_SAVE_SUCCEEDED', () => {
          expect(dispatch.secondCall.args[0].type).to.be.equal(
            paymentInformationActions.EDU_PAYMENT_INFORMATION_SAVE_SUCCEEDED,
          );
        });

        it('reports the correct data to Google Analytics', () => {
          const gaEvent = recordEventSpy.firstCall.args[0];
          expect(gaEvent.event).to.equal('profile-transaction');
          expect(gaEvent['profile-section']).to.equal(
            'edu-direct-deposit-information',
          );
        });
      });

      describe('if the call fails', async () => {
        beforeEach(async () => {
          setFetchJSONFailure(global.fetch.onFirstCall(), {
            errors: [
              {
                code: '135',
                detail: 'Routing number related to potential fraud',
                meta: {
                  messages: [
                    {
                      key: 'test.edu.error.message',
                      severity: 'ERROR',
                      text: 'Routing number related to potential fraud',
                    },
                  ],
                },
                source: 'EVSS::EDU::Service',
                status: '422',
                title: 'Potential Fraud',
              },
            ],
          });
          await actionCreator(dispatch);
        });

        it('dispatches EDU_PAYMENT_INFORMATION_SAVE_STARTED', async () => {
          expect(dispatch.firstCall.args[0].type).to.be.equal(
            paymentInformationActions.EDU_PAYMENT_INFORMATION_SAVE_STARTED,
          );
        });

        it('dispatches EDU_PAYMENT_INFORMATION_SAVE_FAILED', () => {
          expect(dispatch.secondCall.args[0].type).to.be.equal(
            paymentInformationActions.EDU_PAYMENT_INFORMATION_SAVE_FAILED,
          );
        });

        it('reports the correct data to Google Analytics', () => {
          const gaObject = recordEventSpy.firstCall.args[0];
          expect(gaObject.event).to.equal('profile-edit-failure');
          expect(gaObject['profile-action']).to.equal('save-failure');
          expect(gaObject['profile-section']).to.equal(
            'edu-direct-deposit-information',
          );
          expect(gaObject['error-key']).to.equal(
            'Potential Fraud-save-error-api-response',
          );
        });
      });
    });
  });

  describe('when `ga` is not set up correctly', () => {
    beforeEach(() => {
      setup({ mockGA: false });
      setFetchJSONResponse(global.fetch.onFirstCall(), {
        data: {
          attributes: {
            responses: [
              {
                paymentAccount: {
                  accountType: 'Savings',
                  financialInstitutionName: 'TD BANK NA',
                  accountNumber: '************4569',
                  financialInstitutionRoutingNumber: '*****3093',
                },
              },
            ],
          },
        },
      });
    });
    afterEach(teardown);

    describe('saveCNPPaymentInformation', () => {
      it('still calls fetch and dispatches the correct actions', async () => {
        const actionCreator = paymentInformationActions.saveCNPPaymentInformation(
          {
            fields: { test: 'value' },
          },
        );
        const dispatch = sinon.spy();

        await actionCreator(dispatch);

        expect(global.fetch.called).to.be.true;
        expect(dispatch.calledTwice).to.be.true;
        expect(dispatch.firstCall.args[0].type).to.be.equal(
          paymentInformationActions.CNP_PAYMENT_INFORMATION_SAVE_STARTED,
        );
        expect(dispatch.secondCall.args[0].type).to.be.equal(
          paymentInformationActions.CNP_PAYMENT_INFORMATION_SAVE_SUCCEEDED,
        );
      });
    });
  });
});

import { expect } from 'chai';
import sinon from 'sinon';

import {
  mockFetch,
  resetFetch,
  setFetchJSONFailure,
  setFetchJSONResponse,
} from 'platform/testing/unit/helpers';

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
  resetFetch();
  global.ga = oldGA;
};

describe('actions/paymentInformation', () => {
  describe('when global `ga` is set up correctly', () => {
    let actionCreator;
    let dispatch;
    let recordEventSpy;

    describe('fetchPaymentInformation', () => {
      beforeEach(() => {
        setup({ mockGA: true });
        recordEventSpy = sinon.spy();
        actionCreator = paymentInformationActions.fetchPaymentInformation(
          recordEventSpy,
        );
        dispatch = sinon.spy();
      });

      afterEach(teardown);

      it('calls fetch to `GET ppiu/payment_information`', async () => {
        await actionCreator(dispatch);

        expect(global.fetch.firstCall.args[1].method).to.equal('GET');
        expect(
          global.fetch.firstCall.args[0].endsWith('/ppiu/payment_information'),
        ).to.be.true;
      });

      it('dispatches FETCH_PAYMENT_INFORMATION_STARTED', async () => {
        await actionCreator(dispatch);

        expect(dispatch.firstCall.args[0].type).to.be.equal(
          paymentInformationActions.PAYMENT_INFORMATION_FETCH_STARTED,
        );
      });

      describe('if the call succeeds', () => {
        const paymentInfo = {
          controlInformation: {
            canUpdateAddress: true,
            corpAvailIndicator: true,
            corpRecFoundIndicator: true,
            hasNoBdnPaymentsIndicator: true,
            identityIndicator: true,
            isCompetentIndicator: true,
            indexIndicator: true,
            noFiduciaryAssignedIndicator: true,
            notDeceasedIndicator: true,
          },
          paymentAccount: {
            accountType: 'Checking',
            financialInstitutionName: 'COMERICA BANK',
            accountNumber: '*****6789',
            financialInstitutionRoutingNumber: '*****3133',
          },
          paymentAddress: {
            type: null,
            addressEffectiveDate: null,
            addressOne: null,
            addressTwo: null,
            addressThree: null,
            city: null,
            stateCode: null,
            zipCode: null,
            zipSuffix: null,
            countryName: null,
            militaryPostOfficeTypeCode: null,
            militaryStateCode: null,
          },
          paymentType: 'CNP',
        };

        beforeEach(async () => {
          setFetchJSONResponse(global.fetch.onFirstCall(), {
            data: {
              attributes: {
                responses: [paymentInfo],
              },
            },
          });
          await actionCreator(dispatch);
        });

        it('dispatches PAYMENT_INFORMATION_FETCH_SUCCEEDED and passes along the data it got from the endpoint', () => {
          expect(dispatch.secondCall.args[0].type).to.be.equal(
            paymentInformationActions.PAYMENT_INFORMATION_FETCH_SUCCEEDED,
          );
          expect(dispatch.secondCall.args[0].response).to.deep.equal({
            responses: [paymentInfo],
          });
        });

        it('reports the correct data to Google Analytics', () => {
          expect(recordEventSpy.firstCall.args[0].event).to.equal(
            'profile-get-direct-deposit-retrieved',
          );
        });
      });

      describe('if the call fails', () => {
        it('dispatches PAYMENT_INFORMATION_FETCH_FAILED', async () => {
          setFetchJSONFailure(global.fetch.onFirstCall(), {});
          await actionCreator(dispatch);

          expect(dispatch.firstCall.args[0].type).to.be.equal(
            paymentInformationActions.PAYMENT_INFORMATION_FETCH_STARTED,
          );
          expect(dispatch.secondCall.args[0].type).to.be.equal(
            paymentInformationActions.PAYMENT_INFORMATION_FETCH_FAILED,
          );
        });
      });
    });

    describe('savePaymentInformation', () => {
      beforeEach(() => {
        setup({ mockGA: true });
        recordEventSpy = sinon.spy();
        actionCreator = paymentInformationActions.savePaymentInformation(
          {
            data: 'value',
          },
          false,
          recordEventSpy,
        );
        dispatch = sinon.spy();
      });
      afterEach(teardown);

      it('calls fetch to `PUT ppiu/payment_information', async () => {
        await actionCreator(dispatch);

        expect(global.fetch.firstCall.args[1].method).to.equal('PUT');
        expect(
          global.fetch.firstCall.args[0].endsWith('/ppiu/payment_information'),
        ).to.be.true;
      });

      it('dispatches PAYMENT_INFORMATION_SAVE_STARTED', async () => {
        await actionCreator(dispatch);

        expect(dispatch.firstCall.args[0].type).to.be.equal(
          paymentInformationActions.PAYMENT_INFORMATION_SAVE_STARTED,
        );
      });

      describe('if the call succeeds', () => {
        beforeEach(async () => {
          await actionCreator(dispatch);
        });

        it('dispatches PAYMENT_INFORMATION_SAVE_SUCCEEDED', () => {
          expect(dispatch.secondCall.args[0].type).to.be.equal(
            paymentInformationActions.PAYMENT_INFORMATION_SAVE_SUCCEEDED,
          );
        });

        it('reports the correct data to Google Analytics', () => {
          expect(recordEventSpy.firstCall.args[0].event).to.equal(
            'profile-transaction',
          );
          expect(recordEventSpy.firstCall.args[0]['profile-section']).to.equal(
            'direct-deposit-information',
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
                      key: 'cnp.payment.routing.number.fraud.message',
                      severity: 'ERROR',
                      text: 'Routing number related to potential fraud',
                    },
                  ],
                },
                source: 'EVSS::PPIU::Service',
                status: '422',
                title: 'Potential Fraud',
              },
            ],
          });
          await actionCreator(dispatch);
        });

        it('dispatches PAYMENT_INFORMATION_SAVE_FAILED', () => {
          expect(dispatch.secondCall.args[0].type).to.be.equal(
            paymentInformationActions.PAYMENT_INFORMATION_SAVE_FAILED,
          );
        });

        it('reports the correct data to Google Analytics', () => {
          expect(recordEventSpy.firstCall.args[0]).to.deep.equal({
            event: 'profile-edit-failure',
            'profile-action': 'save-failure',
            'profile-section': 'direct-deposit-information',
            'error-key': 'routing-number-flagged-for-fraud-error-update',
          });
        });
      });
    });
  });

  describe('when `ga` is not set up correctly', () => {
    beforeEach(() => setup({ mockGA: false }));
    afterEach(teardown);

    describe('savePaymentInformation', () => {
      it('still calls fetch and dispatches SAVE_PAYMENT_INFORMATION', async () => {
        const actionCreator = paymentInformationActions.savePaymentInformation({
          data: 'value',
        });
        const dispatch = sinon.spy();

        await actionCreator(dispatch);

        expect(global.fetch.called).to.be.true;
        expect(dispatch.calledTwice).to.be.true;
        expect(dispatch.firstCall.args[0].type).to.be.equal(
          paymentInformationActions.PAYMENT_INFORMATION_SAVE_STARTED,
        );
        expect(dispatch.secondCall.args[0].type).to.be.equal(
          paymentInformationActions.PAYMENT_INFORMATION_SAVE_SUCCEEDED,
        );
      });
    });
  });
});

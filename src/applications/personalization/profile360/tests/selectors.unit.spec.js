import { expect } from 'chai';
import * as selectors from '../selectors';

describe('profile360 selectors', () => {
  describe('directDepositIsSetUp selector', () => {
    let state;
    beforeEach(() => {
      state = {
        vaProfile: {
          paymentInformation: {
            responses: [
              {
                paymentAccount: {
                  accountType: '',
                  financialInstitutionName: null,
                  accountNumber: '123123123',
                  financialInstitutionRoutingNumber: '',
                },
              },
            ],
          },
        },
      };
    });
    it('returns `true` if there is an account number set in state', () => {
      expect(selectors.directDepositIsSetUp(state)).to.be.true;
    });
    it('returns `false` when vaProfile does not exist on state', () => {
      delete state.vaProfile;
      expect(selectors.directDepositIsSetUp(state)).to.be.false;
    });
    it('returns `false` when vaProfile.paymentInformation is not set on state', () => {
      delete state.vaProfile.paymentInformation;
      expect(selectors.directDepositIsSetUp(state)).to.be.false;
    });
    it('returns `false` when the account number is not set', () => {
      state.vaProfile.paymentInformation.responses[0].paymentAccount.accountNumber =
        '';
      expect(selectors.directDepositIsSetUp(state)).to.be.false;
    });
    it('returns `false` when the payment info endpoint failed to get data', () => {
      state = {
        vaProfile: {
          paymentInformation: {
            errors: [
              {
                title: 'Bad Gateway',
                detail:
                  'Received an an invalid response from the upstream server',
                code: 'EVSS502',
                source: 'EVSS::PPIU::Service',
                status: '502',
              },
            ],
          },
        },
      };
      expect(selectors.directDepositIsSetUp(state)).to.be.false;
    });
  });

  describe('directDepositAddressIsSetUp selector', () => {
    let state;
    beforeEach(() => {
      state = {
        vaProfile: {
          paymentInformation: {
            responses: [
              {
                paymentAddress: {
                  addressOne: '123 Main',
                  city: 'San Francisco',
                  stateCode: 'CA',
                },
              },
            ],
          },
        },
      };
    });
    it('returns `true` if there is a street, city, and state set on the payment info payment address', () => {
      expect(selectors.directDepositAddressIsSetUp(state)).to.be.true;
    });
    it('returns `false` if the street address is missing', () => {
      state.vaProfile.paymentInformation.responses[0].paymentAddress.addressOne =
        '';
      expect(selectors.directDepositAddressIsSetUp(state)).to.be.false;
    });
    it('returns `false` if the city is missing', () => {
      state.vaProfile.paymentInformation.responses[0].paymentAddress.city = '';
      expect(selectors.directDepositAddressIsSetUp(state)).to.be.false;
    });
    it('returns `false` if the state is missing', () => {
      state.vaProfile.paymentInformation.responses[0].paymentAddress.stateCode =
        '';
      expect(selectors.directDepositAddressIsSetUp(state)).to.be.false;
    });

    it('returns `false` when the payment info endpoint failed to get data', () => {
      state = {
        vaProfile: {
          paymentInformation: {
            errors: [
              {
                title: 'Bad Gateway',
                detail:
                  'Received an an invalid response from the upstream server',
                code: 'EVSS502',
                source: 'EVSS::PPIU::Service',
                status: '502',
              },
            ],
          },
        },
      };
      expect(selectors.directDepositAddressIsSetUp(state)).to.be.false;
    });
  });
});

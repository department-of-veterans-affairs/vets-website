import { expect } from 'chai';
import * as selectors from '../selectors';

const getDirectDepositInfoError = {
  errors: [
    {
      title: 'Bad Gateway',
      detail: 'Received an an invalid response from the upstream server',
      code: 'EVSS502',
      source: 'EVSS::PPIU::Service',
      status: '502',
    },
  ],
};

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
            error: getDirectDepositInfoError,
          },
        },
      };
      expect(selectors.directDepositIsSetUp(state)).to.be.false;
    });
  });

  describe('directDepositLoadError', () => {
    it('returns the error if there is one', () => {
      const state = {
        vaProfile: {
          paymentInformation: {
            error: getDirectDepositInfoError,
          },
        },
      };
      expect(selectors.directDepositLoadError(state)).to.deep.equal(
        getDirectDepositInfoError,
      );
    });
    it('returns undefined if there are no errors', () => {
      const state = {
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
      expect(selectors.directDepositLoadError(state)).to.be.undefined;
    });
    it('returns undefined if payment info does not exist on the state', () => {
      let state = {};
      expect(selectors.directDepositLoadError(state)).to.be.undefined;
      state = { vaProfile: {} };
      expect(selectors.directDepositLoadError(state)).to.be.undefined;
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
            error: getDirectDepositInfoError,
          },
        },
      };
      expect(selectors.directDepositAddressIsSetUp(state)).to.be.false;
    });
  });

  describe('directDepositIsBlocked', () => {
    it('returns `false` if the isCompetentIndicator, noFiduciaryAssignedIndicator, and notDeceasedIndicator flags are all `true`', () => {
      const state = {
        vaProfile: {
          paymentInformation: {
            responses: [
              {
                controlInformation: {
                  isCompetentIndicator: true,
                  noFiduciaryAssignedIndicator: true,
                  notDeceasedIndicator: true,
                },
              },
            ],
          },
        },
      };
      expect(selectors.directDepositIsBlocked(state)).to.be.false;
    });
    it('returns `false` if the control information is not set', () => {
      const state = {
        vaProfile: {
          paymentInformation: {
            responses: [{ paymentInformation: {} }],
          },
        },
      };
      expect(selectors.directDepositIsBlocked(state)).to.be.false;
    });
    it('returns `true` if the `isCompetentIndicator` is not true', () => {
      const state = {
        vaProfile: {
          paymentInformation: {
            responses: [
              {
                controlInformation: {
                  isCompetentIndicator: null,
                  noFiduciaryAssignedIndicator: true,
                },
              },
            ],
          },
        },
      };
      expect(selectors.directDepositIsBlocked(state)).to.be.true;
    });
    it('returns `true` if the `noFiduciaryAssignedIndicator` is not true', () => {
      const state = {
        vaProfile: {
          paymentInformation: {
            responses: [
              {
                controlInformation: {
                  isCompetentIndicator: true,
                },
              },
            ],
          },
        },
      };
      expect(selectors.directDepositIsBlocked(state)).to.be.true;
    });
    it('returns `true` if the `notDeceasedIndicator` is not true', () => {
      const state = {
        vaProfile: {
          paymentInformation: {
            responses: [
              {
                controlInformation: {
                  isCompetentIndicator: true,
                  noFiduciaryAssignedIndicator: true,
                },
              },
            ],
          },
        },
      };
      expect(selectors.directDepositIsBlocked(state)).to.be.true;
    });
  });

  describe('directDepositUiState', () => {
    it('should return the correct part of the state`', () => {
      const state = {
        vaProfile: {
          paymentInformationUiState: {},
        },
      };
      expect(selectors.directDepositUiState(state)).to.deep.equal(
        state.vaProfile.paymentInformationUiState,
      );
    });
    it('should return undefined if vaProfile is not set on the state', () => {
      const state = {};
      expect(selectors.directDepositUiState(state)).to.equal(undefined);
    });
  });
});

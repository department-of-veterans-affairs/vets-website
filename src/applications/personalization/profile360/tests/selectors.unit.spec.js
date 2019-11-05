import { expect } from 'chai';
import * as selectors from '../selectors';

describe('profile360 selectors', () => {
  describe('profileShowDirectDeposit selector', () => {
    it('returns `true` if the `profileShowDirectDeposit` toggle value is set to `true`', () => {
      const state = {
        featureToggles: {
          profileShowDirectDeposit: true,
        },
      };
      expect(selectors.profileShowDirectDeposit(state)).to.be.true;
    });
    it('returns `false` if the `profileShowDirectDeposit` toggle value is set to `false`', () => {
      const state = {
        featureToggles: {
          profileShowDirectDeposit: false,
        },
      };
      expect(selectors.profileShowDirectDeposit(state)).to.be.false;
    });
    it('returns `undefined` if the `profileShowDirectDeposit` toggle value is not set', () => {
      const state = {
        featureToggles: {
          anotherFeatureFlagID: true,
        },
      };
      expect(selectors.profileShowDirectDeposit(state)).to.be.undefined;
    });
    it('returns `undefined` if the `featureToggles` are not set on the Redux store', () => {
      const state = {};
      expect(selectors.profileShowDirectDeposit(state)).to.be.undefined;
    });
  });

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
  });
});

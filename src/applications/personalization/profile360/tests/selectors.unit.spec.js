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
    test('returns `true` if there is an account number set in state', () => {
      expect(selectors.directDepositIsSetUp(state)).toBe(true);
    });
    test('returns `false` when vaProfile does not exist on state', () => {
      delete state.vaProfile;
      expect(selectors.directDepositIsSetUp(state)).toBe(false);
    });
    test('returns `false` when vaProfile.paymentInformation is not set on state', () => {
      delete state.vaProfile.paymentInformation;
      expect(selectors.directDepositIsSetUp(state)).toBe(false);
    });
    test('returns `false` when the account number is not set', () => {
      state.vaProfile.paymentInformation.responses[0].paymentAccount.accountNumber =
        '';
      expect(selectors.directDepositIsSetUp(state)).toBe(false);
    });
    test('returns `false` when the payment info endpoint failed to get data', () => {
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
      expect(selectors.directDepositIsSetUp(state)).toBe(false);
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
    test('returns `true` if there is a street, city, and state set on the payment info payment address', () => {
      expect(selectors.directDepositAddressIsSetUp(state)).toBe(true);
    });
    test('returns `false` if the street address is missing', () => {
      state.vaProfile.paymentInformation.responses[0].paymentAddress.addressOne =
        '';
      expect(selectors.directDepositAddressIsSetUp(state)).toBe(false);
    });
    test('returns `false` if the city is missing', () => {
      state.vaProfile.paymentInformation.responses[0].paymentAddress.city = '';
      expect(selectors.directDepositAddressIsSetUp(state)).toBe(false);
    });
    test('returns `false` if the state is missing', () => {
      state.vaProfile.paymentInformation.responses[0].paymentAddress.stateCode =
        '';
      expect(selectors.directDepositAddressIsSetUp(state)).toBe(false);
    });

    test('returns `false` when the payment info endpoint failed to get data', () => {
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
      expect(selectors.directDepositAddressIsSetUp(state)).toBe(false);
    });
  });

  describe('directDepositIsBlocked', () => {
    test('returns `false` if the `paymentInformation` is not set`', () => {
      const state = {
        vaProfile: {},
      };
      expect(selectors.directDepositIsBlocked(state)).toBe(false);
    });
    test('returns `false` if the `canUpdateAddress` flag is `true`', () => {
      const state = {
        vaProfile: {
          paymentInformation: {
            responses: [
              {
                controlInformation: {
                  canUpdateAddress: true,
                },
              },
            ],
          },
        },
      };
      expect(selectors.directDepositIsBlocked(state)).toBe(false);
    });
    test('returns `true` if the `canUpdateAddress` flag is not `true`', () => {
      const state = {
        vaProfile: {
          paymentInformation: {
            responses: [
              {
                controlInformation: {
                  canUpdateAddress: null,
                },
              },
            ],
          },
        },
      };
      expect(selectors.directDepositIsBlocked(state)).toBe(true);
    });
  });
});

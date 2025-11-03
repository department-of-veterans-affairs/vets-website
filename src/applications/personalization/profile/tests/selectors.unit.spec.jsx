import { expect } from 'chai';
import * as selectors from '../selectors';

const errors = [{ name: 'error1' }, { name: 'error2' }];

describe('profile selectors', () => {
  describe('cnpDirectDepositIsSetUp selector', () => {
    let state;
    beforeEach(() => {
      state = {
        vaProfile: {
          cnpPaymentInformation: {
            paymentAccount: {
              accountType: '',
              financialInstitutionName: null,
              accountNumber: '123123123',
              financialInstitutionRoutingNumber: '',
            },
          },
        },
      };
    });
    it('returns `true` if there is an account number set in state', () => {
      expect(selectors.cnpDirectDepositIsSetUp(state)).to.be.true;
    });
    it('returns `false` when vaProfile does not exist on state', () => {
      delete state.vaProfile;
      expect(selectors.cnpDirectDepositIsSetUp(state)).to.be.false;
    });
    it('returns `false` when vaProfile.cnpPaymentInformation is not set on state', () => {
      delete state.vaProfile.cnpPaymentInformation;
      expect(selectors.cnpDirectDepositIsSetUp(state)).to.be.false;
    });
    it('returns `false` when the account number is not set', () => {
      state.vaProfile.cnpPaymentInformation.paymentAccount.accountNumber = '';
      expect(selectors.cnpDirectDepositIsSetUp(state)).to.be.false;
    });
  });

  describe('cnpDirectDepositLoadError', () => {
    it('returns undefined if there are no errors', () => {
      const state = {
        vaProfile: {
          cnpPaymentInformation: {
            paymentAccount: {
              accountType: '',
              financialInstitutionName: null,
              accountNumber: '123123123',
              financialInstitutionRoutingNumber: '',
            },
          },
        },
      };
      expect(selectors.cnpDirectDepositLoadError(state)).to.be.undefined;
    });
    it('returns undefined if payment info does not exist on the state', () => {
      let state = {};
      expect(selectors.cnpDirectDepositLoadError(state)).to.be.undefined;
      state = { vaProfile: {} };
      expect(selectors.cnpDirectDepositLoadError(state)).to.be.undefined;
    });
  });

  describe('cnpDirectDepositIsEligible selector', () => {
    let state;

    beforeEach(() => {
      state = {
        vaProfile: {
          cnpPaymentInformation: {
            controlInformation: {
              canUpdateDirectDeposit: true,
            },
          },
        },
      };
    });

    it('returns `true` if control info canUpdateDirectDeposit is true', () => {
      expect(selectors.cnpDirectDepositIsEligible(state)).to.be.true;
    });

    it('returns `false` if control info canUpdateDirectDeposit is false', () => {
      state.vaProfile.cnpPaymentInformation.controlInformation.canUpdateDirectDeposit = false;
      expect(selectors.cnpDirectDepositIsEligible(state)).to.be.false;
    });
  });

  describe('selectIsBlocked', () => {
    it('returns `false` if the isCompetentIndicator, noFiduciaryAssignedIndicator, and notDeceasedIndicator flags are all `true`', () => {
      const state = {
        vaProfile: {
          cnpPaymentInformation: {
            controlInformation: {
              isCompetentIndicator: true,
              noFiduciaryAssignedIndicator: true,
              notDeceasedIndicator: true,
            },
          },
        },
        directDeposit: {
          controlInformation: {},
        },
      };
      expect(selectors.selectIsBlocked(state)).to.be.false;
    });
    it('returns `false` if the control information is not set', () => {
      const state = {
        vaProfile: {
          cnpPaymentInformation: {},
        },
        directDeposit: {
          controlInformation: {},
        },
      };
      expect(selectors.selectIsBlocked(state)).to.be.false;
    });
    it('returns `true` if the `isCompetent` is not true', () => {
      const state = {
        vaProfile: {
          cnpPaymentInformation: {
            controlInformation: {
              isCompetent: false,
            },
          },
        },
        directDeposit: {
          controlInformation: { isCompetent: false },
        },
      };
      expect(selectors.selectIsBlocked(state)).to.be.true;
    });
    it('returns `true` if the `hasNoFiduciaryAssigned` is not true', () => {
      const state = {
        vaProfile: {
          cnpPaymentInformation: {
            controlInformation: {
              hasNoFiduciaryAssigned: false,
            },
          },
        },
        directDeposit: {
          controlInformation: {
            hasNoFiduciaryAssigned: false,
          },
        },
      };
      expect(selectors.selectIsBlocked(state)).to.be.true;
    });
    it('returns `true` if the `isNotDeceased` is not true', () => {
      const state = {
        vaProfile: {
          cnpPaymentInformation: {
            controlInformation: {
              isNotDeceased: false,
            },
          },
        },
        directDeposit: {
          controlInformation: {
            isNotDeceased: false,
          },
        },
      };
      expect(selectors.selectIsBlocked(state)).to.be.true;
    });
    it('returns `false` if property exists but is `true` (should NOT block)', () => {
      const state = {
        vaProfile: {
          cnpPaymentInformation: {
            controlInformation: {
              isCompetent: true,
            },
          },
        },
        directDeposit: {
          controlInformation: {
            isCompetent: true,
            hasNoFiduciaryAssigned: true,
            isNotDeceased: true,
          },
        },
      };
      expect(selectors.selectIsBlocked(state)).to.be.false;
    });
    it('returns `false` if property does not exist at all (should NOT block)', () => {
      const state = {
        vaProfile: {
          cnpPaymentInformation: {
            controlInformation: {
              someOtherProperty: 'value',
            },
          },
        },
        directDeposit: {
          controlInformation: {
            someOtherProperty: 'value',
            // isCompetent, hasNoFiduciaryAssigned, and isNotDeceased are missing
          },
        },
      };
      expect(selectors.selectIsBlocked(state)).to.be.false;
    });
    it('returns `true` when multiple blocking properties are false simultaneously', () => {
      const state = {
        vaProfile: {
          cnpPaymentInformation: {
            controlInformation: {
              isCompetent: false,
              hasNoFiduciaryAssigned: false,
            },
          },
        },
        directDeposit: {
          controlInformation: {
            isCompetent: false,
            hasNoFiduciaryAssigned: false,
            isNotDeceased: false,
          },
        },
      };
      expect(selectors.selectIsBlocked(state)).to.be.true;
    });
    it('returns `false` when has() returns false (property does not exist)', () => {
      const state = {
        vaProfile: {
          cnpPaymentInformation: {
            controlInformation: {},
          },
        },
        directDeposit: {
          controlInformation: {
            // None of the checked properties exist
          },
        },
      };
      expect(selectors.selectIsBlocked(state)).to.be.false;
    });
    it('returns `false` when directDeposit.controlInformation is undefined', () => {
      const state = {
        vaProfile: {
          cnpPaymentInformation: {
            controlInformation: {},
          },
        },
        directDeposit: {},
      };
      expect(selectors.selectIsBlocked(state)).to.be.false;
    });
    it('returns `false` when directDeposit.controlInformation is null', () => {
      const state = {
        vaProfile: {
          cnpPaymentInformation: {
            controlInformation: {},
          },
        },
        directDeposit: {
          controlInformation: null,
        },
      };
      expect(selectors.selectIsBlocked(state)).to.be.false;
    });
  });

  describe('cnpDirectDepositUiState', () => {
    it('should return the correct part of the state`', () => {
      const state = {
        vaProfile: {
          cnpPaymentInformationUiState: {},
        },
      };
      expect(selectors.cnpDirectDepositUiState(state)).to.deep.equal(
        state.vaProfile.cnpPaymentInformationUiState,
      );
    });
    it('should return undefined if vaProfile is not set on the state', () => {
      const state = {};
      expect(selectors.cnpDirectDepositUiState(state)).to.equal(undefined);
    });
  });

  describe('eduDirectDepositInformation', () => {
    it('should return the correct part of the state', () => {
      const paymentInformation = {
        accountNumber: null,
        routingNumber: null,
      };
      const state = {
        vaProfile: {
          eduPaymentInformation: paymentInformation,
        },
      };

      expect(selectors.eduDirectDepositInformation(state)).to.deep.equal(
        paymentInformation,
      );
    });
  });

  describe('eduDirectDepositUiState', () => {
    it('should return the correct part of the state', () => {
      const uiState = {
        foo: 'bar',
      };
      const state = {
        vaProfile: {
          eduPaymentInformationUiState: uiState,
        },
      };

      expect(selectors.eduDirectDepositUiState(state)).to.deep.equal(uiState);
    });
  });

  describe('eduDirectDepositAccountInformation', () => {
    it('should return the correct part of the state', () => {
      const accountInfo = {
        accountNumber: null,
        routingNumber: null,
      };
      const state = {
        vaProfile: {
          eduPaymentInformation: {
            paymentAccount: accountInfo,
          },
        },
      };

      expect(selectors.eduDirectDepositAccountInformation(state)).to.deep.equal(
        accountInfo,
      );
    });
  });

  describe('eduDirectDepositIsSetUp', () => {
    it('returns `true` when an account number is set', () => {
      const accountInfo = {
        accountNumber: '123',
        routingNumber: '456',
      };
      const state = {
        vaProfile: {
          eduPaymentInformation: {
            paymentAccount: accountInfo,
          },
        },
      };

      expect(selectors.eduDirectDepositIsSetUp(state)).to.be.true;
    });

    it('returns `false` when an account number is not set', () => {
      const accountInfo = {
        accountNumber: null,
        routingNumber: null,
      };
      const state = {
        vaProfile: {
          eduPaymentInformation: {
            paymentAccount: accountInfo,
          },
        },
      };

      expect(selectors.eduDirectDepositIsSetUp(state)).to.be.false;
    });
  });

  describe('eduDirectDepositLoadError', () => {
    it('returns any non-403 errors that exist', () => {
      const error = {
        errors: [
          {
            code: '401',
          },
        ],
      };
      const state = {
        vaProfile: {
          eduPaymentInformation: {
            error,
          },
        },
      };

      expect(selectors.eduDirectDepositLoadError(state)).to.deep.equal(error);

      state.vaProfile.eduPaymentInformation.error.errors.push({
        code: '403',
      });

      expect(selectors.eduDirectDepositLoadError(state)).to.deep.equal(error);
    });
    it('returns the error if it is not an object with an errors array', () => {
      const error = {
        code: '500',
      };
      const state = {
        vaProfile: {
          eduPaymentInformation: {
            error,
          },
        },
      };
      expect(selectors.eduDirectDepositLoadError(state)).to.deep.equal(error);
    });
    it('returns undefined if the error data only contains 403 errors', () => {
      const error = {
        errors: [
          {
            code: '403',
          },
        ],
      };
      const state = {
        vaProfile: {
          eduPaymentInformation: {
            error,
          },
        },
      };

      expect(selectors.eduDirectDepositLoadError(state)).to.be.undefined;

      state.vaProfile.eduPaymentInformation.error.errors.push({
        code: '403',
      });

      expect(selectors.eduDirectDepositLoadError(state)).to.be.undefined;
    });

    it('returns `undefined` when there is no error', () => {
      const accountInfo = {
        accountNumber: null,
        routingNumber: null,
      };
      const state = {
        vaProfile: {
          eduPaymentInformation: {
            paymentAccount: accountInfo,
          },
        },
      };

      expect(selectors.eduDirectDepositLoadError(state)).to.be.undefined;
    });
    it('returns filtered errors when there are mixed 403 and non-403 errors', () => {
      const error = {
        errors: [
          {
            code: '403',
          },
          {
            code: '401',
          },
          {
            code: '403',
          },
          {
            code: '500',
          },
        ],
      };
      const state = {
        vaProfile: {
          eduPaymentInformation: {
            error,
          },
        },
      };

      const result = selectors.eduDirectDepositLoadError(state);
      expect(result).to.not.be.undefined;
      expect(result.errors).to.have.length(2);
      expect(result.errors[0].code).to.equal('401');
      expect(result.errors[1].code).to.equal('500');
    });
    it('returns undefined when error object has empty errors array after filtering out 403s', () => {
      const error = {
        errors: [
          {
            code: '403',
          },
          {
            code: '403',
          },
        ],
      };
      const state = {
        vaProfile: {
          eduPaymentInformation: {
            error,
          },
        },
      };

      expect(selectors.eduDirectDepositLoadError(state)).to.be.undefined;
    });
  });

  describe('personalInformationLoadError', () => {
    it('should return the error data if it exists', () => {
      const state = {
        vaProfile: {
          personalInformation: {
            errors,
          },
        },
      };
      expect(selectors.personalInformationLoadError(state)).to.deep.equal(
        errors,
      );
    });
    it('should return undefined if there are no errors', () => {
      const state = {
        vaProfile: {
          personalInformation: {},
        },
      };
      expect(selectors.personalInformationLoadError(state)).to.be.undefined;
    });
    it('should return undefined if personalInformation info does not exist on the state', () => {
      let state = {};
      expect(selectors.personalInformationLoadError(state)).to.be.undefined;
      state = { vaProfile: {} };
      expect(selectors.personalInformationLoadError(state)).to.be.undefined;
    });
    it('should return error (singular) when error exists but errors (plural) does not', () => {
      const error = { message: 'Something went wrong' };
      const state = {
        vaProfile: {
          personalInformation: {
            error,
          },
        },
      };
      expect(selectors.personalInformationLoadError(state)).to.deep.equal(
        error,
      );
    });
    it('should prioritize errors (plural) when both error and errors exist', () => {
      const error = { message: 'Single error' };
      const errorsArray = [{ name: 'error1' }, { name: 'error2' }];
      const state = {
        vaProfile: {
          personalInformation: {
            error,
            errors: errorsArray,
          },
        },
      };
      expect(selectors.personalInformationLoadError(state)).to.deep.equal(
        errorsArray,
      );
    });
  });

  describe('militaryInformationLoadError', () => {
    it('should return the error data if it exists', () => {
      const state = {
        vaProfile: {
          militaryInformation: {
            serviceHistory: {
              error: errors,
            },
          },
        },
      };
      expect(selectors.militaryInformationLoadError(state)).to.deep.equal(
        errors,
      );
    });
    it('should return undefined if there are no errors', () => {
      const state = {
        vaProfile: {
          militaryInformation: {
            serviceHistory: {},
          },
        },
      };
      expect(selectors.militaryInformationLoadError(state)).to.be.undefined;
    });
    it('should return undefined if militaryInformation info does not exist on the state', () => {
      let state = {};
      expect(selectors.militaryInformationLoadError(state)).to.be.undefined;
      state = { vaProfile: {} };
      expect(selectors.militaryInformationLoadError(state)).to.be.undefined;
    });
  });

  describe('selectHasRetiringSignInService', () => {
    it('returns `true` when serviceName is DS_LOGON', () => {
      const state = {
        user: {
          profile: {
            signIn: {
              serviceName: 'dslogon',
            },
          },
        },
      };
      expect(selectors.selectHasRetiringSignInService(state)).to.be.true;
    });
    it('returns `true` when serviceName is MHV', () => {
      const state = {
        user: {
          profile: {
            signIn: {
              serviceName: 'mhv',
            },
          },
        },
      };
      expect(selectors.selectHasRetiringSignInService(state)).to.be.true;
    });
    it('returns `true` when serviceName is undefined', () => {
      const state = {
        user: {
          profile: {
            signIn: {},
          },
        },
      };
      expect(selectors.selectHasRetiringSignInService(state)).to.be.true;
    });
    it('returns `true` when serviceName is null', () => {
      const state = {
        user: {
          profile: {
            signIn: {
              serviceName: null,
            },
          },
        },
      };
      expect(selectors.selectHasRetiringSignInService(state)).to.be.true;
    });
    it('returns `false` when serviceName is ID_ME', () => {
      const state = {
        user: {
          profile: {
            signIn: {
              serviceName: 'idme',
            },
          },
        },
      };
      expect(selectors.selectHasRetiringSignInService(state)).to.be.false;
    });
    it('returns `false` when serviceName is LOGIN_GOV', () => {
      const state = {
        user: {
          profile: {
            signIn: {
              serviceName: 'logingov',
            },
          },
        },
      };
      expect(selectors.selectHasRetiringSignInService(state)).to.be.false;
    });
    it('returns `true` when user.profile.signIn is missing', () => {
      const state = {
        user: {
          profile: {},
        },
      };
      expect(selectors.selectHasRetiringSignInService(state)).to.be.true;
    });
    it('returns `true` when user.profile is missing', () => {
      const state = {
        user: {},
      };
      expect(selectors.selectHasRetiringSignInService(state)).to.be.true;
    });
    it('returns `true` when user is missing', () => {
      const state = {};
      expect(selectors.selectHasRetiringSignInService(state)).to.be.true;
    });
  });

  describe('selectShowCredRetirementMessaging', () => {
    it('returns `true` when toggle is enabled and user has retiring sign in service', () => {
      const state = {
        featureToggles: {
          // eslint-disable-next-line camelcase
          profile_show_credential_retirement_messaging: true,
        },
        user: {
          profile: {
            signIn: {
              serviceName: 'dslogon',
            },
          },
        },
      };
      expect(selectors.selectShowCredRetirementMessaging(state)).to.be.true;
    });
    it('returns `false` when toggle is enabled but user does not have retiring sign in service', () => {
      const state = {
        featureToggles: {
          // eslint-disable-next-line camelcase
          profile_show_credential_retirement_messaging: true,
        },
        user: {
          profile: {
            signIn: {
              serviceName: 'idme',
            },
          },
        },
      };
      expect(selectors.selectShowCredRetirementMessaging(state)).to.be.false;
    });
    it('returns `false` when toggle is disabled even if user has retiring sign in service', () => {
      const state = {
        featureToggles: {
          // eslint-disable-next-line camelcase
          profile_show_credential_retirement_messaging: false,
        },
        user: {
          profile: {
            signIn: {
              serviceName: 'mhv',
            },
          },
        },
      };
      expect(selectors.selectShowCredRetirementMessaging(state)).to.be.false;
    });
    it('returns `undefined` when toggle is undefined', () => {
      const state = {
        featureToggles: {},
        user: {
          profile: {
            signIn: {
              serviceName: 'dslogon',
            },
          },
        },
      };
      // When toggle is undefined, undefined && true returns undefined
      expect(selectors.selectShowCredRetirementMessaging(state)).to.be
        .undefined;
    });
    it('returns `undefined` when featureToggles is missing', () => {
      const state = {
        user: {
          profile: {
            signIn: {
              serviceName: 'dslogon',
            },
          },
        },
      };
      // When featureToggles is missing, toggle is undefined, so undefined && true returns undefined
      expect(selectors.selectShowCredRetirementMessaging(state)).to.be
        .undefined;
    });
  });

  describe('togglesAreLoaded', () => {
    it('returns `true` when feature toggles loading is false', () => {
      const state = {
        featureToggles: {
          loading: false,
        },
      };
      expect(selectors.togglesAreLoaded(state)).to.be.true;
    });
    it('returns `false` when feature toggles loading is true', () => {
      const state = {
        featureToggles: {
          loading: true,
        },
      };
      expect(selectors.togglesAreLoaded(state)).to.be.false;
    });
    it('returns `true` when feature toggles loading is undefined', () => {
      const state = {
        featureToggles: {},
      };
      expect(selectors.togglesAreLoaded(state)).to.be.true;
    });
    it('returns `true` when featureToggles is missing', () => {
      const state = {};
      expect(selectors.togglesAreLoaded(state)).to.be.true;
    });
  });

  describe('selectProfileToggles', () => {
    it('returns profile toggles with loading state when feature toggles are available', () => {
      const state = {
        featureToggles: {
          loading: false,
          // eslint-disable-next-line camelcase
          profile_show_pronouns_and_sexual_orientation: true,
          // eslint-disable-next-line camelcase
          profile_hide_direct_deposit: false,
        },
      };
      const result = selectors.selectProfileToggles(state);
      expect(result).to.have.property('loading', false);
      expect(result).to.have.property(
        'profileShowPronounsAndSexualOrientation',
      );
      expect(result.profileShowPronounsAndSexualOrientation).to.be.true;
      expect(result).to.have.property('profileHideDirectDeposit');
      expect(result.profileHideDirectDeposit).to.be.false;
    });
    it('returns profile toggles with loading true when feature toggles are loading', () => {
      const state = {
        featureToggles: {
          loading: true,
          // eslint-disable-next-line camelcase
          profile_show_pronouns_and_sexual_orientation: false,
        },
      };
      const result = selectors.selectProfileToggles(state);
      expect(result).to.have.property('loading', true);
      expect(result.profileShowPronounsAndSexualOrientation).to.be.false;
    });
    it('returns profile toggles with undefined values when feature toggles are not set', () => {
      const state = {
        featureToggles: {},
      };
      const result = selectors.selectProfileToggles(state);
      expect(result).to.have.property('loading', undefined);
      expect(result).to.have.property(
        'profileShowPronounsAndSexualOrientation',
      );
      // When feature flag doesn't exist in state, value is undefined (not the default)
      expect(result.profileShowPronounsAndSexualOrientation).to.be.undefined;
      expect(result).to.have.property('profileHideDirectDeposit');
      expect(result.profileHideDirectDeposit).to.be.undefined;
    });
    it('returns profile toggles with undefined values when featureToggles is missing', () => {
      const state = {};
      const result = selectors.selectProfileToggles(state);
      expect(result).to.have.property('loading', undefined);
      // When feature flag doesn't exist in state, value is undefined
      expect(result.profileShowPronounsAndSexualOrientation).to.be.undefined;
    });
  });
});

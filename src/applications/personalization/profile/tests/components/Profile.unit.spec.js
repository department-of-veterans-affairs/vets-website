import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import backendServices from 'platform/user/profile/constants/backendServices';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';

import {
  ProfileUnconnected as Profile,
  mapStateToProps,
} from '../../components/Profile';

describe('Profile', () => {
  let defaultProps;
  let fetchFullNameSpy;
  let fetchMilitaryInfoSpy;
  let fetchMHVAccountSpy;
  let fetchCNPPaymentInfoSpy;
  let fetchPersonalInfoSpy;
  let fetchTotalDisabilityRatingSpy;

  beforeEach(() => {
    fetchFullNameSpy = sinon.spy();
    fetchMilitaryInfoSpy = sinon.spy();
    fetchMHVAccountSpy = sinon.spy();
    fetchCNPPaymentInfoSpy = sinon.spy();
    fetchPersonalInfoSpy = sinon.spy();
    fetchTotalDisabilityRatingSpy = sinon.spy();

    defaultProps = {
      fetchFullName: fetchFullNameSpy,
      fetchMHVAccount: fetchMHVAccountSpy,
      fetchMilitaryInformation: fetchMilitaryInfoSpy,
      fetchCNPPaymentInformation: fetchCNPPaymentInfoSpy,
      fetchPersonalInformation: fetchPersonalInfoSpy,
      fetchTotalDisabilityRating: fetchTotalDisabilityRatingSpy,
      shouldFetchCNPDirectDepositInformation: true,
      shouldFetchTotalDisabilityRating: true,
      showLoader: false,
      user: {},
      location: {
        pathname: '/profile/personal-information',
      },
    };
  });

  it('renders a RequiredLoginView component that requires the USER_PROFILE', () => {
    const wrapper = shallow(<Profile {...defaultProps} />);
    expect(wrapper.type()).to.equal(RequiredLoginView);
    expect(wrapper.prop('serviceRequired')).to.equal(
      backendServices.USER_PROFILE,
    );
    wrapper.unmount();
  });

  it('should render a spinner if it is loading data', () => {
    defaultProps.showLoader = true;
    const wrapper = shallow(<Profile {...defaultProps} />);
    wrapper.setProps({ showLoader: true });
    const loader = wrapper.find('RequiredLoginLoader');
    expect(loader.length).to.equal(1);
    wrapper.unmount();
  });

  describe('when the component mounts', () => {
    it('should fetch the military information data', () => {
      const wrapper = shallow(<Profile {...defaultProps} />);
      expect(fetchMilitaryInfoSpy.called).to.be.true;
      wrapper.unmount();
    });

    it('should fetch the full name data', () => {
      const wrapper = shallow(<Profile {...defaultProps} />);
      expect(fetchFullNameSpy.called).to.be.true;
      wrapper.unmount();
    });

    it('should fetch the personal information data', () => {
      const wrapper = shallow(<Profile {...defaultProps} />);
      expect(fetchPersonalInfoSpy.called).to.be.true;
      wrapper.unmount();
    });

    it('should fetch the My HealtheVet data', () => {
      const wrapper = shallow(<Profile {...defaultProps} />);
      expect(fetchMHVAccountSpy.called).to.be.true;
      wrapper.unmount();
    });

    describe('when `shouldFetchCNPDirectDepositInformation` is `true`', () => {
      it('should fetch the payment information data', () => {
        const wrapper = shallow(<Profile {...defaultProps} />);
        expect(fetchCNPPaymentInfoSpy.called).to.be.true;
        wrapper.unmount();
      });
    });

    describe('when `shouldFetchCNPDirectDepositInformation` is `false`', () => {
      it('should not fetch the payment information data', () => {
        defaultProps.shouldFetchCNPDirectDepositInformation = false;
        const wrapper = shallow(<Profile {...defaultProps} />);
        expect(fetchCNPPaymentInfoSpy.called).to.be.false;
        wrapper.unmount();
      });
    });

    describe('when `shouldFetchTotalDisabilityRating` is `true`', () => {
      it('should fetch the total disability rating', () => {
        defaultProps.shouldFetchTotalDisabilityRating = true;
        const wrapper = shallow(<Profile {...defaultProps} />);
        expect(fetchTotalDisabilityRatingSpy.called).to.be.true;
        wrapper.unmount();
      });
    });

    describe('when `shouldFetchTotalDisabilityRating` is `false`', () => {
      it('should not fetch the total disability rating', () => {
        defaultProps.shouldFetchTotalDisabilityRating = false;
        const wrapper = shallow(<Profile {...defaultProps} />);
        expect(fetchTotalDisabilityRatingSpy.called).to.be.false;
        wrapper.unmount();
      });
    });
  });

  describe('when the component updates', () => {
    describe('when `shouldFetchCNPDirectDepositInformation` goes from `false` to `true', () => {
      it('should fetch the payment information data', () => {
        defaultProps.shouldFetchCNPDirectDepositInformation = false;
        const wrapper = shallow(<Profile {...defaultProps} />);
        expect(fetchCNPPaymentInfoSpy.called).to.be.false;
        wrapper.setProps({ shouldFetchCNPDirectDepositInformation: true });
        expect(fetchCNPPaymentInfoSpy.called).to.be.true;
        wrapper.unmount();
      });
    });
  });
});

describe('mapStateToProps', () => {
  const makeDefaultProfileState = () => ({
    multifactor: true,
    services: ['evss-claims'],
    mhvAccount: {
      accountState: 'needs_terms_acceptance',
      errors: null,
      loading: false,
    },
    veteranStatus: {
      servedInMilitary: true,
    },
    loa: {
      current: 3,
    },
  });
  const makeDefaultVaProfileState = () => ({
    hero: {
      userFullName: {
        first: 'Wesley',
        middle: 'Watson',
        last: 'Ford',
        suffix: null,
      },
    },
    personalInformation: {
      gender: 'M',
      birthDate: '1986-05-06',
    },
    militaryInformation: {
      serviceHistory: {
        serviceHistory: [
          {
            branchOfService: 'Air Force',
            beginDate: '2009-04-12',
            endDate: '2013-04-11',
            personnelCategoryTypeCode: 'V',
          },
        ],
      },
    },
    cnpPaymentInformation: {
      responses: [
        {
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
            accountType: '',
            financialInstitutionName: null,
            accountNumber: '',
            financialInstitutionRoutingNumber: '',
          },
          paymentAddress: {
            type: 'DOMESTIC',
            addressEffectiveDate: '2016-12-16T06:00:00.000+00:00',
            addressOne: '123 MAIN ST',
            addressTwo: '',
            addressThree: '',
            city: 'TAMPA',
            stateCode: 'FL',
            zipCode: '12345',
            zipSuffix: '1234',
            countryName: 'TAMPA',
            militaryPostOfficeTypeCode: null,
            militaryStateCode: null,
          },
          paymentType: 'CNP',
        },
      ],
    },
  });
  const makeDefaultState = () => ({
    user: {
      profile: makeDefaultProfileState(),
      login: {
        currentlyLoggedIn: true,
      },
    },
    vaProfile: makeDefaultVaProfileState(),
    totalRating: {
      totalDisabilityRating: null,
    },
  });

  it('returns an object with the correct keys', () => {
    const state = makeDefaultState();
    const props = mapStateToProps(state);
    const expectedKeys = [
      'user',
      'showLoader',
      'isInMVI',
      'isLOA3',
      'shouldFetchCNPDirectDepositInformation',
      'shouldFetchEDUDirectDepositInformation',
      'shouldFetchTotalDisabilityRating',
      'shouldShowDirectDeposit',
      'isDowntimeWarningDismissed',
    ];
    expect(Object.keys(props)).to.deep.equal(expectedKeys);
  });

  describe('#user', () => {
    it('is pulled from state.user', () => {
      const state = makeDefaultState();
      const props = mapStateToProps(state);
      expect(props.user).to.deep.equal(state.user);
    });
  });

  describe('#shouldFetchCNPDirectDepositInformation', () => {
    it('is `true` when user has 2FA set and has access to EVSS', () => {
      const state = makeDefaultState();
      const props = mapStateToProps(state);
      expect(props.shouldFetchCNPDirectDepositInformation).to.be.true;
    });

    it('is `false` when user has 2FA set but does not have access to EVSS', () => {
      const state = makeDefaultState();
      state.user.profile.services = [];
      const props = mapStateToProps(state);
      expect(props.shouldFetchCNPDirectDepositInformation).to.be.false;
    });

    it('is `false` when the user has access to EVSS but does not have 2FA set', () => {
      const state = makeDefaultState();
      state.user.profile.multifactor = false;
      const props = mapStateToProps(state);
      expect(props.shouldFetchCNPDirectDepositInformation).to.be.false;
    });

    it('is `false` when the user does not have 2FA set and does not have access to EVSS', () => {
      const state = makeDefaultState();
      state.user.profile.multifactor = false;
      state.user.profile.services = [];
      const props = mapStateToProps(state);
      expect(props.shouldFetchCNPDirectDepositInformation).to.be.false;
    });
  });

  describe('#shouldShowDirectDeposit', () => {
    describe('when direct deposit info should not be fetched because EVSS is not available', () => {
      it('should be `false`', () => {
        const state = makeDefaultState();
        state.user.profile.services = [];
        // since EVSS is not in `services`, the `cnpPaymentInformation` will not
        // be populated since we'll never make the call to get that data
        state.vaProfile.cnpPaymentInformation = null;
        const props = mapStateToProps(state);
        expect(props.shouldShowDirectDeposit).to.be.false;
      });
    });
    describe('when direct deposit info should not be fetched because user has not set up 2FA', () => {
      it('should be `true`', () => {
        const state = makeDefaultState();
        state.user.profile.multifactor = false;
        const props = mapStateToProps(state);
        expect(props.shouldShowDirectDeposit).to.be.true;
      });
    });

    describe('when user is flagged as incompetent', () => {
      it('should be `false`', () => {
        const state = makeDefaultState();
        state.vaProfile.cnpPaymentInformation.responses[0].controlInformation.isCompetentIndicator = false;
        const props = mapStateToProps(state);
        expect(props.shouldShowDirectDeposit).to.be.false;
      });
    });
    describe('when user has a fiduciary assigned', () => {
      it('should be `false`', () => {
        const state = makeDefaultState();
        state.vaProfile.cnpPaymentInformation.responses[0].controlInformation.noFiduciaryAssignedIndicator = false;
        const props = mapStateToProps(state);
        expect(props.shouldShowDirectDeposit).to.be.false;
      });
    });
    describe('when user is deceased', () => {
      it('should be `false`', () => {
        const state = makeDefaultState();
        state.vaProfile.cnpPaymentInformation.responses[0].controlInformation.notDeceasedIndicator = false;
        const props = mapStateToProps(state);
        expect(props.shouldShowDirectDeposit).to.be.false;
      });
    });
    describe('when direct deposit is not already set up and they are not eligible to sign up', () => {
      it('should be `false`', () => {
        const state = makeDefaultState();
        state.vaProfile.cnpPaymentInformation.responses[0].paymentAccount = {};
        state.vaProfile.cnpPaymentInformation.responses[0].paymentAddress = {};
        const props = mapStateToProps(state);
        expect(props.shouldShowDirectDeposit).to.be.false;
      });
    });
    describe('when user has EVSS available, has set up 2FA, is not blocked, and has direct deposit already set up', () => {
      it('should be `true`', () => {
        const state = makeDefaultState();
        const props = mapStateToProps(state);
        expect(props.shouldShowDirectDeposit).to.be.true;
      });
    });
    describe('when user has EVSS available, has set up 2FA, is not blocked, does not have direct deposit set up but does have a payment address on file', () => {
      it('should be `true`', () => {
        const state = makeDefaultState();
        state.vaProfile.cnpPaymentInformation.responses[0].paymentAccount = {};
        const props = mapStateToProps(state);
        expect(props.shouldShowDirectDeposit).to.be.true;
      });
    });
  });

  describe('#showLoader', () => {
    describe('when direct deposit info should be fetched', () => {
      it('is `false` when all required data calls have resolved successfully', () => {
        const state = makeDefaultState();
        const props = mapStateToProps(state);
        expect(props.showLoader).to.be.false;
      });

      it('is `false` when all required data calls have errored', () => {
        const state = makeDefaultState();
        state.vaProfile.cnpPaymentInformation = { error: {} };
        state.vaProfile.userFullName = { error: {} };
        state.vaProfile.personalInformation = { error: {} };
        state.vaProfile.militaryInformation = { error: {} };
        state.totalRating.totalDisabilityRating = { error: {} };
        state.user.profile.mhvAccount = { errors: [] };
        const props = mapStateToProps(state);
        expect(props.showLoader).to.be.false;
      });

      it('is `true` when the call to fetch payment info has not resolved but all others have', () => {
        const state = makeDefaultState();
        delete state.vaProfile.cnpPaymentInformation;
        const props = mapStateToProps(state);
        expect(props.showLoader).to.be.true;
      });

      it('is `true` when the call to fetch personal info has not resolved but all others have', () => {
        const state = makeDefaultState();
        delete state.vaProfile.personalInformation;
        const props = mapStateToProps(state);
        expect(props.showLoader).to.be.true;
      });

      it('is `true` when the call to fetch military info has not resolved but all others have', () => {
        const state = makeDefaultState();
        delete state.vaProfile.militaryInformation;
        const props = mapStateToProps(state);
        expect(props.showLoader).to.be.true;
      });

      it('is `true` when the call to fetch the full name has not resolved but all others have', () => {
        const state = makeDefaultState();
        delete state.vaProfile.hero;
        const props = mapStateToProps(state);
        expect(props.showLoader).to.be.true;
      });

      it('is `true` when the call to fetch MHV info has not resolved but all others have', () => {
        const state = makeDefaultState();
        state.user.profile.mhvAccount = {
          accountState: null,
          errors: null,
          loading: false,
        };
        const props = mapStateToProps(state);
        expect(props.showLoader).to.be.true;
      });
    });

    describe('when direct deposit info should not be fetched because the user has not set up 2FA', () => {
      let state;
      beforeEach(() => {
        state = makeDefaultState();
        state.user.profile.multifactor = false;
        delete state.vaProfile.cnpPaymentInformation;
      });

      it('is `false` when all required data calls have resolved successfully', () => {
        const props = mapStateToProps(state);
        expect(props.showLoader).to.be.false;
      });

      it('is `false` when all required data calls have either resolved successfully or errored', () => {
        state.vaProfile.personalInformation.error = {};
        const props = mapStateToProps(state);
        expect(props.showLoader).to.be.false;
      });

      it('is `false` when the call to fetch payment info has not resolved', () => {
        const props = mapStateToProps(state);
        expect(props.showLoader).to.be.false;
      });

      it('is `true` when the call to fetch personal info has not resolved', () => {
        delete state.vaProfile.personalInformation;
        const props = mapStateToProps(state);
        expect(props.showLoader).to.be.true;
      });

      it('is `true` when the call to fetch military info has not resolved', () => {
        delete state.vaProfile.militaryInformation;
        const props = mapStateToProps(state);
        expect(props.showLoader).to.be.true;
      });

      it('is `true` when the call to fetch the full name has not resolved', () => {
        delete state.vaProfile.hero;
        const props = mapStateToProps(state);
        expect(props.showLoader).to.be.true;
      });

      it('is `true` when the call to fetch MHV info has not resolved', () => {
        state.user.profile.mhvAccount = {
          accountState: null,
          errors: null,
          loading: false,
        };
        const props = mapStateToProps(state);
        expect(props.showLoader).to.be.true;
      });
    });

    describe('when the user is not LOA1 or LOA3 and is logged in', () => {
      it('is `true`', () => {
        const state = makeDefaultState();
        state.user.login.currentlyLoggedIn = true;
        state.user.profile.loa.current = undefined;
        const props = mapStateToProps(state);
        expect(props.showLoader).to.be.true;
      });
    });

    describe('when the user is LOA3 and is logged in', () => {
      it('is `false`', () => {
        const state = makeDefaultState();
        state.user.login.currentlyLoggedIn = true;
        state.user.profile.loa.current = 3;
        const props = mapStateToProps(state);
        expect(props.showLoader).to.be.false;
      });
    });
  });
});

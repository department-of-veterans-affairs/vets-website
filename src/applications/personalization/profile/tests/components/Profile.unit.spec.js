import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import backendServices from '~/platform/user/profile/constants/backendServices';
import { RequiredLoginView } from '~/platform/user/authorization/components/RequiredLoginView';

import { CSP_IDS } from '~/platform/user/authentication/constants';
import {
  ProfileUnconnected as Profile,
  mapStateToProps,
} from '../../components/Profile';

describe('Profile', () => {
  let defaultProps;
  let fetchFullNameSpy;
  let fetchMilitaryInfoSpy;
  let fetchCNPPaymentInfoSpy;
  let fetchPersonalInfoSpy;
  let fetchTotalDisabilityRatingSpy;
  let connectDrupalSourceOfTruthCernerSpy;

  beforeEach(() => {
    fetchFullNameSpy = sinon.spy();
    fetchMilitaryInfoSpy = sinon.spy();
    fetchCNPPaymentInfoSpy = sinon.spy();
    fetchPersonalInfoSpy = sinon.spy();
    fetchTotalDisabilityRatingSpy = sinon.spy();
    connectDrupalSourceOfTruthCernerSpy = sinon.spy();

    defaultProps = {
      connectDrupalSourceOfTruthCerner: connectDrupalSourceOfTruthCernerSpy,
      fetchFullName: fetchFullNameSpy,
      fetchMilitaryInformation: fetchMilitaryInfoSpy,
      fetchCNPPaymentInformation: fetchCNPPaymentInfoSpy,
      fetchPersonalInformation: fetchPersonalInfoSpy,
      fetchTotalDisabilityRating: fetchTotalDisabilityRatingSpy,
      shouldFetchCNPDirectDepositInformation: true,
      shouldFetchTotalDisabilityRating: true,
      showLoader: false,
      isLOA3: true,
      isInMVI: true,
      user: {},
      location: {
        pathname: '/profile/personal-information',
      },
      togglesLoaded: true,
      profileToggles: {},
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
    context('when user is LOA3', () => {
      beforeEach(() => {
        defaultProps.user.profile = {
          status: 'OK',
        };
      });
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
    });

    context('when user is not LOA1', () => {
      beforeEach(() => {
        defaultProps.isLOA3 = false;
      });
      it('should not fetch the military information data', () => {
        const wrapper = shallow(<Profile {...defaultProps} />);
        expect(fetchMilitaryInfoSpy.called).to.be.false;
        wrapper.unmount();
      });

      it('should not fetch the full name data', () => {
        const wrapper = shallow(<Profile {...defaultProps} />);
        expect(fetchFullNameSpy.called).to.be.false;
        wrapper.unmount();
      });

      it('should not fetch the personal information data', () => {
        const wrapper = shallow(<Profile {...defaultProps} />);
        expect(fetchPersonalInfoSpy.called).to.be.false;
        wrapper.unmount();
      });
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
    status: 'OK',
    services: ['evss-claims'],
    mhvAccount: {
      accountState: 'needs_terms_acceptance',
      errors: null,
      loading: false,
    },
    veteranStatus: {
      servedInMilitary: true,
    },
    signIn: {
      serviceName: CSP_IDS.ID_ME,
    },
    loa: {
      current: 3,
    },
    featureToggles: {
      loading: false,
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
    eduPaymentInformation: {
      accountType: 'Checking',
      accountNumber: '*****6789',
      financialInstitutionRoutingNumber: '*****6800',
      financialInstitutionName: 'Chase Bank',
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
      'isDowntimeWarningDismissed',
      'isBlocked',
      'togglesLoaded',
      'profileToggles',
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

  describe('#shouldFetchTotalDisabilityRating', () => {
    it('is falsey when the user is LOA3 and has no claim in user object', () => {
      const state = makeDefaultState();
      const props = mapStateToProps(state);
      expect(props.shouldFetchTotalDisabilityRating).to.not.be.true;
    });

    it('is falsey when the user is LOA3 and profile.claims.ratingInfo is explicitly false', () => {
      const state = makeDefaultState();
      state.user.profile.claims = { ratingInfo: false };
      const props = mapStateToProps(state);
      expect(props.shouldFetchTotalDisabilityRating).to.not.be.true;
    });

    it('is truthy when the user is LOA3 and profile.claims.ratingInfo is explicitly true', () => {
      const state = makeDefaultState();
      state.user.profile.claims = { ratingInfo: true };
      const props = mapStateToProps(state);
      expect(props.shouldFetchTotalDisabilityRating).to.be.true;
    });
  });

  describe('#shouldFetchCNPDirectDepositInformation', () => {
    it('is `true` when ID.me user has 2FA set and has access to EVSS', () => {
      const state = makeDefaultState();
      const props = mapStateToProps(state);
      expect(props.shouldFetchCNPDirectDepositInformation).to.be.true;
    });

    it('is `false` when ID.me user has 2FA set but does not have access to EVSS', () => {
      const state = makeDefaultState();
      state.user.profile.services = [];
      const props = mapStateToProps(state);
      expect(props.shouldFetchCNPDirectDepositInformation).to.be.false;
    });

    it('is `false` when the ID.me user has access to EVSS but does not have 2FA set', () => {
      const state = makeDefaultState();
      state.user.profile.multifactor = false;
      const props = mapStateToProps(state);
      expect(props.shouldFetchCNPDirectDepositInformation).to.be.false;
    });

    it('is `false` when the ID.me user does not have 2FA set and does not have access to EVSS', () => {
      const state = makeDefaultState();
      state.user.profile.multifactor = false;
      state.user.profile.services = [];
      const props = mapStateToProps(state);
      expect(props.shouldFetchCNPDirectDepositInformation).to.be.false;
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

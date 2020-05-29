import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import backendServices from 'platform/user/profile/constants/backendServices';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';

import { Profile2, mapStateToProps } from '../../components/Profile2Wrapper';

describe('Profile2', () => {
  let defaultProps;
  let fetchFullNameSpy;
  let fetchMilitaryInfoSpy;
  let fetchMHVAccountSpy;
  let fetchPaymentInfoSpy;
  let fetchPersonalInfoSpy;

  beforeEach(() => {
    fetchFullNameSpy = sinon.spy();
    fetchMilitaryInfoSpy = sinon.spy();
    fetchMHVAccountSpy = sinon.spy();
    fetchPaymentInfoSpy = sinon.spy();
    fetchPersonalInfoSpy = sinon.spy();

    defaultProps = {
      fetchFullName: fetchFullNameSpy,
      fetchMHVAccount: fetchMHVAccountSpy,
      fetchMilitaryInformation: fetchMilitaryInfoSpy,
      fetchPaymentInformation: fetchPaymentInfoSpy,
      fetchPersonalInformation: fetchPersonalInfoSpy,
      shouldFetchDirectDepositInformation: true,
      showLoader: false,
      user: {},
      location: {
        pathname: '/profile/personal-information',
      },
    };
  });

  it('renders a RequiredLoginView component that requires the USER_PROFILE', () => {
    const wrapper = shallow(<Profile2 {...defaultProps} />);
    expect(wrapper.type()).to.equal(RequiredLoginView);
    expect(wrapper.prop('serviceRequired')).to.equal(
      backendServices.USER_PROFILE,
    );
    wrapper.unmount();
  });

  it('should render a spinner if it is loading data', () => {
    defaultProps.showLoader = true;
    const wrapper = shallow(<Profile2 {...defaultProps} />);
    wrapper.setProps({ showLoader: true });
    const loader = wrapper.find('LoadingIndicator');
    expect(loader.length).to.equal(1);
    wrapper.unmount();
  });

  describe('when the component mounts', () => {
    it('should fetch the military information data', () => {
      const wrapper = shallow(<Profile2 {...defaultProps} />);
      expect(fetchMilitaryInfoSpy.called).to.be.true;
      wrapper.unmount();
    });

    it('should fetch the full name data', () => {
      const wrapper = shallow(<Profile2 {...defaultProps} />);
      expect(fetchFullNameSpy.called).to.be.true;
      wrapper.unmount();
    });

    it('should fetch the personal information data', () => {
      const wrapper = shallow(<Profile2 {...defaultProps} />);
      expect(fetchPersonalInfoSpy.called).to.be.true;
      wrapper.unmount();
    });

    it('should fetch the My HealtheVet data', () => {
      const wrapper = shallow(<Profile2 {...defaultProps} />);
      expect(fetchMHVAccountSpy.called).to.be.true;
      wrapper.unmount();
    });

    it('should render BreadCrumbs', () => {
      const wrapper = shallow(<Profile2 {...defaultProps} />);
      expect(wrapper.find('Breadcrumbs')).to.have.lengthOf(1);
      wrapper.unmount();
    });

    it('should render the correct breadcrumb (Personal and contact Information)', () => {
      const wrapper = shallow(<Profile2 {...defaultProps} />);
      const BreadCrumbs = wrapper.find('Breadcrumbs');
      const activeRouteText = BreadCrumbs.find('a')
        .last()
        .text();

      expect(activeRouteText).to.include('Personal and contact Information');
      wrapper.unmount();
    });

    describe('when `shouldFetchDirectDepositInformation` is `true`', () => {
      it('should fetch the payment information data', () => {
        const wrapper = shallow(<Profile2 {...defaultProps} />);
        expect(fetchPaymentInfoSpy.called).to.be.true;
        wrapper.unmount();
      });
    });

    describe('when `shouldFetchDirectDepositInformation` is `false`', () => {
      it('should not fetch the payment information data', () => {
        defaultProps.shouldFetchDirectDepositInformation = false;
        const wrapper = shallow(<Profile2 {...defaultProps} />);
        expect(fetchPaymentInfoSpy.called).to.be.false;
        wrapper.unmount();
      });
    });
  });

  describe('when the component updates', () => {
    describe('when `shouldFetchDirectDepositInformation` goes from `false` to `true', () => {
      it('should fetch the payment information data', () => {
        defaultProps.shouldFetchDirectDepositInformation = false;
        const wrapper = shallow(<Profile2 {...defaultProps} />);
        expect(fetchPaymentInfoSpy.called).to.be.false;
        wrapper.setProps({ shouldFetchDirectDepositInformation: true });
        expect(fetchPaymentInfoSpy.called).to.be.true;
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
    paymentInformation: {
      responses: [
        {
          controlInformation: {},
          paymentAccount: {},
          paymentAddress: {},
          paymentType: 'CNP',
        },
      ],
    },
  });
  const makeDefaultState = () => ({
    user: {
      profile: makeDefaultProfileState(),
    },
    vaProfile: makeDefaultVaProfileState(),
  });

  it('returns an object with the correct keys', () => {
    const state = makeDefaultState();
    const props = mapStateToProps(state);
    const expectedKeys = [
      'user',
      'showLoader',
      'shouldFetchDirectDepositInformation',
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

  describe('#shouldFetchDirectDepositInformation', () => {
    it('is `true` when user has 2FA set and has access to EVSS', () => {
      const state = makeDefaultState();
      const props = mapStateToProps(state);
      expect(props.shouldFetchDirectDepositInformation).to.be.true;
    });

    it('is `false` when user has 2FA set but does not have access to EVSS', () => {
      const state = makeDefaultState();
      state.user.profile.services = [];
      const props = mapStateToProps(state);
      expect(props.shouldFetchDirectDepositInformation).to.be.false;
    });

    it('is `false` when the user has access to EVSS but does not have 2FA set', () => {
      const state = makeDefaultState();
      state.user.profile.multifactor = false;
      const props = mapStateToProps(state);
      expect(props.shouldFetchDirectDepositInformation).to.be.false;
    });

    it('is `false` when the user does not have 2FA set and does not have access to EVSS', () => {
      const state = makeDefaultState();
      state.user.profile.multifactor = false;
      state.user.profile.services = [];
      const props = mapStateToProps(state);
      expect(props.shouldFetchDirectDepositInformation).to.be.false;
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
        state.vaProfile.paymentInformation = { error: {} };
        state.vaProfile.userFullName = { error: {} };
        state.vaProfile.personalInformation = { error: {} };
        state.vaProfile.militaryInformation = { error: {} };
        state.user.profile.mhvAccount = { errors: [] };
        const props = mapStateToProps(state);
        expect(props.showLoader).to.be.false;
      });

      it('is `true` when the call to fetch payment info has not resolved but all others have', () => {
        const state = makeDefaultState();
        delete state.vaProfile.paymentInformation;
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
        delete state.vaProfile.paymentInformation;
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
  });
});

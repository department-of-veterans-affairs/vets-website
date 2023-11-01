import React from 'react';

import { expect } from 'chai';
import sinon from 'sinon';
import { RequiredLoginView } from 'platform/user/authorization/components/RequiredLoginView';
import { mount } from 'enzyme';
import backendServices from '../../../profile/constants/backendServices';
import localStorage from '../../../../utilities/storage/localStorage';

const anonymousUser = {
  login: { currentlyLoggedIn: false },
  profile: {
    accountType: null,
    dob: null,
    email: null,
    gender: null,
    loading: false,
    userFullName: { first: null, last: null, middle: null, suffix: null },
  },
  verified: false,
};

const loa1User = {
  login: { currentlyLoggedIn: true },
  profile: {
    accountType: 1,
    dob: null,
    email: 'fake@aol.com',
    gender: null,
    loading: false,
    services: ['user-profile'],
    userFullName: { first: null, last: null, middle: null, suffix: null },
    verified: false,
  },
};

const loa3User = {
  login: { currentlyLoggedIn: true },
  profile: {
    accountType: 3,
    dob: '1984-07-17',
    email: 'fake@aol.com',
    gender: 'M', // TODO: use services that actually require LOA3 for clarity?
    loading: false,
    services: [
      backendServices.FACILITIES,
      backendServices.HCA,
      backendServices.USER_PROFILE,
      backendServices.EDUCATION_BENEFITS,
    ],
    status: 'OK',
    userFullName: {
      first: 'WILLIAM',
      last: 'RYAN',
      middle: 'PETER',
      suffix: null,
    },
    verified: true,
  },
};

const generateProps = ({
  verify = true,
  serviceRequired = backendServices.HCA,
  user = loa1User,
  loginUrl = 'http://fake-login-url',
  verifyUrl = 'http://fake-verify-url',
  showProfileErrorMessage = false,
}) => ({
  verify,
  serviceRequired,
  user,
  loginUrl,
  verifyUrl,
  showProfileErrorMessage,
});

function TestChildComponent({ name }) {
  return <div>Child Component {name}</div>;
}

describe('<RequiredLoginView>', () => {
  const redirectFunc = sinon.spy();
  let oldWindow;
  let props;

  beforeEach(() => {
    localStorage.setItem('hasSession', true);
    oldWindow = global.window;
    global.window = Object.create(global.window);
    Object.assign(global.window, {
      pathname: '',
      location: {
        replace: redirectFunc,
      },
    });
  });

  afterEach(() => {
    global.window = oldWindow;
    localStorage.clear();
    props = {};
  });

  it('should render', () => {
    props = generateProps({
      user: { ...anonymousUser },
    });

    const wrapper = mount(
      <RequiredLoginView {...props}>
        <TestChildComponent name="one" />
      </RequiredLoginView>,
    );

    // expect(wrapper.text()).to.contain('Redirecting');
    expect(wrapper.find('va-loading-indicator').length).to.equal(1);
    wrapper.unmount();
  });

  it('should render a loading graphic while loading', () => {
    props = generateProps({
      user: { ...loa1User, profile: { loading: true } },
    });
    const wrapper = mount(
      <RequiredLoginView {...props}>
        <TestChildComponent name="one" />
        <TestChildComponent name="two" />
        <TestChildComponent name="three" />
      </RequiredLoginView>,
    );

    // expect(wrapper.text()).to.contain('Loading your information...');
    expect(wrapper.find('va-loading-indicator').length).to.equal(1);
    expect(wrapper.find('ProfileErrorMessage').length).to.equal(0);
    wrapper.unmount();
  });

  it('should render ProfileErrorMessage when showProfileErrorMessage is set', () => {
    props = generateProps({
      user: { ...loa1User, profile: { errors: true } },
      showProfileErrorMessage: true,
    });
    const wrapper = mount(
      <RequiredLoginView {...props}>
        <TestChildComponent name="one" />
      </RequiredLoginView>,
    );

    const loader = wrapper.find('ProfileErrorMessage');
    expect(loader.length).to.equal(1);
    wrapper.unmount();
  });

  it('should display children when service is available', () => {
    props = generateProps({
      user: loa3User,
    });
    const wrapper = mount(
      <RequiredLoginView {...props}>
        <TestChildComponent name="one" />
        <TestChildComponent name="two" />
        <TestChildComponent name="three" />
      </RequiredLoginView>,
    );

    // Child components should not be passed an isDataAvailable prop
    wrapper.children().forEach(child => {
      expect(child.props().isDataAvailable).to.be.undefined;
    });
    wrapper.unmount();
  });

  it('should display children and pass prop when service is not available', () => {
    props = generateProps({
      user: loa3User,
      serviceRequired: backendServices.MESSAGING,
    });
    const wrapper = mount(
      <RequiredLoginView {...props}>
        <TestChildComponent name="one" />
        <TestChildComponent name="two" />
        <TestChildComponent name="three" />
      </RequiredLoginView>,
    );

    // Each direct child component should be passed a false isDataAvailable prop
    wrapper.children().forEach(child => {
      expect(child.props().isDataAvailable).to.equal(false);
    });
    wrapper.unmount();
  });

  describe('logged in at LOA 1', () => {
    describe('needs verification', () => {
      it('should prompt for verification', () => {
        props = generateProps({ user: loa1User });
        const wrapper = mount(
          <RequiredLoginView {...props}>
            <TestChildComponent name="three" />
          </RequiredLoginView>,
        );

        expect(redirectFunc.calledWith(sinon.match('/verify'))).to.be.true;
        wrapper.unmount();
      });
    });

    describe('does not need verification', () => {
      it('should display children elements', () => {
        props = generateProps({
          verify: false,
          serviceRequired: backendServices.USER_PROFILE,
        });
        const wrapper = mount(
          <RequiredLoginView {...props}>
            <TestChildComponent name="three" />
          </RequiredLoginView>,
        );

        expect(
          wrapper.containsMatchingElement(<TestChildComponent name="three" />),
        );
        expect(wrapper.text()).to.contain('Child Component three');
        wrapper.unmount();
      });
    });
  });

  describe('logged in at LOA 3', () => {
    it('should display children elements', () => {
      props = generateProps({ user: loa3User });
      const wrapper = mount(
        <RequiredLoginView {...props}>
          <TestChildComponent name="One" />
        </RequiredLoginView>,
      );
      expect(wrapper.text()).to.include('Child Component One');
      expect(wrapper.containsMatchingElement(<TestChildComponent name="One" />))
        .to.be.true;
      expect(wrapper.text()).to.contain('Child Component One');
      wrapper.unmount();
    });

    describe('user profile with SERVER_ERROR', () => {
      it('should display server error message', () => {
        props = generateProps({
          user: {
            // profile: { status: 'SERVER_ERROR' },
            ...loa3User,
            profile: { ...loa3User.profile, status: 'SERVER_ERROR' },
          },
        });
        const wrapper = mount(
          <RequiredLoginView {...props}>
            <TestChildComponent name="One" />
          </RequiredLoginView>,
        );
        expect(wrapper.text()).to.contain(
          'Sorry, our system is temporarily down while we fix a few things',
        );
        wrapper.unmount();
      });
    });

    describe('user profile NOT_FOUND', () => {
      it('should display not found message', () => {
        props = generateProps({
          user: {
            // profile: { status: 'SERVER_ERROR' },
            ...loa3User,
            profile: { ...loa3User.profile, status: 'NOT_FOUND' },
          },
        });
        const wrapper = mount(
          <RequiredLoginView {...props}>
            <TestChildComponent name="One" />
          </RequiredLoginView>,
        );
        expect(wrapper.text()).to.contain(
          'We couldn’t find your records with that information.',
        );
        wrapper.unmount();
      });
    });
  });

  describe('not logged in', () => {
    it("should return user to '/'", () => {
      props = generateProps({ user: anonymousUser });
      const wrapper = mount(
        <RequiredLoginView {...props}>
          <TestChildComponent name="three" />
        </RequiredLoginView>,
      );

      expect(redirectFunc.calledWith(sinon.match('/'))).to.be.true;
      wrapper.unmount();
    });

    it('should prompt user to login', () => {
      props = generateProps({ user: anonymousUser });
      const wrapper = mount(
        <RequiredLoginView {...props}>
          <TestChildComponent name="three" />
        </RequiredLoginView>,
      );
      // expect(wrapper.text()).to.include('Redirecting to login...');\
      expect(wrapper.find('va-loading-indicator').length).to.equal(1);
      wrapper.unmount();
    });
  });
});

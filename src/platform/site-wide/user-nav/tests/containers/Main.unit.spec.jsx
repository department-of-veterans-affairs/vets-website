import React from 'react';
import { expect } from 'chai';
import { mockEventListeners } from 'platform/testing/unit/helpers';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import {
  Main,
  shouldConfirmLeavingCheck,
  mapStateToProps,
} from '../../containers/Main';

describe('<Main>', () => {
  const props = {
    currentlyLoggedIn: false,
    isHeaderV2: true,
    isLOA3: false,
    isProfileLoading: false,
    shouldConfirmLeavingForm: false,
    showFormSignInModal: false,
    showLoginModal: false,
    userGreeting: null,
    useSignInService: false,
    utilitiesMenuIsOpen: { search: false, help: false, account: false },
    getBackendStatuses: sinon.spy(),
    initializeProfile: sinon.spy(),
    toggleFormSignInModal: sinon.spy(),
    toggleLoginModal: sinon.spy(),
    toggleSearchHelpUserMenu: sinon.spy(),
    updateLoggedInStatus: sinon.spy(),
  };

  const oldWindow = global.window;
  beforeEach(() => {
    global.window = Object.create(global.window);
    Object.assign(
      global.window,
      mockEventListeners({
        location: { pathname: '/' },
      }),
    );
  });

  afterEach(() => {
    props.getBackendStatuses.reset();
    props.toggleFormSignInModal.reset();
    props.toggleLoginModal.reset();
    props.toggleSearchHelpUserMenu.reset();
    props.updateLoggedInStatus.reset();
    props.initializeProfile.reset();
    global.window = oldWindow;
    localStorage.clear();
  });

  it('should render', () => {
    const wrapper = shallow(<Main {...props} />, { context: { store: {} } });
    expect(wrapper.find('SearchHelpSignIn').exists()).to.be.true;
    expect(wrapper.find('SignInModal').exists()).to.be.true;
    wrapper.unmount();
  });

  describe('checkLoggedInStatus', () => {
    it('should set logged in status to false if there is no active session', () => {
      const wrapper = shallow(<Main {...props} />);
      global.window.simulate('load');
      expect(props.updateLoggedInStatus.calledOnce).to.be.true;
      expect(props.updateLoggedInStatus.calledWith(false)).to.be.true;
      expect(props.toggleLoginModal.called).to.be.false;
      wrapper.unmount();
    });

    it('should open the login modal if there is a redirect URL and there is no active session', () => {
      global.window.location.search = { next: '/account' };
      const wrapper = shallow(<Main {...props} />);
      global.window.simulate('load');
      expect(props.updateLoggedInStatus.calledOnce).to.be.true;
      expect(props.updateLoggedInStatus.calledWith(false)).to.be.true;
      expect(props.toggleLoginModal.calledOnce).to.be.true;
      expect(props.toggleLoginModal.calledWith(true)).to.be.true;
      wrapper.unmount();
    });

    it('should open the login modal if there is a ?next=loginModal Param and there is no active session', () => {
      global.window.location.search = { next: 'loginModal' };
      const wrapper = shallow(<Main {...props} />);
      global.window.simulate('load');
      expect(props.updateLoggedInStatus.calledOnce).to.be.true;
      expect(props.updateLoggedInStatus.calledWith(false)).to.be.true;
      expect(props.toggleLoginModal.calledOnce).to.be.true;
      expect(props.toggleLoginModal.calledWith(true)).to.be.true;
      wrapper.unmount();
    });

    it('should attempt to initialize profile if there is an active session', () => {
      const wrapper = shallow(<Main {...props} />);
      localStorage.setItem('hasSession', true);
      global.window.simulate('load');
      expect(props.initializeProfile.calledOnce).to.be.true;
      expect(props.updateLoggedInStatus.called).to.be.false;
      localStorage.clear();
      wrapper.unmount();
    });

    it('should not occur in auth callback', () => {
      global.window.location.pathname = '/auth/login/callback';
      const addEventListener = sinon.spy(global.window, 'addEventListener');
      const wrapper = shallow(<Main {...props} />);
      expect(addEventListener.calledWith('load')).to.be.false;
      expect(props.initializeProfile.called).to.be.false;
      expect(props.updateLoggedInStatus.called).to.be.false;
      wrapper.unmount();
    });
  });

  it('should ignore any storage changes if the user is already logged out', () => {
    const wrapper = shallow(<Main {...props} />);
    global.window.simulate('storage', {
      key: 'hasSession',
      newValue: null,
    });
    expect(props.updateLoggedInStatus.called).to.be.false;
    wrapper.unmount();
  });

  it('should update logged in status if a logged in user has their session terminated', () => {
    const wrapper = shallow(<Main {...props} currentlyLoggedIn />);
    global.window.simulate('storage', {
      key: 'hasSession',
      newValue: null,
    });
    expect(props.updateLoggedInStatus.calledOnce).to.be.true;
    expect(props.updateLoggedInStatus.calledWith(false)).to.be.true;
    wrapper.unmount();
  });

  it('should redirect if the user is determined to be logged in', () => {
    global.window.location.search = { next: 'account' };
    global.window.location.replace = sinon.spy();
    const wrapper = shallow(<Main {...props} />);
    wrapper.setProps({ currentlyLoggedIn: true });
    expect(global.window.location.replace.calledOnce).to.be.true;
    expect(global.window.location.replace.calledWith('/account?postLogin=true'))
      .to.be.true;
    wrapper.unmount();
  });

  it('should close the login modals if the user is determined to be logged in', () => {
    const wrapper = shallow(<Main {...props} showLoginModal />);
    wrapper.setProps({ currentlyLoggedIn: true });
    expect(props.toggleFormSignInModal.called).to.be.false;
    expect(props.toggleLoginModal.calledOnce).to.be.true;
    expect(props.toggleLoginModal.calledWith(false)).to.be.true;
    wrapper.unmount();
  });

  it('should close the modal to confirm leaving an in-progress form if the user is determined to be logged in', () => {
    const wrapper = shallow(<Main {...props} showFormSignInModal />);
    wrapper.setProps({ currentlyLoggedIn: true });
    expect(props.toggleLoginModal.called).to.be.false;
    expect(props.toggleFormSignInModal.calledOnce).to.be.true;
    expect(props.toggleFormSignInModal.calledWith(false)).to.be.true;
    wrapper.unmount();
  });

  it('should show the login modal when the sign-in button is clicked', () => {
    const wrapper = shallow(<Main {...props} />);
    wrapper.find('SearchHelpSignIn').prop('onSignInSignUp')();
    expect(props.getBackendStatuses.calledOnce).to.be.true;
    expect(props.toggleLoginModal.calledOnce).to.be.true;
    expect(props.toggleLoginModal.calledWith(true, 'header')).to.be.true;
    wrapper.unmount();
  });

  it('should show the modal to confirm leaving an in-progress form', () => {
    const wrapper = shallow(<Main {...props} shouldConfirmLeavingForm />);
    wrapper.find('SearchHelpSignIn').prop('onSignInSignUp')();
    expect(props.getBackendStatuses.calledOnce).to.be.false;
    expect(props.toggleFormSignInModal.calledOnce).to.be.true;
    expect(props.toggleLoginModal.calledOnce).to.be.false;
    expect(props.toggleFormSignInModal.calledWith(true)).to.be.true;
    wrapper.unmount();
  });

  it('should not show the modal to confirm leaving an in-progress form if the user is on the standard form introduction page', () => {
    const oldLocation = global.window.location;
    global.window.location.pathname =
      '/health-care/apply-for-health-care-form-10-10ez/';
    const wrapper = shallow(
      <Main {...props} formAutoSavedStatus="not-attempted" />,
    );
    wrapper.find('SearchHelpSignIn').prop('onSignInSignUp')();
    expect(props.getBackendStatuses.calledOnce).to.be.true;
    expect(props.toggleFormSignInModal.calledOnce).to.be.false;
    expect(props.toggleLoginModal.calledOnce).to.be.true;
    expect(props.toggleLoginModal.calledWith(true)).to.be.true;
    global.window.location = oldLocation;
    wrapper.unmount();
  });

  it('should not show the modal to confirm leaving an in-progress form if the user is on a non-form page as defined in the form config', () => {
    const oldLocation = global.window.location;
    global.window.location.pathname =
      '/health-care/apply-for-health-care-form-10-10ez/id-page';
    const additionalRoutes = [{ path: 'id-page' }];
    const wrapper = shallow(
      <Main
        {...props}
        formAutoSavedStatus="not-attempted"
        additionalRoutes={additionalRoutes}
      />,
    );
    wrapper.find('SearchHelpSignIn').prop('onSignInSignUp')();
    expect(props.getBackendStatuses.calledOnce).to.be.true;
    expect(props.toggleFormSignInModal.calledOnce).to.be.false;
    expect(props.toggleLoginModal.calledOnce).to.be.true;
    expect(props.toggleLoginModal.calledWith(true)).to.be.true;
    global.window.location = oldLocation;
    wrapper.unmount();
  });

  it('should close the login modal when changing routes', () => {
    const wrapper = shallow(<Main {...props} showLoginModal />);
    global.window.simulate('popstate');
    expect(props.toggleFormSignInModal.called).to.be.false;
    expect(props.toggleLoginModal.calledOnce).to.be.true;
    expect(props.toggleLoginModal.calledWith(false)).to.be.true;
    wrapper.unmount();
  });

  it('should close the modal to confirm leaving an in-progress form when changing routes', () => {
    const wrapper = shallow(<Main {...props} showFormSignInModal />);
    global.window.simulate('popstate');
    expect(props.toggleLoginModal.called).to.be.false;
    expect(props.toggleFormSignInModal.calledOnce).to.be.true;
    expect(props.toggleFormSignInModal.calledWith(false)).to.be.true;
    wrapper.unmount();
  });
});

describe('mapStateToProps', () => {
  const state = {
    user: {
      login: {
        currentlyLoggedIn: false,
      },
      profile: {
        loading: false,
        userFullName: {},
        loa: {},
      },
    },
    form: {},
    featureToggles: {
      signInServiceEnabled: false,
    },
  };

  it('should return an object with appopriate keys', () => {
    expect(mapStateToProps(state)).to.have.keys(
      'currentlyLoggedIn',
      'isLOA3',
      'isProfileLoading',
      'shouldConfirmLeavingForm',
      'user',
      'useSignInService',
      'userGreeting',
    );
  });
});

describe('shouldConfirmLeavingCheck', () => {
  const generateState = ({ autoSavedStatus = '', additionalRoutes = [] }) => ({
    ...(autoSavedStatus.length > 0 && { autoSavedStatus }),
    ...(additionalRoutes.length > 0 && { additionalRoutes }),
  });

  let oldWindow;

  beforeEach(() => {
    oldWindow = global.window;
    global.window = { location: { pathname: '' } };
  });

  afterEach(() => {
    global.window = oldWindow;
  });

  it('should return false if user is not in the form app OR `state.form` is not an object', () => {
    expect(shouldConfirmLeavingCheck(generateState({}))).to.be.false;
    expect(shouldConfirmLeavingCheck([])).to.be.false;
  });

  it('should return false if `autoSavedStatus` is undefined', () => {
    const formState = generateState({ autoSavedStatus: '' });
    expect(shouldConfirmLeavingCheck(formState)).to.be.false;
  });

  it('should return false when users form is auto-saved', () => {
    const formState = generateState({ autoSavedStatus: 'success' });
    expect(shouldConfirmLeavingCheck(formState)).to.be.false;
  });

  it('should return true and the form has not saved', () => {
    const formState = generateState({ autoSavedStatus: 'not-attempted' });
    expect(shouldConfirmLeavingCheck(formState)).to.be.true;
  });

  it('should return false for non-form pages', () => {
    global.window.location.pathname =
      '/health-care/apply-for-health-care-form-10-10ez/id-page';
    const formState = generateState({
      autoSavedStatus: 'not-attempted',
      additionalRoutes: [{ path: 'id-page' }],
    });
    expect(shouldConfirmLeavingCheck(formState)).to.be.false;
  });
});

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { mockEventListeners } from 'platform/testing/unit/helpers';
import localStorage from 'platform/utilities/storage/localStorage';
import SignInModal from 'platform/user/authentication/components/SignInModal';
import { ACCOUNT_TRANSITION_DISMISSED } from 'platform/user/authentication/constants';
import { Main, mapStateToProps } from '../../containers/Main';

describe('<Main>', () => {
  const props = {
    currentlyLoggedIn: false,
    formAutoSavedStatus: undefined,
    isProfileLoading: false,
    isLOA3: false,
    userGreeting: null,
    showFormSignInModal: false,
    showLoginModal: false,
    showNavLogin: true,
    showTransitionSuccessModal: false,
    showTransitionModal: false,
    utilitiesMenuIsOpen: { search: false, help: false, account: false },
    useSignInService: false,
    getBackendStatuses: sinon.spy(),
    toggleFormSignInModal: sinon.spy(),
    toggleLoginModal: sinon.spy(),
    toggleAccountTransitionModal: sinon.spy(),
    closeAccountTransitionModal: sinon.spy(),
    toggleAccountTransitionSuccessModal: sinon.spy(),
    closeAccountTransitionSuccessModal: sinon.spy(),
    toggleSearchHelpUserMenu: sinon.spy(),
    updateLoggedInStatus: sinon.spy(),
    initializeProfile: sinon.spy(),
  };

  let oldWindow = null;
  const appendSpy = sinon.spy(Main.prototype, 'appendOrRemoveParameter');

  beforeEach(() => {
    oldWindow = global.window;
    global.window = Object.create(global.window);
    Object.assign(
      global.window,
      mockEventListeners({
        location: { pathname: '/' },
      }),
    );
  });

  afterEach(() => {
    appendSpy.reset();
    props.getBackendStatuses.reset();
    props.toggleFormSignInModal.reset();
    props.toggleLoginModal.reset();
    props.toggleAccountTransitionModal.reset();
    props.closeAccountTransitionModal.reset();
    props.toggleAccountTransitionSuccessModal.reset();
    props.closeAccountTransitionSuccessModal.reset();
    props.toggleSearchHelpUserMenu.reset();
    props.updateLoggedInStatus.reset();
    props.initializeProfile.reset();
    props.showNavLogin = true;
    global.window = oldWindow;
    localStorage.clear();
  });

  it('should render', () => {
    const wrapper = shallow(<Main {...props} />, { context: { store: {} } });
    expect(wrapper.find('SearchHelpSignIn').exists()).to.be.true;
    expect(wrapper.find(SignInModal).exists()).to.be.true;
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
      localStorage.setItem('hasSession', true);
      const wrapper = shallow(<Main {...props} />);
      global.window.simulate('load');
      expect(props.initializeProfile.calledOnce).to.be.true;
      expect(props.updateLoggedInStatus.called).to.be.false;
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

    it('should open the account transition modal when logged in, and user property mhvTransitionEligible is true', () => {
      const mutatedProps = {
        ...props,
        currentlyLoggedIn: true,
        user: {
          mhvTransitionEligible: true,
          mhvTransitionComplete: false,
        },
        signInServiceName: 'mhv',
      };
      const wrapper = shallow(<Main {...props} />);
      global.window.simulate('load');
      wrapper.setProps(mutatedProps);
      expect(props.toggleAccountTransitionModal.calledWith(true)).to.be.true;
      wrapper.unmount();
    });

    it('should set dismissed in storage when accountTransitionModal is closed', () => {
      const mutatedProps = {
        ...props,
        currentlyLoggedIn: true,
        user: {
          mhvTransitionEligible: true,
          mhvTransitionComplete: false,
        },
        signInServiceName: 'mhv',
      };
      const wrapper = shallow(<Main {...props} />);
      global.window.simulate('load');
      wrapper.setProps(mutatedProps);
      expect(props.toggleAccountTransitionModal.calledWith(true)).to.be.true;
      wrapper.instance().closeAccountTransitionModal();
      expect(localStorage.getItem(ACCOUNT_TRANSITION_DISMISSED)).to.equal(
        'true',
      );
      wrapper.unmount();
    });

    it('should not open the account transition modal if it has been previously dismissed', () => {
      localStorage.setItem(ACCOUNT_TRANSITION_DISMISSED, true);
      const mutatedProps = {
        ...props,
        currentlyLoggedIn: true,
        user: {
          mhvTransitionComplete: false,
        },
        signInServiceName: 'mhv',
      };
      const wrapper = shallow(<Main {...props} />);
      global.window.simulate('load');
      wrapper.setProps(mutatedProps);
      expect(props.toggleAccountTransitionModal.notCalled).to.be.true;
      wrapper.unmount();
    });
  });

  it('should open the `TransitionSuccessModal` when `mhvTransitionComplete` is true and `signIn.serviceName` is `logingov`', () => {
    const mutatedProps = {
      ...props,
      currentlyLoggedIn: true,
      user: { mhvTransitionComplete: true },
      signInServiceName: 'logingov',
    };
    const wrapper = shallow(<Main {...props} />);
    global.window.simulate('load');
    wrapper.setProps(mutatedProps);
    expect(props.toggleAccountTransitionSuccessModal.calledWith(true)).to.be
      .true;
    wrapper.unmount();
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

  it('should append ?next=loginModal when the login modal is opened', () => {
    const wrapper = shallow(<Main {...props} />);
    wrapper.find('SearchHelpSignIn').prop('onSignInSignUp')();
    const signInModalProps = wrapper.find('SignInModal').props();
    expect(signInModalProps.useSiS).to.be.false;
    expect(props.getBackendStatuses.calledOnce).to.be.true;
    expect(props.toggleLoginModal.calledOnce).to.be.true;
    expect(props.toggleLoginModal.calledWith(true, 'header')).to.be.true;
    expect(appendSpy.calledWith()).to.be.true;
    expect(appendSpy.returnValues[0].next).to.equal('loginModal');

    wrapper.unmount();
  });

  it('should append `&oauth=true` when the login modal is opened and signInServiceEnabled feature flag is true', () => {
    const wrapper = shallow(<Main {...props} useSignInService />);
    wrapper.find('SearchHelpSignIn').prop('onSignInSignUp')();
    const signInModalProps = wrapper.find('SignInModal').props();
    expect(signInModalProps.useSiS).to.be.true;
    expect(appendSpy.returnValues[0].next).to.equal('loginModal');
    expect(appendSpy.returnValues[0].oauth).to.equal(true);
    wrapper.unmount();
  });

  it('should not append ?next=loginModal when the login modal is opened and a ?next parameter already exists', () => {
    global.window.location.search = { next: 'account' };
    const wrapper = shallow(<Main {...props} />);
    wrapper.find('SearchHelpSignIn').prop('onSignInSignUp')();
    expect(props.getBackendStatuses.calledOnce).to.be.true;
    expect(props.toggleLoginModal.calledOnce).to.be.true;
    expect(props.toggleLoginModal.calledWith(true, 'header')).to.be.true;
    expect(appendSpy.calledWith()).to.be.true;
    expect(appendSpy.returnValues[0]).to.be.null;
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
  // We have to mock out the login and profile because the user/selectors.js and
  // user-nav/selectors.js are used in mapStateToProps and they do not fail
  // gracefully when accessing properties of the login and profile objects.
  const state = {
    user: {
      login: {},
      profile: {
        userFullName: {},
        loa: {},
      },
    },
  };
  describe('shouldConfirmLeavingForm', () => {
    let oldWindow;
    beforeEach(() => {
      oldWindow = global.window;
      global.window = {
        location: {
          pathname: '',
        },
      };
    });
    afterEach(() => {
      global.window = oldWindow;
    });
    it('is true when the user is on a form page and the form has not saved', () => {
      global.window.location.pathname =
        '/health-care/apply-for-health-care-form-10-10ez/veteran-info';
      const { shouldConfirmLeavingForm } = mapStateToProps({
        ...state,
        form: { autoSavedStatus: 'not-attempted' },
      });
      expect(shouldConfirmLeavingForm).to.be.true;
    });
    it.skip('is false when the user is on a form page page the form has auto-saved', () => {
      global.window.location.pathname =
        '/health-care/apply-for-health-care-form-10-10ez/veteran-info';
      const { shouldConfirmLeavingForm } = mapStateToProps({
        ...state,
        form: {
          autoSavedStatus: 'success',
        },
      });
      expect(shouldConfirmLeavingForm).to.be.false;
    });
    it('is false when the user is on a standard non-form page', () => {
      global.window.location.pathname =
        '/health-care/apply-for-health-care-form-10-10ez/introduction';
      const { shouldConfirmLeavingForm } = mapStateToProps({
        ...state,
        form: { autoSavedStatus: 'not-attempted' },
      });
      expect(shouldConfirmLeavingForm).to.be.false;
    });
    it('is false when the user is on a non-standard non-form page', () => {
      global.window.location.pathname =
        '/health-care/apply-for-health-care-form-10-10ez/id-page';
      const { shouldConfirmLeavingForm } = mapStateToProps({
        ...state,
        form: {
          autoSavedStatus: 'not-attempted',
          additionalRoutes: [{ path: 'id-page' }],
        },
      });
      expect(shouldConfirmLeavingForm).to.be.false;
    });
    it('is false when the user is not in the form app', () => {
      global.window.location.pathname = '/health-care';
      const { shouldConfirmLeavingForm } = mapStateToProps(state);
      expect(shouldConfirmLeavingForm).to.be.false;
    });
  });
});

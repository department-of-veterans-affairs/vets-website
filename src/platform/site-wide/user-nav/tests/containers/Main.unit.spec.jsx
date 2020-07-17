import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { mockEventListeners } from 'platform/testing/unit/helpers';
import localStorage from 'platform/utilities/storage/localStorage';
import SignInModal from 'platform/user/authentication/components/SignInModal';
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
    utilitiesMenuIsOpen: {
      search: false,
      help: false,
      account: false,
    },
    getBackendStatuses: sinon.spy(),
    toggleFormSignInModal: sinon.spy(),
    toggleLoginModal: sinon.spy(),
    toggleSearchHelpUserMenu: sinon.spy(),
    updateLoggedInStatus: sinon.spy(),
    initializeProfile: sinon.spy(),
  };

  const oldWindow = global.window;

  beforeEach(() => {
    global.window = mockEventListeners({
      location: { pathname: '/' },
    });
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
    expect(global.window.location.replace.calledWith('/account')).to.be.true;
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
      '/health-care/apply/application/introduction';
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
    global.window.location.pathname = '/health-care/apply/application/id-page';
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
        '/health-care/apply/application/veteran-info';
      const { shouldConfirmLeavingForm } = mapStateToProps({
        ...state,
        form: { autoSavedStatus: 'not-attempted' },
      });
      expect(shouldConfirmLeavingForm).to.be.true;
    });
    it('is false when the user is on a form page page the form has auto-saved', () => {
      global.window.location.pathname =
        '/health-care/apply/application/veteran-info';
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
        '/health-care/apply/application/introduction';
      const { shouldConfirmLeavingForm } = mapStateToProps({
        ...state,
        form: { autoSavedStatus: 'not-attempted' },
      });
      expect(shouldConfirmLeavingForm).to.be.false;
    });
    it('is false when the user is on a non-standard non-form page', () => {
      global.window.location.pathname =
        '/health-care/apply/application/id-page';
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

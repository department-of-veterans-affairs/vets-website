// Node modules.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import appendQuery from 'append-query';
import URLSearchParams from 'url-search-params';
// Relative imports.
import FormSignInModal from 'platform/forms/save-in-progress/FormSignInModal';
import { SAVE_STATUSES } from 'platform/forms/save-in-progress/actions';
import { getBackendStatuses } from 'platform/monitoring/external-services/actions';
import { initializeProfile } from 'platform/user/profile/actions';
import { isInProgressPath } from 'platform/forms/helpers';
import {
  isLoggedIn,
  isProfileLoading,
  isLOA3,
  selectUser,
} from 'platform/user/selectors';
import {
  toggleFormSignInModal,
  toggleLoginModal,
  toggleSearchHelpUserMenu,
} from 'platform/site-wide/user-nav/actions';
import { updateLoggedInStatus } from 'platform/user/authentication/actions';
import SearchHelpSignIn from '../components/SearchHelpSignIn';
import AutoSSO from './AutoSSO';
import { selectUserGreeting } from '../selectors';

export class Main extends Component {
  componentDidMount() {
    // This is a workaround for the fact that this component is mounted
    // multiple times in the app. We need to make sure that we only
    // bind the event listeners and call the user endpoint once.
    if (Main.isMounted) return;

    // Close any open modals when navigating to different routes within an app.
    window.addEventListener('popstate', this.closeModals);
    window.addEventListener('storage', this.handleSessionChange);
    this.bindModalTriggers();
    // In some cases this component is mounted on a url that is part of the login process and doesn't need to make another
    // request, because that data will be passed to the parent window and done there instead.
    if (!window.location.pathname.includes('auth/login/callback')) {
      this.checkLoggedInStatus();
    }

    Main.isMounted = true;
  }

  componentDidUpdate() {
    const { currentlyLoggedIn } = this.props;

    if (currentlyLoggedIn) {
      this.executeRedirect();
      this.closeModals();
    }
  }

  componentWillUnmount() {
    Main.isMounted = false;
  }

  handleSessionChange = event => {
    if (!this.props.currentlyLoggedIn) return;

    const { key, newValue } = event;
    if (!key || (key === 'hasSession' && !newValue)) {
      this.props.updateLoggedInStatus(false);
    }
  };

  closeLoginModal = () => {
    this.props.toggleLoginModal(false);
  };

  closeModals = () => {
    if (this.props.showFormSignInModal) this.closeFormSignInModal();
    if (this.props.showLoginModal) this.closeLoginModal();
  };

  openLoginModal = () => {
    this.props.toggleLoginModal(true);
  };

  signInSignUp = () => {
    if (this.props.shouldConfirmLeavingForm) {
      this.props.toggleFormSignInModal(true);
    } else {
      /**
       * Make only one upfront request to get all backend statuses to prevent
       * each identity dependency's warning banner from making duplicate
       * requests when the sign-in modal renders.
       */
      this.props.getBackendStatuses();
      this.props.toggleLoginModal(true, 'header');
    }
  };

  getNextParameter = () => {
    return new URLSearchParams(window.location.search).get('next');
  };

  closeFormSignInModal = () => {
    this.props.toggleFormSignInModal(false);
  };

  bindModalTriggers = () => {
    const triggers = Array.from(
      document.querySelectorAll('.signin-signup-modal-trigger'),
    );
    triggers.forEach(t => t.addEventListener('click', this.openLoginModal));
  };

  checkLoggedInStatus = () => {
    if (JSON.parse(localStorage.getItem('hasSession'))) {
      this.props.initializeProfile();
    } else {
      this.props.updateLoggedInStatus(false);
      if (this.getNextParameter()) this.openLoginModal();
    }
  };

  executeRedirect() {
    const redirectUrl = this.formatNextParameter();
    const shouldRedirect =
      redirectUrl && !window.location.pathname.includes('verify');

    if (shouldRedirect) {
      window.location.replace(appendQuery(redirectUrl, 'postLogin=true'));
    }
  }

  formatNextParameter() {
    const nextParam = this.getNextParameter();
    if (nextParam && nextParam !== 'loginModal') {
      return nextParam.startsWith('/') ? nextParam : `/${nextParam}`;
    }

    return null;
  }

  render() {
    return (
      <div className="profile-nav-container">
        <SearchHelpSignIn
          {...this.props}
          isLoggedIn={this.props.currentlyLoggedIn}
          isMenuOpen={this.props.utilitiesMenuIsOpen}
          onSignInSignUp={this.signInSignUp}
          toggleMenu={this.props.toggleSearchHelpUserMenu}
        />
        <FormSignInModal
          onClose={this.closeFormSignInModal}
          onSignIn={this.openLoginModal}
          visible={this.props.showFormSignInModal}
        />
        <AutoSSO />
      </div>
    );
  }
}

export const shouldConfirmLeavingCheck = form => {
  const isFormAnObject = typeof form === 'object';
  if (!isFormAnObject) return false;

  const { autoSavedStatus = undefined, additionalRoutes = undefined } = form;
  const additionalSafePaths =
    (additionalRoutes && additionalRoutes.map(route => route?.path)) ??
    undefined;

  return (
    typeof autoSavedStatus !== 'undefined' &&
    autoSavedStatus !== SAVE_STATUSES.success &&
    isInProgressPath(window.location.pathname, additionalSafePaths)
  );
};

export const mapStateToProps = state => {
  const { form } = state;
  const shouldConfirmLeavingForm = shouldConfirmLeavingCheck(form);

  return {
    currentlyLoggedIn: isLoggedIn(state),
    isLOA3: isLOA3(state),
    isProfileLoading: isProfileLoading(state),
    shouldConfirmLeavingForm,
    useSignInService: true,
    user: selectUser(state),
    userGreeting: selectUserGreeting(state),
    ...state.navigation,
  };
};

const mapDispatchToProps = {
  getBackendStatuses,
  initializeProfile,
  toggleFormSignInModal,
  toggleLoginModal,
  toggleSearchHelpUserMenu,
  updateLoggedInStatus,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main);

Main.propTypes = {
  getBackendStatuses: PropTypes.func.isRequired,
  initializeProfile: PropTypes.func.isRequired,
  toggleFormSignInModal: PropTypes.func.isRequired,
  toggleLoginModal: PropTypes.func.isRequired,
  toggleSearchHelpUserMenu: PropTypes.func.isRequired,
  updateLoggedInStatus: PropTypes.func.isRequired,

  currentlyLoggedIn: PropTypes.bool,
  isHeaderV2: PropTypes.bool,
  isLOA3: PropTypes.bool,
  isProfileLoading: PropTypes.bool,
  shouldConfirmLeavingForm: PropTypes.bool,
  showFormSignInModal: PropTypes.bool,
  showLoginModal: PropTypes.bool,
  useSignInService: PropTypes.bool,
  userGreeting: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  utilitiesMenuIsOpen: PropTypes.object,
};

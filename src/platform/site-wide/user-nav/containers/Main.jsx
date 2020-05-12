import React from 'react';
import { connect } from 'react-redux';
import appendQuery from 'append-query';
import URLSearchParams from 'url-search-params';

import { isInProgressPath } from 'platform/forms/helpers';
import FormSignInModal from 'platform/forms/save-in-progress/FormSignInModal';
import SessionTimeoutModal from 'platform/user/authentication/components/SessionTimeoutModal';
import SignInModal from 'platform/user/authentication/components/SignInModal';
import { initializeProfile } from 'platform/user/profile/actions';
import environment from 'platform/utilities/environment';
import { hasSession } from 'platform/user/profile/utilities';
import { isLoggedIn, isProfileLoading, isLOA3 } from 'platform/user/selectors';

import { getBackendStatuses } from 'platform/monitoring/external-services/actions';
import { updateLoggedInStatus } from 'platform/user/authentication/actions';
import { SAVE_STATUSES } from 'platform/forms/save-in-progress/actions';
import {
  toggleFormSignInModal,
  toggleLoginModal,
  toggleSearchHelpUserMenu,
} from 'platform/site-wide/user-nav/actions';

import SearchHelpSignIn from '../components/SearchHelpSignIn';
import { selectUserGreeting } from '../selectors';
import AutoSSO from './AutoSSO';

export class Main extends React.Component {
  componentDidMount() {
    // Close any open modals when navigating to different routes within an app.
    window.addEventListener('popstate', this.closeModals);
    window.addEventListener('storage', this.handleSessionChange);
    this.bindModalTriggers();
    this.bindNavbarLinks();

    // In some cases this component is mounted on a url that is part of the login process and doesn't need to make another
    // request, because that data will be passed to the parent window and done there instead.
    if (!window.location.pathname.includes('auth/login/callback')) {
      window.addEventListener('load', this.checkLoggedInStatus);
    }
  }

  componentDidUpdate() {
    if (this.props.currentlyLoggedIn) {
      this.executeRedirect();
      this.closeModals();
    }
  }

  componentWillUnmount() {
    this.unbindNavbarLinks();
  }

  getNextParameter() {
    const nextParam = new URLSearchParams(window.location.search).get('next');
    if (nextParam) {
      return nextParam.startsWith('/') ? nextParam : `/${nextParam}`;
    }

    return null;
  }

  executeRedirect() {
    const redirectUrl = this.getNextParameter();
    const shouldRedirect =
      redirectUrl && !window.location.pathname.includes('verify');

    if (shouldRedirect) {
      window.location.replace(redirectUrl);
    }
  }

  checkLoggedInStatus = () => {
    if (hasSession()) {
      this.props.initializeProfile();
    } else {
      this.props.updateLoggedInStatus(false);
      if (this.getNextParameter()) this.openLoginModal();
    }
  };

  handleSessionChange = event => {
    if (!this.props.currentlyLoggedIn) return;

    const { key, newValue } = event;
    if (!key || (key === 'hasSession' && !newValue)) {
      this.props.updateLoggedInStatus(false);
    }
  };

  bindModalTriggers = () => {
    const triggers = Array.from(
      document.querySelectorAll('.signin-signup-modal-trigger'),
    );
    triggers.forEach(t => t.addEventListener('click', this.openLoginModal));
  };

  bindNavbarLinks = () => {
    [...document.querySelectorAll('.login-required')].forEach(el => {
      el.addEventListener('click', e => {
        if (!this.props.currentlyLoggedIn) {
          e.preventDefault();
          const nextQuery = { next: el.getAttribute('href') };
          const nextPath = appendQuery('/', nextQuery);
          history.pushState({}, el.textContent, nextPath);
          this.openLoginModal();
        }
      });
    });
  };

  unbindNavbarLinks = () => {
    [...document.querySelectorAll('.login-required')].forEach(el => {
      el.removeEventListener('click');
    });
  };

  closeFormSignInModal = () => {
    this.props.toggleFormSignInModal(false);
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
      // Make only one upfront request to get all backend statuses to prevent
      // each identity dependency's warning banner from making duplicate
      // requests when the sign-in modal renders.
      this.props.getBackendStatuses();
      this.props.toggleLoginModal(true, 'header');
    }
  };

  render() {
    return (
      <div className="profile-nav-container">
        <SearchHelpSignIn
          isLOA3={this.props.isLOA3}
          isLoggedIn={this.props.currentlyLoggedIn}
          isMenuOpen={this.props.utilitiesMenuIsOpen}
          isProfileLoading={this.props.isProfileLoading}
          onSignInSignUp={this.signInSignUp}
          userGreeting={this.props.userGreeting}
          toggleMenu={this.props.toggleSearchHelpUserMenu}
        />
        <FormSignInModal
          onClose={this.closeFormSignInModal}
          onSignIn={this.openLoginModal}
          visible={this.props.showFormSignInModal}
        />
        <SignInModal
          onClose={this.closeLoginModal}
          visible={this.props.showLoginModal}
        />
        {!environment.isProduction() && (
          <SessionTimeoutModal
            isLoggedIn={this.props.currentlyLoggedIn}
            onExtendSession={this.props.initializeProfile}
          />
        )}
        <AutoSSO />
      </div>
    );
  }
}

export const mapStateToProps = state => {
  let formAutoSavedStatus;
  let additionalRoutes;
  let additionalSafePaths;
  const { form } = state;
  if (typeof form === 'object') {
    formAutoSavedStatus = form.autoSavedStatus;
    additionalRoutes = form.additionalRoutes;
    additionalSafePaths =
      additionalRoutes && additionalRoutes.map(route => route.path);
  }
  const shouldConfirmLeavingForm =
    typeof formAutoSavedStatus !== 'undefined' &&
    formAutoSavedStatus !== SAVE_STATUSES.success &&
    isInProgressPath(window.location.pathname, additionalSafePaths);

  return {
    currentlyLoggedIn: isLoggedIn(state),
    isProfileLoading: isProfileLoading(state),
    isLOA3: isLOA3(state),
    shouldConfirmLeavingForm,
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

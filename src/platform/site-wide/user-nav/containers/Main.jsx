import React from 'react';
import { connect } from 'react-redux';
import appendQuery from 'append-query';
import URLSearchParams from 'url-search-params';

import { isInProgress } from '../../../forms/helpers';
import FormSignInModal from '../../../forms/save-in-progress/FormSignInModal';
import { SAVE_STATUSES } from '../../../forms/save-in-progress/actions';
import { updateLoggedInStatus } from '../../../user/authentication/actions';
import SignInModal from '../../../user/authentication/components/SignInModal';
import { initializeProfile } from '../../../user/profile/actions';
import { hasSession } from '../../../user/profile/utilities';
import { isLoggedIn, isProfileLoading, isLOA3 } from '../../../user/selectors';

import {
  toggleFormSignInModal,
  toggleLoginModal,
  toggleSearchHelpUserMenu,
} from '../../../site-wide/user-nav/actions';

import SearchHelpSignIn from '../components/SearchHelpSignIn';
import { selectUserGreeting } from '../selectors';

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
    const { formAutoSavedStatus } = this.props;

    const shouldConfirmLeavingForm =
      typeof formAutoSavedStatus !== 'undefined' &&
      formAutoSavedStatus !== SAVE_STATUSES.success &&
      isInProgress(window.location.pathname);

    if (shouldConfirmLeavingForm) {
      this.props.toggleFormSignInModal(true);
    } else {
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
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentlyLoggedIn: isLoggedIn(state),
  formAutoSavedStatus: state.form && state.form.autoSavedStatus,
  isProfileLoading: isProfileLoading(state),
  isLOA3: isLOA3(state),
  userGreeting: selectUserGreeting(state),
  ...state.navigation,
});

const mapDispatchToProps = {
  toggleFormSignInModal,
  toggleLoginModal,
  toggleSearchHelpUserMenu,
  updateLoggedInStatus,
  initializeProfile,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main);

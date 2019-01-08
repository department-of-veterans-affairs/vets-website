import React from 'react';
import { connect } from 'react-redux';
import appendQuery from 'append-query';
import URLSearchParams from 'url-search-params';

import recordEvent from '../../../monitoring/record-event';

import { updateLoggedInStatus } from '../../../user/authentication/actions';
import SignInModal from '../../../user/authentication/components/SignInModal';
import { isLoggedIn, isProfileLoading, isLOA3 } from '../../../user/selectors';
import { initializeProfile } from '../../../user/profile/actions';
import { hasSession } from '../../../user/profile/utilities';

import {
  toggleLoginModal,
  toggleSearchHelpUserMenu,
} from '../../../site-wide/user-nav/actions';

import SearchHelpSignIn from '../components/SearchHelpSignIn';
import { selectUserGreeting } from '../selectors';

// const SESSION_REFRESH_INTERVAL_MINUTES = 45;

export class Main extends React.Component {
  componentDidMount() {
    window.addEventListener('message', this.handleLoginSuccess);
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
    const { currentlyLoggedIn, showLoginModal } = this.props;
    const shouldCloseLoginModal = currentlyLoggedIn && showLoginModal;
    if (currentlyLoggedIn) this.executeRedirect();
    if (shouldCloseLoginModal) this.props.toggleLoginModal(false);
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
      if (this.getNextParameter()) this.props.toggleLoginModal(true);
    }
  };

  handleLoginSuccess = event => {
    if (event.data === 'loggedIn') {
      this.executeRedirect();
      this.props.initializeProfile();
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
    const openLoginModal = () => this.props.toggleLoginModal(true);
    triggers.forEach(t => t.addEventListener('click', openLoginModal));
  };

  bindNavbarLinks = () => {
    [...document.querySelectorAll('.login-required')].forEach(el => {
      el.addEventListener('click', e => {
        if (!this.props.currentlyLoggedIn) {
          e.preventDefault();
          const nextQuery = { next: el.getAttribute('href') };
          const nextPath = appendQuery('/', nextQuery);
          history.pushState({}, el.textContent, nextPath);
          this.props.toggleLoginModal(true);
        }
      });
    });
  };

  unbindNavbarLinks = () => {
    [...document.querySelectorAll('.login-required')].forEach(el => {
      el.removeEventListener('click');
    });
  };

  handleCloseModal = () => {
    this.props.toggleLoginModal(false);
    recordEvent({ event: 'login-modal-closed' });
  };

  render() {
    return (
      <div className="profile-nav-container">
        <SearchHelpSignIn
          isLOA3={this.props.isLOA3}
          isLoggedIn={this.props.currentlyLoggedIn}
          isMenuOpen={this.props.utilitiesMenuIsOpen}
          isProfileLoading={this.props.isProfileLoading}
          userGreeting={this.props.userGreeting}
          toggleLoginModal={this.props.toggleLoginModal}
          toggleMenu={this.props.toggleSearchHelpUserMenu}
        />
        <SignInModal
          onClose={this.handleCloseModal}
          visible={this.props.showLoginModal}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentlyLoggedIn: isLoggedIn(state),
  isProfileLoading: isProfileLoading(state),
  isLOA3: isLOA3(state),
  userGreeting: selectUserGreeting(state),
  ...state.navigation,
});

const mapDispatchToProps = {
  toggleLoginModal,
  toggleSearchHelpUserMenu,
  updateLoggedInStatus,
  initializeProfile,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main);

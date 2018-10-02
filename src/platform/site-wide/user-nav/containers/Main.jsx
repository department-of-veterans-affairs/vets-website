import React from 'react';
import { connect } from 'react-redux';
import appendQuery from 'append-query';
import URLSearchParams from 'url-search-params';

import recordEvent from '../../../monitoring/record-event';

import SignInModal from '../../../user/authentication/components/SignInModal';
import {
  isLoggedIn,
  isProfileLoading,
  isLOA3
} from '../../../user/selectors';
import { initializeProfile } from '../../../user/profile/actions';
import { updateLoggedInStatus } from '../../../user/authentication/actions';
import conditionalStorage from '../../../utilities/storage/conditionalStorage';

import {
  toggleLoginModal,
  toggleSearchHelpUserMenu
} from '../../../site-wide/user-nav/actions';

import SearchHelpSignIn from '../components/SearchHelpSignIn';
import { selectUserGreeting } from '../selectors';

import dashboardManifest from '../../../../applications/personalization/dashboard/manifest';
import isBrandConsolidationEnabled from '../../../../platform/brand-consolidation/feature-flag';

const brandConsolidationEnabled = isBrandConsolidationEnabled();

const DASHBOARD_URL = dashboardManifest.rootUrl;

// const SESSION_REFRESH_INTERVAL_MINUTES = 45;

export class Main extends React.Component {
  componentDidMount() {
    window.addEventListener('message', this.setToken);
    this.bindModalTriggers();
    this.bindNavbarLinks();

    // In some cases this component is mounted on a url that is part of the login process and doesn't need to make another
    // request, because that data will be passed to the parent window and done there instead.
    if (!window.location.pathname.includes('auth/login/callback')) {
      window.addEventListener('load', this.checkTokenStatus);
    }
  }

  componentDidUpdate() {
    const { currentlyLoggedIn, showLoginModal } = this.props;
    const shouldCloseLoginModal = currentlyLoggedIn && showLoginModal;

    if (currentlyLoggedIn) this.executeRedirect();

    if (shouldCloseLoginModal) { this.props.toggleLoginModal(false); }
  }

  componentWillUnmount() {
    this.unbindNavbarLinks();
  }

  setToken = (event) => {
    if (event.data === conditionalStorage().getItem('userToken')) {
      this.executeRedirect();
      this.props.initializeProfile();
    }
  }

  getNextParameter() {
    const nextParam = (new URLSearchParams(window.location.search)).get('next');
    if (nextParam) {
      return nextParam.startsWith('/') ? nextParam : `/${nextParam}`;
    }
    return false;
  }

  getRedirectUrl = () => {
    const nextParam = this.getNextParameter();
    if (nextParam) return nextParam;

    if (brandConsolidationEnabled) return null;

    // remove this line when refacotring isBrandConsolidationEnabled
    return window.location.pathname === '/' && DASHBOARD_URL;
  };

  executeRedirect() {
    const redirectUrl = this.getRedirectUrl();
    const shouldRedirect = redirectUrl && !window.location.pathname.includes('verify');

    if (shouldRedirect) {
      window.location.replace(redirectUrl);
    }
  }

  bindModalTriggers = () => {
    const triggers = Array.from(document.querySelectorAll('.signin-signup-modal-trigger'));
    const openLoginModal = () => this.props.toggleLoginModal(true);
    triggers.forEach(t => t.addEventListener('click', openLoginModal));
  }

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
  }

  unbindNavbarLinks = () => {
    [...document.querySelectorAll('.login-required')].forEach(el => {
      el.removeEventListener('click');
    });
  }

  checkTokenStatus = () => {
    if (!conditionalStorage().getItem('userToken')) {
      this.props.updateLoggedInStatus(false);
      if (this.getNextParameter()) { this.props.toggleLoginModal(true); }
    } else {
      this.props.initializeProfile();
    }
  }

  handleCloseModal = () => {
    this.props.toggleLoginModal(false);
    recordEvent({ event: 'login-modal-closed' });
  }

  render() {
    return (
      <div>
        <SearchHelpSignIn
          isLOA3={this.props.isLOA3}
          isLoggedIn={this.props.currentlyLoggedIn}
          isMenuOpen={this.props.utilitiesMenuIsOpen}
          isProfileLoading={this.props.isProfileLoading}
          userGreeting={this.props.userGreeting}
          toggleLoginModal={this.props.toggleLoginModal}
          toggleMenu={this.props.toggleSearchHelpUserMenu}/>
        <SignInModal
          onClose={this.handleCloseModal}
          visible={this.props.showLoginModal}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentlyLoggedIn: isLoggedIn(state),
    isProfileLoading: isProfileLoading(state),
    isLOA3: isLOA3(state),
    userGreeting: selectUserGreeting(state),
    ...state.navigation
  };
};

const mapDispatchToProps = {
  toggleLoginModal,
  toggleSearchHelpUserMenu,
  updateLoggedInStatus,
  initializeProfile
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);

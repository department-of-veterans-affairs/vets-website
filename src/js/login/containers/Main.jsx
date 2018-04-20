import React from 'react';
import { connect } from 'react-redux';
import appendQuery from 'append-query';
import URLSearchParams from 'url-search-params';

import recordEvent from '../../../platform/monitoring/record-event';
import { getUserData } from '../../common/helpers/login-helpers';
import { isUserRegisteredForBeta } from '../../personalization/beta-enrollment/actions';

import {
  updateLoggedInStatus,
  toggleLoginModal,
  toggleSearchHelpUserMenu
} from '../actions';

import SearchHelpSignIn from '../components/SearchHelpSignIn';
import SignInModal from '../components/SignInModal';

// const SESSION_REFRESH_INTERVAL_MINUTES = 45;

export class Main extends React.Component {
  componentDidMount() {
    window.addEventListener('message', this.setToken);
    this.bindNavbarLinks();

    // In some cases this component is mounted on a url that is part of the login process and doesn't need to make another
    // request, because that data will be passed to the parent window and done there instead.
    if (!window.location.pathname.includes('auth/login/callback')) {
      window.addEventListener('load', this.checkTokenStatus);
    }
  }

  componentDidUpdate(prevProps) {
    const { currentlyLoggedIn, showModal } = this.props.login;
    const nextParam = this.getRedirectUrl();

    const shouldRedirect =
      currentlyLoggedIn && nextParam && !window.location.pathname.includes('verify');

    if (shouldRedirect) {
      const redirectPath = nextParam.startsWith('/') ? nextParam : `/${nextParam}`;
      window.location.replace(redirectPath);
    }

    const shouldCloseLoginModal =
      !prevProps.login.currentlyLoggedIn && currentlyLoggedIn && showModal;

    if (shouldCloseLoginModal) { this.props.toggleLoginModal(false); }
  }

  componentWillUnmount() {
    this.unbindNavbarLinks();
  }

  setToken = (event) => {
    if (event.data === sessionStorage.userToken) { this.props.getUserData(); }
  }

  getRedirectUrl = () => (new URLSearchParams(window.location.search)).get('next');

  bindNavbarLinks = () => {
    [...document.querySelectorAll('.login-required')].forEach(el => {
      el.addEventListener('click', e => {
        if (!this.props.login.currentlyLoggedIn) {
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
    if (sessionStorage.userToken) {
      // @todo once we have time to replace the confirm dialog with an actual modal we should uncomment this code.
      // if (moment() > moment(sessionStorage.entryTime).add(SESSION_REFRESH_INTERVAL_MINUTES, 'm')) {
      //   if (confirm('For security, you’ll be automatically signed out in 2 minutes. To stay signed in, click OK.')) {
      //     login();
      //   } else {
      //     logout();
      //   }
      // } else {
      //   if (this.props.getUserData()) {
      //     this.props.updateLoggedInStatus(true);
      //   }
      // }

      // @todo after doing the above, remove this code.
      if (this.props.getUserData()) {
        recordEvent({ event: 'login-user-logged-in' });
        this.props.updateLoggedInStatus(true);
      }
    } else {
      this.props.updateLoggedInStatus(false);
      if (this.getRedirectUrl()) { this.props.toggleLoginModal(true); }
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
          isLoggedIn={this.props.login.currentlyLoggedIn}
          isMenuOpen={this.props.login.utilitiesMenuIsOpen}
          isUserRegisteredForBeta={this.props.isUserRegisteredForBeta}
          profile={this.props.profile}
          toggleLoginModal={this.props.toggleLoginModal}
          toggleMenu={this.props.toggleSearchHelpUserMenu}/>
        <SignInModal
          onClose={this.handleCloseModal}
          visible={this.props.login.showModal}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const userState = state.user;
  return {
    login: userState.login,
    profile: userState.profile
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    isUserRegisteredForBeta: (service) => {
      dispatch(isUserRegisteredForBeta(service));
    },
    toggleLoginModal: (update) => {
      dispatch(toggleLoginModal(update));
    },
    toggleSearchHelpUserMenu: (menu, isOpen) => {
      dispatch(toggleSearchHelpUserMenu(menu, isOpen));
    },
    updateLoggedInStatus: (update) => {
      dispatch(updateLoggedInStatus(update));
    },
    getUserData: () => {
      getUserData(dispatch);
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);

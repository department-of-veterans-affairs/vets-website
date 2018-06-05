import React from 'react';
import { connect } from 'react-redux';
import appendQuery from 'append-query';
import URLSearchParams from 'url-search-params';
import addMenuListeners from '../../accessible-menus';

import recordEvent from '../../../monitoring/record-event';

import SignInModal from '../../../user/authentication/components/SignInModal';
import {
  isLoggedIn,
  isProfileLoading,
  isLOA3
} from '../../../user/selectors';
import { getProfile } from '../../../user/profile/actions';
import { updateLoggedInStatus } from '../../../user/authentication/actions';

import {
  toggleLoginModal,
  toggleSearchHelpUserMenu
} from '../../../site-wide/user-nav/actions';

import SearchHelpSignIn from '../components/SearchHelpSignIn';
import { selectUserGreeting } from '../selectors';

// const SESSION_REFRESH_INTERVAL_MINUTES = 45;

export class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      arias: {},
      panelOpen: false,
    };
  }

  componentDidMount() {
    window.addEventListener('message', this.setToken);
    this.bindNavbarLinks();

    // In some cases this component is mounted on a url that is part of the login process and doesn't need to make another
    // request, because that data will be passed to the parent window and done there instead.
    if (!window.location.pathname.includes('auth/login/callback')) {
      window.addEventListener('load', this.checkTokenStatus);
    }
  }

  componentDidUpdate() {
    addMenuListeners(document.querySelector('#vetnav-menu'), true);
    const { currentlyLoggedIn, showLoginModal } = this.props;
    const nextParam = this.getRedirectUrl();

    const shouldRedirect =
      currentlyLoggedIn && nextParam && !window.location.pathname.includes('verify');

    if (shouldRedirect) {
      const redirectPath = nextParam.startsWith('/') ? nextParam : `/${nextParam}`;
      window.location.replace(redirectPath);
    }

    const shouldCloseLoginModal = currentlyLoggedIn && showLoginModal;

    if (shouldCloseLoginModal) { this.props.toggleLoginModal(false); }
  }

  componentWillUnmount() {
    this.unbindNavbarLinks();
  }

  setToken = (event) => {
    if (event.data === sessionStorage.userToken) { this.props.getProfile(); }
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
      //   if (this.props.getProfile()) {
      //     this.props.updateLoggedInStatus(true);
      //   }
      // }

      // @todo after doing the above, remove this code.
      if (this.props.getProfile()) {
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

  handleOnClick() {
    if (this.state['aria-expanded']) {
      this.setState({
        arias: {},
      });
    } else {
      this.setState({
        arias: {
          'aria-expanded': true,
        },
        panelOpen: true,
      });

      debugger
    }
  }

  panelOpen() {
    return 'hidden';
  }

  render() {
    return (
      <div className="login-container">
        <div className="row va-flex">
          <div id="vetnav" role="navigation">
            <ul id="vetnav-menu" role="menubar">
              <li><a href="/" className="vetnav-level1" role="menuitem">Home</a></li>

              <li>
                <button
                  {...this.state.arias}
                  aria-controls="vetnav-explore"
                  role="button"
                  aria-haspopup="true"
                  className="vetnav-level1"
                  onClick={() => this.handleOnClick()}>Explore and Apply for Benefits</button>
                {
                    this.state.panelOpen && <div id="vetnav-explore" className="vetnav-panel" role="none">
                      <ul role="menu" aria-label="Explore benefits">
                    <li>
                      <button
                            className="vetnav-level2"
                            role="button"
                        aria-haspopup="true"
                            aria-controls="vetnav-disability"
                            onClick="recordEvent({ event: 'nav-header-second-level' });">Disability</button>
                          <ul
                        className="vetnav-panel vetnav-panel--submenu"
                            id="vetnav-disability"
                            role="menu"
                            aria-label="Disability">
                            <li>
                              <button
                                className="back-button"
                                aria-controls="vetnav-disability">Back to Menu</button>
                              <div className="vetnav-level2-heading">Disability</div>
                            </li>
                            <li><a href="/disability-benefits/" onClick="">Disability Benefits Overview</a></li>
                            <li><a href="/disability-benefits/eligibility/" onClick="">Eligibility</a></li>
                            <li><a href="/disability-benefits/apply/" onClick="">Application Process</a></li>
                            <li><a href="/disability-benefits/conditions/" onClick="">Conditions</a></li>
                            <li><a className="login-required" href="/track-claims/" onClick="">Track Your Claims and Appeals</a></li>
                            <li><a href="/disability-benefits/claims-appeal/" onClick="">Appeals Process</a></li>
                            <li><a className="usa-button va-button-primary va-external--light" href="https://www.ebenefits.va.gov/ebenefits/about/feature?feature=disability-compensation" onClick="">Go to eBenefits to Apply include "assets/img/icons/exit-icon-white.svg"</a></li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  }
              </li>
            </ul>
          </div>
        </div>
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
  getProfile
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);

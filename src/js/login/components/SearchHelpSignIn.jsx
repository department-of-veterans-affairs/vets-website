import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import URLSearchParams from 'url-search-params';
import classNames from 'classnames';

import recordEvent from '../../../platform/monitoring/record-event';
import HelpMenu from '../../common/components/HelpMenu';
import SearchMenu from '../../common/components/SearchMenu';
import SignInProfileMenu from './SignInProfileMenu';

import { toggleLoginModal, toggleSearchHelpUserMenu } from '../actions';
import { isUserRegisteredForBeta } from '../../personalization/beta-enrollment/actions';

export class SearchHelpSignIn extends React.Component {
  componentDidUpdate() {
    const { currentlyLoggedIn, showModal } = this.props.login;
    if (!currentlyLoggedIn && !showModal) {
      const nextParams = new URLSearchParams(window.location.search);
      const nextPath = nextParams.get('next');
      if (nextPath) {
        this.props.toggleLoginModal(true);
      }
    }
  }

  handleSignInSignUp = (e) => {
    e.preventDefault();
    recordEvent({ event: 'login-link-clicked' });
    this.props.toggleLoginModal(true);
  }

  hasSession() {
    // Includes a safety check because sessionStorage is not defined during e2e testing
    return !!(window.sessionStorage && window.sessionStorage.getItem('userFirstName'));
  }

  render() {
    let content;
    const login = this.props.login;
    const isLoading = this.props.profile.loading;
    const hasSession = this.hasSession();

    // If we're done loading, and the user is logged in, or loading is in progress,
    // and we have information is session storage, we can go ahead and render.
    if ((!isLoading && login.currentlyLoggedIn) || (isLoading && hasSession)) {
      const firstName = _.startCase(_.toLower(
        this.props.profile.userFullName.first || sessionStorage.userFirstName
      ));
      const greeting = firstName || this.props.profile.email;

      content = (<SignInProfileMenu
        disabled={isLoading}
        clickHandler={() => {
          this.props.toggleSearchHelpUserMenu('account', !login.utilitiesMenuIsOpen.account);
        }}
        isUserRegisteredForBeta={this.props.isUserRegisteredForBeta}
        greeting={greeting}
        isOpen={login.utilitiesMenuIsOpen.account}/>);
    } else {
      const classes = classNames({ disabled: isLoading });
      content = (<div>
        <a href="#" className={classes} onClick={this.handleSignInSignUp}><span>Sign In</span><span className="signin-spacer">|</span><span>Sign Up</span></a>
      </div>
      );
    }

    return (
      <div className="profile-nav">
        <SearchMenu
          isOpen={login.utilitiesMenuIsOpen.search}
          clickHandler={() => {
            this.props.toggleSearchHelpUserMenu('search', !login.utilitiesMenuIsOpen.search);
          }}/>
        <HelpMenu
          isOpen={login.utilitiesMenuIsOpen.help}
          clickHandler={() => {
            this.props.toggleSearchHelpUserMenu('help', !login.utilitiesMenuIsOpen.help);
          }}/>
        <div className="sign-in-link">
          {content}
        </div>
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

const mapDispatchToProps = {
  toggleLoginModal,
  toggleSearchHelpUserMenu,
  isUserRegisteredForBeta
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchHelpSignIn);

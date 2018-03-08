import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import URLSearchParams from 'url-search-params';
import classNames from 'classnames';

import DashboardRedirect from '../../common/components/DashboardRedirect';
import HelpMenu from '../../common/components/HelpMenu';
import SearchMenu from '../../common/components/SearchMenu';
import SignInProfileMenu from './SignInProfileMenu';

import { toggleLoginModal, toggleSearchHelpUserMenu } from '../actions';

class SearchHelpSignIn extends React.Component {
  componentDidMount() {
    const nextParams = new URLSearchParams(window.location.search);
    const nextPath = nextParams.get('next');
    if (nextPath) {
      this.props.toggleLoginModal(true);
    }
  }

  handleSigninSignup = (e) => {
    e.preventDefault();
    window.dataLayer.push({ event: 'login-link-clicked' });
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
        betaFeatures={this.props.betaFeatures}
        greeting={greeting}
        isOpen={login.utilitiesMenuIsOpen.account}
        onUserLogout={this.props.onUserLogout}/>);
    } else {
      const classes = classNames({ disabled: isLoading });
      content = (<div>
        <a href="#" className={classes} onClick={this.handleSigninSignup}><span>Sign In</span><span className="signin-spacer">|</span><span>Sign Up</span></a>
      </div>
      );
    }
    return (
      <div className="profileNav">
        <DashboardRedirect services={this.props.profile.services}/>
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
    profile: userState.profile,
    betaFeatures: state.betaFeatures
  };
};

const mapDispatchToProps = {
  toggleLoginModal,
  toggleSearchHelpUserMenu,
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchHelpSignIn);
export { SearchHelpSignIn };

import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import classNames from 'classnames';

import recordEvent from '../../../platform/monitoring/record-event';
import HelpMenu from '../../common/components/HelpMenu';
import SearchMenu from '../../common/components/SearchMenu';
import SignInProfileMenu from './SignInProfileMenu';

import { toggleLoginModal, toggleSearchHelpUserMenu } from '../actions';
import { isUserRegisteredForBeta } from '../../personalization/beta-enrollment/actions';

export class SearchHelpSignIn extends React.Component {
  handleSignInSignUp = (e) => {
    e.preventDefault();
    recordEvent({ event: 'login-link-clicked' });
    this.props.toggleLoginModal(true);
  }

  handleMenuClick = (menu) => (() => {
    const isMenuOpen = this.props.login.utilitiesMenuIsOpen[menu];
    this.props.toggleSearchHelpUserMenu(menu, !isMenuOpen);
  });

  handleSearchMenuClick = this.handleMenuClick('search');
  handleHelpMenuClick = this.handleMenuClick('help');
  handleAccountMenuClick = this.handleMenuClick('account');

  hasSession = () => {
    // Includes a safety check because sessionStorage is not defined during e2e testing
    return !!(window.sessionStorage && window.sessionStorage.getItem('userFirstName'));
  }

  renderSignInContent = () => {
    const { login, profile } = this.props;
    const isLoading = profile.loading;
    const shouldRenderSignedInContent =
      (!isLoading && login.currentlyLoggedIn) ||
      (isLoading && this.hasSession());

    // If we're done loading, and the user is logged in, or loading is in progress,
    // and we have information is session storage, we can go ahead and render.
    if (shouldRenderSignedInContent) {
      const firstName = _.startCase(_.toLower(
        profile.userFullName.first || sessionStorage.userFirstName
      ));

      const greeting = firstName || profile.email;

      return (
        <SignInProfileMenu
          disabled={isLoading}
          clickHandler={this.handleAccountMenuClick}
          isUserRegisteredForBeta={this.props.isUserRegisteredForBeta}
          greeting={greeting}
          isOpen={login.utilitiesMenuIsOpen.account}/>
      );
    }

    const classes = classNames({ disabled: isLoading });

    return (
      <div>
        <a href="#" className={classes} onClick={this.handleSignInSignUp}>
          <span>Sign In</span><span className="signin-spacer">|</span><span>Sign Up</span>
        </a>
      </div>
    );
  }

  render() {
    const {
      search: isSearchOpen,
      help: isHelpOpen
    } = this.props.login.utilitiesMenuIsOpen;

    return (
      <div className="profile-nav">
        <SearchMenu
          isOpen={isSearchOpen}
          clickHandler={this.handleSearchMenuClick}/>
        <HelpMenu
          isOpen={isHelpOpen}
          clickHandler={this.handleHelpMenuClick}/>
        <div className="sign-in-link">
          {this.renderSignInContent()}
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

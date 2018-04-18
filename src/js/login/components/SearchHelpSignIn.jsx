import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import recordEvent from '../../../platform/monitoring/record-event';
import HelpMenu from '../../common/components/HelpMenu';
import SearchMenu from '../../common/components/SearchMenu';
import SignInProfileMenu from './SignInProfileMenu';

class SearchHelpSignIn extends React.Component {
  handleSignInSignUp = (e) => {
    e.preventDefault();
    recordEvent({ event: 'login-link-clicked' });
    this.props.toggleLoginModal(true);
  }

  handleMenuClick = (menu) => (() => {
    this.props.toggleMenu(menu, !this.props.isMenuOpen[menu]);
  });

  handleSearchMenuClick = this.handleMenuClick('search');
  handleHelpMenuClick = this.handleMenuClick('help');
  handleAccountMenuClick = this.handleMenuClick('account');

  hasSession = () => {
    // Includes a safety check because sessionStorage is not defined during e2e testing
    return !!(window.sessionStorage && window.sessionStorage.getItem('userFirstName'));
  }

  renderSignInContent = () => {
    const { profile } = this.props;
    const isLoading = profile.loading;
    const shouldRenderSignedInContent =
      (!isLoading && this.props.isLoggedIn) ||
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
          isOpen={this.props.isMenuOpen.account}/>
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
    return (
      <div className="profile-nav">
        <SearchMenu
          isOpen={this.props.isMenuOpen.search}
          clickHandler={this.handleSearchMenuClick}/>
        <HelpMenu
          isOpen={this.props.isMenuOpen.help}
          clickHandler={this.handleHelpMenuClick}/>
        <div className="sign-in-link">
          {this.renderSignInContent()}
        </div>
      </div>
    );
  }
}

SearchHelpSignIn.propTypes = {
  isLoggedIn: PropTypes.bool,
  isMenuOpen: PropTypes.objectOf(PropTypes.bool).isRequired,
  isUserRegisteredForBeta: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    email: PropTypes.string,
    loading: PropTypes.bool,
    userFullName: PropTypes.shape({
      first: PropTypes.string
    })
  }).isRequired,
  toggleLoginModal: PropTypes.func.isRequired,
  toggleMenu: PropTypes.func.isRequired
};

export default SearchHelpSignIn;

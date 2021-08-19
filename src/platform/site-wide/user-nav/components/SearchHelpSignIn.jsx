// Node modules.
import PropTypes from 'prop-types';
import React, { Component } from 'react';
// Relative imports.
import SearchMenu from './SearchMenu';
import SignInProfileMenu from './SignInProfileMenu';
import isVATeamSiteSubdomain from '../../../utilities/environment/va-subdomain';
import recordEvent from 'platform/monitoring/record-event';
import { hasSession } from 'platform/user/profile/utilities';

class SearchHelpSignIn extends Component {
  handleSignInSignUp = e => {
    e.preventDefault();
    this.props.onSignInSignUp();
    recordEvent({
      event: 'nav-jumplink-click',
    });
  };

  handleMenuClick = menu => () => {
    this.props.toggleMenu(menu, !this.props.isMenuOpen[menu]);
  };

  handleSearchMenuClick = this.handleMenuClick('search');
  handleAccountMenuClick = this.handleMenuClick('account');

  renderSignInContent = () => {
    const isLoading = this.props.isProfileLoading;
    const shouldRenderSignedInContent =
      (!isLoading && this.props.isLoggedIn) || (isLoading && hasSession());

    const isSubdomain = isVATeamSiteSubdomain();

    // Render if (1) profile has loaded and the user is confirmed logged in or
    // (2) loading is in progress and the session is still considered active.
    if (shouldRenderSignedInContent) {
      return (
        <SignInProfileMenu
          disabled={isLoading}
          clickHandler={this.handleAccountMenuClick}
          greeting={this.props.userGreeting}
          isOpen={this.props.isMenuOpen.account}
          isLOA3={this.props.isLOA3}
        />
      );
    }

    return (
      <div className="sign-in-links">
        {!isSubdomain && (
          <button className="sign-in-link" onClick={this.handleSignInSignUp}>
            Sign in
          </button>
        )}
        {isSubdomain && (
          <a
            className="usa-button sign-in-link"
            href={`https://www.va.gov/my-va`}
            onClick={() => recordEvent({ event: 'nav-jumplink-click' })}
          >
            Sign in
          </a>
        )}
      </div>
    );
  };

  render() {
    return (
      <div className="vads-u-display--flex vads-u-align-items--center vads-u-padding-top--1">
        <SearchMenu
          clickHandler={this.handleSearchMenuClick}
          isOpen={this.props.isMenuOpen.search}
        />
        <a
          className="vads-u-color--white vads-u-text-decoration--none vads-u-padding-x--1 vads-u-font-weight--bold"
          href="https://www.va.gov/contact-us/"
          onClick={() => recordEvent({ event: 'nav-jumplink-click' })}
        >
          Contact us
        </a>
        <div className="sign-in-nav">{this.renderSignInContent()}</div>
      </div>
    );
  }
}

SearchHelpSignIn.propTypes = {
  isLOA3: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  isMenuOpen: PropTypes.objectOf(PropTypes.bool).isRequired,
  isProfileLoading: PropTypes.bool.isRequired,
  onSignInSignUp: PropTypes.func.isRequired,
  toggleMenu: PropTypes.func.isRequired,
  userGreeting: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

export default SearchHelpSignIn;

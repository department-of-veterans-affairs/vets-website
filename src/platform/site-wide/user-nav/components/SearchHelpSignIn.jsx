import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import isBrandConsolidationEnabled from '../../../brand-consolidation/feature-flag';
import isVATeamSiteSubdomain from '../../../brand-consolidation/va-subdomain';
import recordEvent from '../../../monitoring/record-event';
import { hasSession } from '../../../user/profile/utilities';
import HelpMenu from './HelpMenu';
import SearchMenu from './SearchMenu';
import SignInProfileMenu from './SignInProfileMenu';

class SearchHelpSignIn extends React.Component {
  handleSignInSignUp = e => {
    e.preventDefault();
    recordEvent({ event: 'login-link-clicked-header' });
    this.props.toggleLoginModal(true);
  };

  handleMenuClick = menu => () => {
    this.props.toggleMenu(menu, !this.props.isMenuOpen[menu]);
  };

  handleSearchMenuClick = this.handleMenuClick('search');
  handleHelpMenuClick = this.handleMenuClick('help');
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

    const buttonClasses = classNames({
      'va-button-link': true,
      'sign-in-link': true,
    });

    if (!isBrandConsolidationEnabled()) {
      return (
        <div className="sign-in-links">
          <button className={buttonClasses} onClick={this.handleSignInSignUp}>
            Sign In
          </button>
          <span className="sign-in-spacer">|</span>
          <button className={buttonClasses} onClick={this.handleSignInSignUp}>
            Sign Up
          </button>
        </div>
      );
    }

    return (
      <div className="sign-in-links">
        {!isSubdomain && (
          <button className="sign-in-link" onClick={this.handleSignInSignUp}>
            Sign In
          </button>
        )}
        {isSubdomain && (
          <a
            className="usa-button sign-in-link"
            href={`https://www.va.gov/my-va`}
          >
            Sign In
          </a>
        )}
      </div>
    );
  };

  render() {
    return (
      <div className="profile-nav">
        <SearchMenu
          isOpen={this.props.isMenuOpen.search}
          clickHandler={this.handleSearchMenuClick}
        />
        <HelpMenu
          isOpen={this.props.isMenuOpen.help}
          clickHandler={this.handleHelpMenuClick}
        />
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
  userGreeting: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  toggleLoginModal: PropTypes.func.isRequired,
  toggleMenu: PropTypes.func.isRequired,
};

export default SearchHelpSignIn;

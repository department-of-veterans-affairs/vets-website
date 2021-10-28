// Node modules.
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// Relative imports.
import './styles.scss';
import OfficialGovtWebsite from '../OfficialGovtWebsite';
import VeteranCrisisLine from '../VeteranCrisisLine';
import { toggleFormSignInModal } from '../../../user-nav/actions';

export const Header = () => {
  return (
    <header className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0">
      {/* Official government website banner */}
      <OfficialGovtWebsite />

      {/* Veteran crisis line */}
      <VeteranCrisisLine />

      <div className="vads-u-background-color--primary-darkest vads-u-display--flex vads-u-align-items--center vads-u-justify-content--space-between vads-u-padding-y--0p5 vads-u-padding-left--1p5 vads-u-padding-right--1">
        {/* Logo */}
        <a href="/" className="header-logo">
          <img src="/img/header-logo-v2.png" alt="Go to VA.gov" />
        </a>

        <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-align-items--center">
          {/* Sign in button */}
          <button
            className="header-sign-in-button va-button-link vads-u-color--white vads-u-text-decoration--none"
            onClick={toggleFormSignInModal()}
            type="button"
          >
            Sign in
          </button>

          {/* Mobile menu button */}
          <button
            className="header-menu-button usa-button vads-u-background-color--white vads-u-color--link-default vads-u-padding-y--1 vads-u-padding-x--1p5 vads-u-margin--0 vads-u-margin-left--2"
            type="button"
          >
            Menu
            <i
              aria-hidden="true"
              className="fa fa-bars vads-u-margin-left--1 vads-u-font-size--sm"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  megaMenuData: PropTypes.arrayOf(PropTypes.object).isRequired,
  showMegaMenu: PropTypes.bool.isRequired,
  showNavLogin: PropTypes.bool.isRequired,
};

const mapDispatchToProps = dispatch => ({
  toggleFormSignInModal: () => dispatch(toggleFormSignInModal()),
});

export default connect(
  null,
  mapDispatchToProps,
)(Header);

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import recordEvent from '~/platform/monitoring/record-event';
import Logo from '../Logo';
import UserNav from '../../../user-nav/containers/Main';
import { updateExpandedMenuIDAction } from '../../containers/Menu/actions';

export const LogoRow = ({
  isMenuOpen,
  setIsMenuOpen,
  showNavLogin = true,
  updateExpandedMenuID,
}) => {
  const onMenuToggle = () => {
    recordEvent({ event: 'nav-header-menu-expand' });
    updateExpandedMenuID();
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="header-logo-row vads-u-background-color--primary-darker vads-u-display--flex vads-u-align-items--center vads-u-justify-content--space-between vads-u-padding-y--1p5 vads-u-padding-left--1p5 vads-u-padding-right--1">
      <a
        aria-label="VA logo"
        className="header-logo vads-u-display--flex vads-u-align-items--center vads-u-justify-content--center"
        href="/"
        onClick={() => recordEvent({ event: 'nav-header-logo' })}
      >
        <Logo />
      </a>
      <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-align-items--center">
        <UserNav isHeaderV2 showNavLogin={showNavLogin} />
        {showNavLogin && (
          <button
            aria-controls="header-nav-items"
            aria-expanded={isMenuOpen ? 'true' : 'false'}
            className="header-menu-button usa-button vads-u-display--flex vads-u-background-color--gray-lightest vads-u-color--link-default vads-u-padding--1p5 vads-u-margin--0 vads-u-margin-left--2 vads-u-position--relative"
            onClick={onMenuToggle}
            style={{ zIndex: 1 }}
            type="button"
          >
            {!isMenuOpen ? 'Menu' : 'Close'}
            {!isMenuOpen ? (
              <>
                {/* hamburger icon */}
                {/* Convert to va-icon when injected header/footer split is in prod: https://github.com/department-of-veterans-affairs/vets-website/pull/27590 */}
                <svg
                  aria-hidden="true"
                  className="vads-u-margin-left--0p5"
                  focusable="false"
                  viewBox="1 2 16 16"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#005ea2"
                    d="M4 17V15H22V17H4ZM4 12V10H22V12H4ZM4 7V5H22V7H4Z"
                  />
                </svg>
              </>
            ) : (
              <>
                {/* close icon */}
                {/* Convert to va-icon when injected header/footer split is in prod: https://github.com/department-of-veterans-affairs/vets-website/pull/27590 */}
                <svg
                  aria-hidden="true"
                  className="vads-u-margin-left--0p5"
                  focusable="false"
                  viewBox="3 3 16 16"
                  width="15"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#005ea2"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                  />
                </svg>
              </>
            )}
            {isMenuOpen && (
              <div className="header-menu-button-overlay vads-u-background-color--gray-lightest vads-u-position--absolute vads-u-width--full" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

LogoRow.propTypes = {
  isMenuOpen: PropTypes.bool.isRequired,
  setIsMenuOpen: PropTypes.func.isRequired,
  showNavLogin: PropTypes.bool,
  updateExpandedMenuID: PropTypes.func,
};

const mapDispatchToProps = dispatch => ({
  updateExpandedMenuID: expandedMenuID =>
    dispatch(updateExpandedMenuIDAction(expandedMenuID)),
});

export default connect(
  null,
  mapDispatchToProps,
)(LogoRow);

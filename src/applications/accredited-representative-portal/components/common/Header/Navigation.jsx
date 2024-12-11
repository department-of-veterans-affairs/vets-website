import React from 'react';
import { useSelector } from 'react-redux';
import UserNav from './UserNav';
import {
  selectUserProfile,
  selectIsUserLoading,
} from '../../../selectors/user';

export const MobileLogoRow = () => {
  const profile = useSelector(selectUserProfile);
  const isLoading = useSelector(selectIsUserLoading);

  return (
    <nav className="nav vads-u-background-color--primary-darker ">
      <div className="nav__container vads-u-display--flex">
        <a
          data-testid="nav-home-link"
          aria-label="VA logo"
          className="nav__link vads-u-display--flex"
          href="/representative"
        >
          <img
            data-testid="mobile-logo"
            className="nav__logo mobile"
            src="/img/va.svg"
            alt="Veteran Affairs logo"
          />
          <span className="nav__logo-text mobile">
            Accredited Representative Portal
          </span>
          <img
            data-testid="desktop-logo"
            className="nav__logo nav__logo--desktop desktop"
            src="/img/arp-header-logo.png"
            alt="VA Accredited Representative Portal Logo, U.S. Department of Veterans Affairs"
          />
        </a>
        <UserNav profile={profile} isLoading={isLoading} />
      </div>
      <span
        aria-hidden="true"
        className={
          profile ? 'nav__decorator nav__decorator--login' : 'nav__decorator'
        }
      />
      {profile && (
        <div className="nav__container vads-u-display--flex">
          <a
            className="usa-button nav__user-btn nav__user-btn--user desktop"
            href="/representative/poa-requests"
          >
            POA requests
          </a>
        </div>
      )}
    </nav>
  );
};

export default MobileLogoRow;

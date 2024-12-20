import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserNav from './UserNav';
import {
  selectUserProfile,
  selectIsUserLoading,
} from '../../../selectors/user';

export const Navigation = () => {
  const profile = useSelector(selectUserProfile);
  const isLoading = useSelector(selectIsUserLoading);

  return (
    <nav className="nav vads-u-background-color--primary-darker ">
      <div className="nav__container vads-u-display--flex">
        <Link
          data-testid="nav-home-link"
          aria-label="VA logo"
          className="nav__link vads-u-display--flex"
          to="/"
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
        </Link>
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
          <Link
            className="usa-button nav__user-btn nav__user-btn--user desktop"
            to="/poa-requests"
          >
            POA requests
          </Link>
          <Link
            to="/get-help"
            className="usa-button nav__user-btn nav__user-btn--user desktop"
          >
            Get Help
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navigation;

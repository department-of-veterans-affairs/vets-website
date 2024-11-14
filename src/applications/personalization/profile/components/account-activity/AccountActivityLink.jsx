import React from 'react';
import { PROFILE_PATHS } from '@@profile/constants';
import { NavLink } from 'react-router-dom';

export default function AccountActivityLink() {
  return (
    <>
      <p className="vads-u-margin--0">
        Track the different actions your account has taken.
      </p>
      <p className="vads-u-margin-bottom--0">
        <NavLink
          activeClassName="is-active"
          exact
          to={PROFILE_PATHS.ACCOUNT_ACTIVITY}
        >
          View your account activity
        </NavLink>
      </p>
    </>
  );
}

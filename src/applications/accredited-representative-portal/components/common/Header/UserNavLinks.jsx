import React from 'react';
import { Link } from 'react-router-dom-v5-compat';
import { SIGN_OUT_URL } from '../../../constants';

const UserNavLinks = () => {
  return (
    <ul className="nav__user-list">
      <li>
        <Link
          data-testid="user-nav-profile-link"
          className="vads-u-color--black"
          to="/insert-link"
        >
          Profile
        </Link>
      </li>
      <li>
        <Link
          data-testid="user-nav-sign-out-link"
          className="vads-u-color--black"
          to={SIGN_OUT_URL}
        >
          Sign Out
        </Link>
      </li>
    </ul>
  );
};
export default UserNavLinks;

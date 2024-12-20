import React from 'react';
import { Link } from 'react-router-dom';
import { SIGN_OUT_URL } from '../../../constants';

const UserNavLinks = () => {
  return (
    <ul className="nav__user-list">
      <li>
        <Link
          data-testid="user-nav-profile-link"
          className="vads-u-color--black"
          to="/profile"
        >
          Profile
        </Link>
      </li>
      <li>
        <a
          data-testid="user-nav-sign-out-link"
          className="vads-u-color--black"
          href={SIGN_OUT_URL}
        >
          Sign Out
        </a>
      </li>
    </ul>
  );
};
export default UserNavLinks;

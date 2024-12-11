import React from 'react';
import { SIGN_OUT_URL } from '../../../constants';

const UserNavLinks = () => {
  return (
    <ul className="nav__user-list">
      <li>
        <a
          data-testid="user-nav-profile-link"
          className="vads-u-color--black"
          href="/insert-link"
        >
          Profile
        </a>
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

import React from 'react';
import { Link } from 'react-router-dom';

const UserNavLinks = () => {
  return (
    <>
      <li>
        <Link
          data-testid="user-nav-poa-requests-link"
          className="vads-u-color--black"
          href="/poa-requests"
        >
          POA Requests
        </Link>
      </li>
      <li>
        <Link
          data-testid="user-nav-profile-link"
          className="vads-u-color--black"
          href="/get-help"
        >
          Get Help
        </Link>
      </li>
    </>
  );
};
export default UserNavLinks;

import React from 'react';

const UserNavLinks = () => {
  return (
    <>
      <li>
        <a
          data-testid="user-nav-poa-requests-link"
          className="vads-u-color--black"
          href="/poa-requests"
        >
          POA Requests
        </a>
      </li>
      <li>
        <a
          data-testid="user-nav-profile-link"
          className="vads-u-color--black"
          href="/get-help"
        >
          Get Help
        </a>
      </li>
    </>
  );
};
export default UserNavLinks;

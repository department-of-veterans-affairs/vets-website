import React from 'react';

const ServiceProvidersList = React.memo(() => {
  return (
    <>
      <ul>
        <li>
          A verified <strong>Login.gov</strong> account, <strong>or</strong>
        </li>
        <li>
          A verified <strong>ID.me</strong> account, <strong>or</strong>
        </li>
        <li>
          A Premium <strong>DS Logon</strong> account, <strong>or</strong>
        </li>
      </ul>
      <p>
        If you don’t have one of these accounts, you can create a free{' '}
        <strong>Login.gov</strong> or <strong>ID.me</strong> account.
      </p>
    </>
  );
});

export default ServiceProvidersList;

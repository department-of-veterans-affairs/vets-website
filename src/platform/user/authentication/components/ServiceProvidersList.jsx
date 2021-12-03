import React from 'react';
import { useSelector } from 'react-redux';
import { loginGov } from 'platform/user/authentication/selectors';

const ServiceProvidersList = React.memo(() => {
  const loginGovEnabled = useSelector(state => loginGov(state));

  return (
    <>
      <ul>
        {loginGovEnabled && (
          <li>
            A verified <strong>Login.gov</strong> account, <strong>or</strong>
          </li>
        )}
        <li>
          A verified <strong>ID.me</strong> account, <strong>or</strong>
        </li>
        <li>
          A Premium <strong>DS Logon</strong> account, <strong>or</strong>
        </li>
        <li>
          A Premium <strong>My HealtheVet</strong> account
        </li>
      </ul>
      <p>
        If you don’t have one of these accounts, you can create a free{' '}
        {loginGovEnabled && (
          <>
            <strong>Login.gov</strong> or{' '}
          </>
        )}
        <strong>ID.me</strong> account.
      </p>
    </>
  );
});

export default ServiceProvidersList;

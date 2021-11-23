import React from 'react';
import { useSelector } from 'react-redux';
import { loginGov } from 'platform/user/authentication/selectors';

const ServiceProvidersList = React.memo(() => {
  const loginGovEnabled = useSelector(state => loginGov(state));

  return (
    <ul>
      {loginGovEnabled && (
        <li>
          A verified <strong>Login.gov</strong> account that you can{' '}
          <a href="https://secure.login.gov/sign_up/enter_email">
            create here on VA.gov,
          </a>
          <strong>or</strong>
        </li>
      )}
      <li>
        A verified <strong>ID.me</strong> account that you can also{' '}
        <a href="https://api.id.me/en/registration/new">
          create here on VA.gov,
        </a>
        <strong>or</strong>
      </li>
      <li>
        A Premium <strong>DS Logon</strong> account (used for eBenefits and
        milConnect), <strong>or</strong>
      </li>
      <li>
        A{' '}
        <a href="https://www.myhealth.va.gov/mhv-portal-web/upgrade-account-to-premium#UpgradeToPremiumAccount">
          Premium <strong>My HealtheVet</strong> account
        </a>
      </li>
    </ul>
  );
});

export default ServiceProvidersList;

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { loginGov } from 'platform/user/authentication/selectors';

const initialCSPState = ['ID.me', 'DS Logon', 'My HealtheVet'];

const ServiceProviders = React.memo(({ isBold }) => {
  const [serviceProviders, setCSPs] = useState(initialCSPState);
  const loginGovEnabled = useSelector(state => loginGov(state));

  useEffect(
    () => {
      if (loginGovEnabled) {
        setCSPs(['Login.gov', ...initialCSPState]);
      }
    },
    [loginGovEnabled],
  );

  return serviceProviders.map((csp, i) => {
    const totalProviders = serviceProviders.length;
    const last = i === totalProviders - 1;
    const comma = !last && totalProviders > 2;
    const or = totalProviders >= 2 && last;
    const renderCSP = isBold ? <strong>{csp}</strong> : csp;

    return (
      <>
        {or && 'or '}
        {renderCSP}
        {comma && ','}
        {!last && ' '}
      </>
    );
  });
});

export const ServiceProvidersTextCreateAcct = React.memo(
  ({ isFormBased = false, hasExtraTodo = false }) => {
    const loginGovEnabled = useSelector(state => loginGov(state));

    const isFormComponent = isFormBased
      ? 'completed this form without signing in, and you '
      : null;
    const showLoginGov = loginGovEnabled ? (
      <>
        <strong>Login.gov</strong> or{' '}
      </>
    ) : null;
    const showExtraTodo = hasExtraTodo
      ? ` When you sign in or create an account, you’ll be able to:`
      : null;

    return (
      <>
        If you {isFormComponent}
        don’t have any of these accounts, you can create a free {showLoginGov}
        <strong>ID.me</strong> account now.
        {showExtraTodo}
      </>
    );
  },
);

export default ServiceProviders;

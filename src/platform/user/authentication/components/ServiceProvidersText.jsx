import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { loginGovDisabled } from 'platform/user/authentication/selectors';

const initialCSPState = ['ID.me', 'DS Logon', 'My HealtheVet'];

const ServiceProviders = React.memo(({ isBold }) => {
  const [serviceProviders, setCSPs] = useState(initialCSPState);
  const loginGovOff = useSelector(state => loginGovDisabled(state));

  useEffect(
    () => {
      if (!loginGovOff) {
        setCSPs(['Login.gov', ...initialCSPState]);
      }
    },
    [!loginGovOff],
  );

  return new Intl.ListFormat('en', { style: 'long', type: 'disjunction' })
    .formatToParts(serviceProviders)
    .map(({ type, value }) => {
      return type === 'element' && isBold ? <strong>{value}</strong> : value;
    });
});

export const ServiceProvidersTextCreateAcct = React.memo(
  ({ isFormBased = false, hasExtraTodo = false }) => {
    const loginGovOff = useSelector(state => loginGovDisabled(state));

    const isFormComponent = isFormBased
      ? 'completed this form without signing in, and you '
      : null;
    const showLoginGov = !loginGovOff ? (
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

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { loginGovDisabled } from 'platform/user/authentication/selectors';
import { CTA_WIDGET_TYPES } from 'applications/static-pages/cta-widget/ctaWidgets';

const initialCSPState = ['ID.me', 'DS Logon', 'My HealtheVet'];

const ServiceProviders = React.memo(({ isBold, appId }) => {
  const [serviceProviders, setCSPs] = useState(initialCSPState);
  const loginGovOff = useSelector(state => loginGovDisabled(state));

  useEffect(
    () => {
      let providers = [...initialCSPState];
      if (!loginGovOff) {
        providers = ['Login.gov', ...providers];
      }
      if (appId === CTA_WIDGET_TYPES.DIRECT_DEPOSIT) {
        providers = providers.filter(
          csp => csp !== 'DS Logon' && csp !== 'My HealtheVet',
        );
      }
      setCSPs(providers);
    },
    [appId, loginGovOff],
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

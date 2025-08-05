import React from 'react';

const ServiceProviders = React.memo(({ isBold }) => {
  const serviceProviders = ['ID.me', 'Login.gov'];

  return new Intl.ListFormat('en', { style: 'long', type: 'disjunction' })
    .formatToParts(serviceProviders)
    .map(({ type, value }) => {
      return type === 'element' && isBold ? <strong>{value}</strong> : value;
    });
});

export const ServiceProvidersTextCreateAcct = React.memo(
  ({ isFormBased = false, hasExtraTodo = false }) => {
    const isFormComponent = isFormBased
      ? 'completed this form without signing in, and you '
      : null;
    const showExtraTodo = hasExtraTodo
      ? ` When you sign in or create an account, you’ll be able to:`
      : null;

    return (
      <>
        If you {isFormComponent}
        don’t have any of these accounts, you can create a free{' '}
        <strong>ID.me</strong> or <strong>Login.gov</strong> account now.
        {showExtraTodo}
      </>
    );
  },
);

export default ServiceProviders;

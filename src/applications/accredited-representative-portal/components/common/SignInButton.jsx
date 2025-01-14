import React from 'react';
import PropTypes from 'prop-types';
import { createOAuthRequest } from 'platform/utilities/oauth/utilities';
import { SERVICE_PROVIDERS } from 'platform/user/authentication/constants';

export default function ARFSignInButton({ csp }) {
  if (!csp) return null;
  const { image } = SERVICE_PROVIDERS[csp];

  const onClick = async e => {
    e.preventDefault();

    const url = await createOAuthRequest({
      application: 'arp',
      clientId: 'vaweb',
      type: csp,
    });

    window.location = url;
  };

  return (
    <button
      type="button"
      className={`arf usa-button ${csp}-button`}
      onClick={onClick}
    >
      Sign in with {image}
    </button>
  );
}

ARFSignInButton.propTypes = {
  application: PropTypes.string,
  csp: PropTypes.string,
};

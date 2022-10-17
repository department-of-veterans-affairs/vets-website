import React from 'react';
import { externalApplicationsConfig } from '../usip-config';
import { reduceAllowedProviders, getQueryParams } from '../utilities';
import LoginButton from './LoginButton';
import CreateAccountLink from './CreateAccountLink';

export default function LoginActions({ externalApplication }) {
  const { OAuth } = getQueryParams();
  const { allowedSignInProviders, allowedSignUpProviders, OAuthEnabled } =
    externalApplicationsConfig[externalApplication] ??
    externalApplicationsConfig.default;
  const useSignInService = OAuthEnabled && OAuth === 'true';

  return (
    <div className="row">
      <div className="columns small-12" id="sign-in-wrapper">
        {reduceAllowedProviders(allowedSignInProviders).map(csp => (
          <LoginButton csp={csp} key={csp} useOAuth={useSignInService} />
        ))}
        <div id="create-account">
          <h2 className="vads-u-margin-top--3">Or create an account</h2>
          <div className="vads-u-display--flex vads-u-flex-direction--column">
            {reduceAllowedProviders(allowedSignUpProviders).map(policy => (
              <CreateAccountLink
                key={policy}
                policy={policy}
                useOAuth={useSignInService}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

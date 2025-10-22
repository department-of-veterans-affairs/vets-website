import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import LoginActions from 'platform/user/authentication/components/LoginActions';
import { EXTERNAL_APPS } from 'platform/user/authentication/constants';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { externalApplicationsConfig } from 'platform/user/authentication/usip-config';
import { getQueryParams } from 'platform/user/authentication/utilities';
import LoginButton from 'platform/user/authentication/components/LoginButton';

const ArpLoginActionsNoIdme = ({ isUnifiedSignIn }) => {
  const [useOAuth, setOAuth] = useState(false);
  const { OAuth, clientId, codeChallenge, state } = getQueryParams();

  const { OAuthEnabled } =
    externalApplicationsConfig[EXTERNAL_APPS.ARP] ??
    externalApplicationsConfig.default;

  const actionLocation = isUnifiedSignIn ? 'usip' : 'modal';

  useEffect(
    () => {
      setOAuth(OAuthEnabled && OAuth === 'true');
    },
    [OAuth, OAuthEnabled],
  );

  return (
    <div className="row">
      <div className="columns print-full-width sign-in-wrapper">
        <LoginButton
          csp="logingov"
          useOAuth={useOAuth}
          actionLocation={actionLocation}
          queryParams={{ clientId, codeChallenge, state }}
        />
      </div>
    </div>
  );
};

ArpLoginActionsNoIdme.propTypes = {
  isUnifiedSignIn: PropTypes.bool,
};

const ArpLoginActions = () => {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const idmeEnabled = useToggleValue(
    TOGGLE_NAMES.accreditedRepresentativePortalIdMe,
  );

  if (idmeEnabled) {
    return (
      <LoginActions externalApplication={EXTERNAL_APPS.ARP} isUnifiedSignIn />
    );
  }

  return <ArpLoginActionsNoIdme isUnifiedSignIn />;
};

export default ArpLoginActions;

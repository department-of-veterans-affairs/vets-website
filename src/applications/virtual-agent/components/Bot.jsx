import React, { useState } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleValues } from '@department-of-veterans-affairs/platform-site-wide/selectors';
import SignInModal from '@department-of-veterans-affairs/platform-user/SignInModal';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';

// Components
import App from './App';
import ChatboxDisclaimer from './ChatboxDisclaimer';

// Hooks
import useLoginModal from '../hooks/useLoginModal';

// Utils
import {
  getInAuthExp,
  getLoggedInFlow,
  setInAuthExp,
  setLoggedInFlow,
} from '../utils/sessionStorage';

// Event Listeners
import webAuthActivityEventListener from '../event-listeners/webAuthActivityEventListener';

// Selectors
import selectUserCurrentlyLoggedIn from '../selectors/selectUserCurrentlyLoggedIn';
import selectVirtualAgentDataTermsAccepted from '../selectors/selectVirtualAgentDataTermsAccepted';

const MINUTE = 60 * 1000;

function Bot({
  virtualAgentEnableParamErrorDetection,
  virtualAgentUseStsAuthentication,
}) {
  const isLoggedIn = useSelector(selectUserCurrentlyLoggedIn);
  const isAccepted = useSelector(selectVirtualAgentDataTermsAccepted);
  const [isAuthTopic, setIsAuthTopic] = useState(false);
  const loggedInFlow = getLoggedInFlow();

  webAuthActivityEventListener(isLoggedIn, setIsAuthTopic);

  useLoginModal(isLoggedIn, isAuthTopic, virtualAgentUseStsAuthentication);

  if (loggedInFlow === 'true' && isLoggedIn) {
    setInAuthExp('true');
    setLoggedInFlow('false');
  }

  const inAuthExp = getInAuthExp();
  if (!isAccepted && !inAuthExp) {
    return <ChatboxDisclaimer />;
  }

  if (!isLoggedIn && isAuthTopic && !virtualAgentUseStsAuthentication) {
    return (
      <SignInModal
        data-testid="sign-in-modal"
        visible
        onClose={() => {
          setIsAuthTopic(false);
          setLoggedInFlow('false');
        }}
      />
    );
  }

  return (
    <App
      timeout={MINUTE}
      virtualAgentEnableParamErrorDetection={
        virtualAgentEnableParamErrorDetection
      }
    />
  );
}

Bot.propTypes = {
  virtualAgentEnableParamErrorDetection: PropTypes.bool,
  virtualAgentUseStsAuthentication: PropTypes.bool,
};

const mapStateToProps = state => ({
  virtualAgentEnableParamErrorDetection: toggleValues(state)[
    FEATURE_FLAG_NAMES.virtualAgentEnableParamErrorDetection
  ],
  virtualAgentUseStsAuthentication: toggleValues(state)[
    FEATURE_FLAG_NAMES.virtualAgentUseStsAuthentication
  ],
});

export default connect(mapStateToProps)(Bot);

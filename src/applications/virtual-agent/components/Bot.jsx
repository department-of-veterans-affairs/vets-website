import React, { useState } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleValues } from '@department-of-veterans-affairs/platform-site-wide/selectors';
import SignInModal from '@department-of-veterans-affairs/platform-user/SignInModal';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';

// Components
import App from './App';
import ChatboxDisclaimer from './ChatboxDisclaimer';

// Utils
import {
  getInAuthExp,
  getLoggedInFlow,
  setInAuthExp,
  setLoggedInFlow,
} from '../utils/sessionStorage';

// Event Listeners
import webAuthActivityEventListener from '../event-listeners/webAuthActivityEventListener';

const MINUTE = 60 * 1000;

function Bot({
  virtualAgentEnableParamErrorDetection,
  virtualAgentEnableMsftPvaTesting,
  virtualAgentEnableNluPvaTesting,
}) {
  const isLoggedIn = useSelector(state => state.user.login.currentlyLoggedIn);
  const isAccepted = useSelector(state => state.virtualAgentData.termsAccepted);
  const [isAuthTopic, setIsAuthTopic] = useState(false);
  const inAuthExp = getInAuthExp();
  const loggedInFlow = getLoggedInFlow();

  webAuthActivityEventListener(isLoggedIn, setIsAuthTopic);

  if (loggedInFlow === 'true' && isLoggedIn) {
    setInAuthExp('true');
    setLoggedInFlow('false');
  }

  if (!isAccepted && !inAuthExp) {
    return <ChatboxDisclaimer />;
  }

  if (!isLoggedIn && isAuthTopic) {
    return (
      <SignInModal
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
      virtualAgentEnableMsftPvaTesting={virtualAgentEnableMsftPvaTesting}
      virtualAgentEnableNluPvaTesting={virtualAgentEnableNluPvaTesting}
    />
  );
}

Bot.propTypes = {
  virtualAgentEnableMsftPvaTesting: PropTypes.bool,
  virtualAgentEnableNluPvaTesting: PropTypes.bool,
  virtualAgentEnableParamErrorDetection: PropTypes.bool,
};

const mapStateToProps = state => ({
  virtualAgentEnableParamErrorDetection: toggleValues(state)[
    FEATURE_FLAG_NAMES.virtualAgentEnableParamErrorDetection
  ],
  virtualAgentEnableMsftPvaTesting: toggleValues(state)[
    FEATURE_FLAG_NAMES.virtualAgentEnableMsftPvaTesting
  ],
  virtualAgentEnableNluPvaTesting: toggleValues(state)[
    FEATURE_FLAG_NAMES.virtualAgentEnableNluPvaTesting
  ],
});

export default connect(mapStateToProps)(Bot);

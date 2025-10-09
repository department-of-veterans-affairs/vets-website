import React, { useEffect } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleValues } from '@department-of-veterans-affairs/platform-site-wide/selectors';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';

// Components
import App from './App';
import ChatboxDisclaimer from './ChatboxDisclaimer';

// Hooks
import useLoginModal from '../hooks/useLoginModal';

// Utils
import { getLoggedInFlow, setLoggedInFlow } from '../utils/sessionStorage';
import { replayStoredUtterances } from '../utils/actions';
import { ACCEPTED } from '../reducers';

// Selectors
import selectUserCurrentlyLoggedIn from '../selectors/selectUserCurrentlyLoggedIn';
import selectVirtualAgentDataTermsAccepted from '../selectors/selectVirtualAgentDataTermsAccepted';

const MINUTE = 60 * 1000;

function Bot({ virtualAgentEnableParamErrorDetection }) {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectUserCurrentlyLoggedIn);
  const isAccepted = useSelector(selectVirtualAgentDataTermsAccepted);
  const loggedInFlow = getLoggedInFlow();

  useLoginModal();

  // Auto-accept the disclaimer on return from a chatbot-initiated login
  useEffect(
    () => {
      if (isLoggedIn && loggedInFlow === 'true' && !isAccepted) {
        dispatch({ type: ACCEPTED });
        replayStoredUtterances(dispatch);
        // reset the flag so it does not auto-accept on future visits
        setLoggedInFlow('false');
      }
    },
    [isLoggedIn, loggedInFlow, isAccepted, dispatch],
  );

  if (!isAccepted) {
    return <ChatboxDisclaimer />;
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
};

const mapStateToProps = state => ({
  virtualAgentEnableParamErrorDetection: toggleValues(state)[
    FEATURE_FLAG_NAMES.virtualAgentEnableParamErrorDetection
  ],
});

export default connect(mapStateToProps)(Bot);

import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import SignInModal from '@department-of-veterans-affairs/platform-user/SignInModal';
import {
  TOGGLE_NAMES,
  useToggleValue,
} from 'platform/utilities/feature-toggles';

// Components
import RightColumnContent from '../../chatbot/features/shell/components/RightColumnContent';
import App from './App';

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
import ChatboxContainer from '../../chatbot/components/chatbox/ChatboxContainer';
import selectUserCurrentlyLoggedIn from '../selectors/selectUserCurrentlyLoggedIn';
import selectVirtualAgentDataTermsAccepted from '../selectors/selectVirtualAgentDataTermsAccepted';

const MINUTE = 60 * 1000;

function Bot() {
  const isLoggedIn = useSelector(selectUserCurrentlyLoggedIn);
  const isAccepted = useSelector(selectVirtualAgentDataTermsAccepted);
  const [isAuthTopic, setIsAuthTopic] = useState(false);
  const loggedInFlow = getLoggedInFlow();

  const virtualAgentEnableParamErrorDetection = useToggleValue(
    TOGGLE_NAMES.virtualAgentEnableParamErrorDetection,
  );

  const virtualAgentUseStsAuthentication = useToggleValue(
    TOGGLE_NAMES.virtualAgentUseStsAuthentication,
  );

  React.useEffect(
    () => {
      return webAuthActivityEventListener(isLoggedIn, setIsAuthTopic);
    },
    [isLoggedIn, setIsAuthTopic],
  );

  useLoginModal(isLoggedIn, isAuthTopic, virtualAgentUseStsAuthentication);

  if (loggedInFlow === 'true' && isLoggedIn) {
    setInAuthExp('true');
    setLoggedInFlow('false');
  }

  const inAuthExp = getInAuthExp();
  if (!isAccepted && !inAuthExp) {
    return <RightColumnContent />;
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
    <ChatboxContainer>
      <App
        timeout={MINUTE}
        virtualAgentEnableParamErrorDetection={
          virtualAgentEnableParamErrorDetection
        }
      />
    </ChatboxContainer>
  );
}

export default Bot;

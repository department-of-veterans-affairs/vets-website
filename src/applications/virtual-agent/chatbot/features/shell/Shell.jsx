import React from 'react';
import { useDispatch } from 'react-redux';

import { chatbotActions } from '../../store';
import LeftColumnContent from './components/LeftColumnContent';
import RightColumnContent from './components/RightColumnContent';
import useSkipLinkFix from './hooks/useSkipLinkFix';

/**
 * Chatbot shell component that houses the disclaimer and chatbot UI.
 * Used on the ChatbotEntry page to house all the static page content for /contact-us/virtual-agent, and then provide a container for feature-based chatbot modules.
 * @component
 * @returns jsx.Element
 */
export const Shell = () => {
  useSkipLinkFix();

  const dispatch = useDispatch();

  return (
    <div
      className="vads-l-grid-container desktop-lg:vads-u-padding-x--0"
      data-testid="chatbot-shell"
    >
      <div className="vads-l-row vads-u-margin-x--neg2p5 vads-u-margin-y--4">
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--5 small-desktop-screen:vads-l-col--7">
          <LeftColumnContent />
        </div>
        <div
          className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--7 small-desktop-screen:vads-l-col--5"
          data-testid="sticky-chatbot"
        >
          <RightColumnContent
            onAccept={() => dispatch(chatbotActions.acceptDisclaimer())}
          />
        </div>
      </div>
    </div>
  );
};

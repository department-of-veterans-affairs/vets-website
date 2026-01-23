import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  chatbotActions,
  selectChatbotHasAcceptedDisclaimer,
} from '../../store';
import LeftColumnContent from './components/LeftColumnContent';
import ChatboxDisclaimer from './components/RightColumnContent';
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
  const hasAcceptedDisclaimer = useSelector(selectChatbotHasAcceptedDisclaimer);

  return (
    <div className="vads-l-grid-container desktop-lg:vads-u-padding-x--0">
      <div className="vads-l-row vads-u-margin-x--neg2p5 vads-u-margin-y--4">
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--5 small-desktop-screen:vads-l-col--7">
          <LeftColumnContent />
        </div>
        <div
          className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--7 small-desktop-screen:vads-l-col--5"
          data-testid="sticky-chatbot"
        >
          <div className="vads-u-padding--1p5 vads-u-background-color--gray-lightest">
            <div className="vads-u-background-color--primary-darker vads-u-padding--1p5">
              <h2
                className="vads-u-font-size--lg vads-u-color--white vads-u-margin--0"
                id="chatbot-header"
                tabIndex="-1"
              >
                VA chatbot (beta)
              </h2>
            </div>
            <div className="vads-u-padding--1p5">
              {!hasAcceptedDisclaimer ? (
                <ChatboxDisclaimer
                  onAccept={() => dispatch(chatbotActions.acceptDisclaimer())}
                />
              ) : (
                <>
                  <p className="vads-u-margin-top--0">
                    New chatbot shell is ready for feature-based modules.
                  </p>
                  <p className="vads-u-margin-bottom--0 vads-u-font-style--italic">
                    Start wiring the conversation experience here.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

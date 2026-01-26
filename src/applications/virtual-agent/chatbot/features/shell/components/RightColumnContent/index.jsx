import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ACCEPTED } from '../../../../../webchat/reducers';
import { clearBotSessionStorage } from '../../../../../webchat/utils/sessionStorage';
import { selectChatbotHasAcceptedDisclaimer } from '../../../../store';
import AiDisclaimer from './AiDisclaimer';

/**
 * Handle click on the accept disclaimer button
 * @param {Function} dispatch Redux dispatch function
 * @param {Function} [onAccept] Optional callback function to call on accept, used to dispatch new chatbotActions.acceptDisclaimer action from Shell component
 * @returns void
 */
function onClick(dispatch, onAccept) {
  if (onAccept) {
    onAccept();
    return;
  }

  // everything below is the legacy behavior
  recordEvent({
    action: 'click',
    'button-type': 'default',
    event: 'cta-button-click',
    'button-click-label': 'Start Chat',
    'button-background-color': 'blue',
    time: new Date(),
  });
  clearBotSessionStorage(true);

  dispatch({ type: ACCEPTED });
}

/**
 * @typedef {Object} RightContentProps
 * @property {function(): void} onAccept - Click handler for accepting the disclaimer
 */

/**
 * Right column content component that houses the disclaimer and chatbot UI.
 * Used on the Shell component to house all the static page content for the right column, including the disclaimer and chatbot container.
 * @component
 * @param {RightContentProps} props Component props
 * @returns jsx.Element
 *
 */
export default function RightColumnContent({ onAccept }) {
  const dispatch = useDispatch();
  const hasAcceptedDisclaimer = useSelector(selectChatbotHasAcceptedDisclaimer);
  return (
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
          <va-alert status="info">
            <h3 slot="headline">About this chatbot</h3>

            <div data-testid="disclaimer" style={{ width: '100%' }}>
              <ul>
                <li>
                  Our chatbot can’t help you if you’re experiencing a personal,
                  medical, or mental health emergency. Go to the nearest
                  emergency room, dial 988 and press 1 for mental health
                  support, or call 911 to get medical care right away.
                  <br />
                  <a href="/health-care/health-needs-conditions/mental-health/">
                    Learn more about VA mental health services
                  </a>
                </li>
                <li>
                  Please don’t type any personal information such as your name,
                  address, or anything else that can be used to identify you.
                </li>
                <AiDisclaimer />
              </ul>
              <va-button
                id="btnAcceptDisclaimer"
                data-testid="btnAcceptDisclaimer"
                text="Start chat"
                onClick={() => onClick(dispatch, onAccept)}
              />
            </div>
          </va-alert>
        ) : (
          <>
            <p className="vads-u-margin-top--0">
              New chatbot shell is ready 🐚🐚🐚.
            </p>
            <p className="vads-u-margin-bottom--0 vads-u-font-style--italic">
              Start wiring up the new experience here.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

RightColumnContent.propTypes = {
  onAccept: PropTypes.func,
};

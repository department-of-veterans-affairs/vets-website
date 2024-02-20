import React, { useEffect, useMemo } from 'react';
import PropType from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import CrisisLineConnectButton from '../components/CrisisLineConnectButton';

const InterstitialPage = props => {
  const { acknowledge, type } = props;

  const handleKeyPress = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      // prevent from scrolling to the footer
      e.preventDefault();
      acknowledge();
    }
  };

  useEffect(() => {
    focusElement(document.querySelector('h1'));
  }, []);

  const continueButtonText = useMemo(
    () => {
      switch (type) {
        case 'reply':
          return 'Continue to reply';
        case 'draft':
          return 'Continue to draft';
        default:
          return 'Continue to start message';
      }
    },
    [type],
  );

  return (
    <div className="interstitial-page">
      <h1>
        Only use messages for <span className="no-word-wrap">non-urgent</span>{' '}
        needs
      </h1>
      <div>
        <p>
          Your care team may take up to <strong>3 business days</strong> to
          reply.
        </p>
        {
          // linter advises to use button instead. However, per designs, action link is required
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a
            data-testid="continue-button"
            className="vads-c-action-link--green vads-u-margin-bottom--2 small-screen:vads-u-margin-bottom--1 vads-u-font-size--lg link"
            tabIndex={0}
            role="button"
            onKeyPress={handleKeyPress}
            onClick={props.acknowledge}
          >
            {continueButtonText}
          </a>
        }
        <h2 className="vads-u-font-size--h3">
          If you need help sooner, use one of these urgent communication
          options:
        </h2>
        <ul>
          <li>
            <p>
              <strong>
                If you’re in crisis or having thoughts of suicide,{' '}
              </strong>{' '}
              connect with our Veterans Crisis Line. We offer confidential
              support anytime, day or night.
            </p>

            <CrisisLineConnectButton />
          </li>
          <li>
            <p>
              <strong>If you think your life or health is in danger, </strong>{' '}
              call <va-telephone contact="911" /> or go to the nearest emergency
              room.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

InterstitialPage.propTypes = {
  acknowledge: PropType.func,
  type: PropType.string,
};

export default InterstitialPage;

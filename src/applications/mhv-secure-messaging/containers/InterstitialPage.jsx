import React, { useCallback, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropType from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import CrisisLineConnectButton from '../components/CrisisLineConnectButton';
import { Paths } from '../util/constants';
import { isPilotState } from '../selectors';

const InterstitialPage = props => {
  const { acknowledge, type } = props;
  const history = useHistory();
  const isPilot = useSelector(isPilotState);

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

  const handleContinueButton = useCallback(
    () => {
      if (isPilot && type !== 'reply') {
        history.push(`${Paths.COMPOSE}${Paths.SELECT_HEALTH_CARE_SYSTEM}`);
      } else {
        acknowledge();
      }
    },
    [history, acknowledge, isPilot],
  );

  return (
    <div className="interstitial-page">
      <h1 className="vads-u-margin-bottom--2">
        Only use messages for <span className="no-word-wrap">non-urgent</span>{' '}
        needs
      </h1>
      <div>
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--3">
          Your care team may take up to <strong>3 business days</strong> to
          reply.
        </p>

        <button
          className="continue-button vads-u-padding-y--1p5 vads-u-padding-x--2p5 vads-u-margin-top--0 vads-u-margin-bottom--3"
          data-testid="continue-button"
          onClick={handleContinueButton}
          data-dd-action-name={`${continueButtonText} button on Interstitial Page`}
        >
          {continueButtonText}
          <span className="sr-only">. Page content will change.</span>
        </button>

        <h2 className="vads-u-font-size--h3 vads-u-margin-top--0 vads-u-margin-bottom--2">
          If you need help sooner, use one of these urgent communications
          options:
        </h2>
        <ul className="vads-u-margin--0">
          <li className="vads-u-margin--0">
            <p className="vads-u-margin-top--0 vads-u-margin-bottom--1p5">
              <strong>
                If you’re in crisis or having thoughts of suicide,{' '}
              </strong>{' '}
              connect with our Veterans Crisis Line. We offer confidential
              support anytime, day or night.
            </p>

            <CrisisLineConnectButton />
          </li>
          <li className="vads-u-margin--0">
            <p className="vads-u-margin-top--1p5 vads-u-margin-bottom--0">
              <strong>If you think your life or health is in danger, </strong>
              {` call `}
              <va-telephone
                contact="911"
                data-dd-action-name="911 link on Interstital Page"
              />
              {` or go to the nearest emergency room.`}
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

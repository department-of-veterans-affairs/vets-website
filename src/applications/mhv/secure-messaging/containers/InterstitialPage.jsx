import React from 'react';
import { Link } from 'react-router-dom';
import { openCrisisModal } from '../util/helpers';

const InterstitialPage = () => {
  return (
    <div className="interstitial-page">
      <h1>
        Only use messages for <span className="no-word-wrap">non-urgent</span>{' '}
        needs
      </h1>
      <p>
        Your care team may take up to <strong>3 business days</strong> to reply.
      </p>
      <p>
        If you need help sooner, use one of these urgent communication options:
      </p>
      <ul>
        <li>
          <p>
            <strong>If you’re in crisis or having thoughts of suicide, </strong>{' '}
            connect with our Veterans Crisis Line. We offer confidential support
            anytime day or night.
          </p>

          <va-button
            secondary="true"
            text="Connect with the Veterans Crisis Line"
            onClick={openCrisisModal}
          />
        </li>
        <li>
          <p>
            <strong>If you think your life or health is in danger, </strong>{' '}
            call <va-telephone contact="911" /> or go to the nearest emergency
            room.
          </p>
        </li>
      </ul>
      <Link
        className="vads-c-action-link--green vads-u-margin-top--1 link"
        text="Continue to start message"
        to="/compose"
      >
        Continue to start message
      </Link>
    </div>
  );
};

export default InterstitialPage;

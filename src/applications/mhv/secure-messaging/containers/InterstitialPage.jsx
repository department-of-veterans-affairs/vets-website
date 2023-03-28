import React from 'react';
import PropType from 'prop-types';
import { openCrisisModal } from '../util/helpers';

const InterstitialPage = props => {
  const handleKeyPress = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      // prevent from scrolling to the footer
      e.preventDefault();
      props.acknowledge();
    }
  };

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
            anytime, day or night.
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
      {
        // linter advises to use button instead. However, per designs, action link is required
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a
          className="vads-c-action-link--green vads-u-margin-top--1 link"
          tabIndex={0}
          role="button"
          onKeyPress={handleKeyPress}
          onClick={props.acknowledge}
        >
          Continue to start message
        </a>
      }
    </div>
  );
};

InterstitialPage.propTypes = {
  acknowledge: PropType.func,
};

export default InterstitialPage;

import React from 'react';
import { useSelector } from 'react-redux';
import { mhvUrl } from '@department-of-veterans-affairs/platform-site-wide/utilities';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import FeedbackEmail from '../shared/FeedbackEmail';

const WelcomeMessage = () => {
  const fullState = useSelector(state => state);

  const mhvSecureMessagingToPhase1 = useSelector(
    state =>
      state.featureToggles[FEATURE_FLAG_NAMES.mhvSecureMessagingToPhase1],
  );

  return (
    <div className="welcome-message">
      <h2>What to know as you try out this tool</h2>

      {mhvSecureMessagingToPhase1 ? (
        <>
          <p>
            You’re using the new version of My HealtheVet secure messaging on
            VA.gov. And we need your feedback to help us keep making this tool
            better for you and all Veterans.
          </p>
          <p>
            Send us your feedback and questions using the Feedback button on
            this page.
          </p>
        </>
      ) : (
        <>
          <p>
            We’re giving the trusted My HealtheVet secure messaging tool a new
            home on VA.gov. And we need your feedback to help us keep making
            this tool better for you and all Veterans.
          </p>
          <p>
            Email your feedback and questions to us at <FeedbackEmail />.
          </p>
        </>
      )}
      <p>
        <strong>Note:</strong> You still have access to the previous version of
        secure messaging. You can go back to that version at any time.{' '}
        <a
          href={mhvUrl(isAuthenticatedWithSSOe(fullState), 'secure-messaging')}
          target="_blank"
          rel="noreferrer"
        >
          Go back to the previous version of secure messaging (opens in new tab)
        </a>
      </p>
    </div>
  );
};

export default WelcomeMessage;

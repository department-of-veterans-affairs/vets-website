import React from 'react';
import { useSelector } from 'react-redux';
import { mhvUrl } from '@department-of-veterans-affairs/platform-site-wide/utilities';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';

const WelcomeMessage = () => {
  const fullState = useSelector(state => state);

  return (
    <div className="welcome-message">
      <h2>What to know as you try out this tool</h2>

      <p>
        You’re using the new version of My HealtheVet secure messaging on
        VA.gov. And we need your feedback to help us keep making this tool
        better for you and all Veterans.
      </p>
      <p>
        Send us your feedback and questions using the Feedback button on this
        page.
      </p>

      <p>
        <strong>Note:</strong> You still have access to the previous version of
        secure messaging. You can go back to that version at any time.{' '}
        <a
          href={mhvUrl(isAuthenticatedWithSSOe(fullState), 'secure-messaging')}
        >
          Go back to the previous version of secure messaging
        </a>
      </p>
    </div>
  );
};

export default WelcomeMessage;

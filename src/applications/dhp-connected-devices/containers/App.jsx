import React from 'react';
import { useSelector } from 'react-redux';
import { UnauthenticatedPageContent } from '../components/UnauthenticatedPageContent';
import { AuthenticatedPageContent } from '../components/AuthenticatedPageContent';
import { FrequentlyAskedQuestions } from '../components/FrequentlyAskedQuestions';

export default function App() {
  const isLoggedIn = useSelector(state => state.user.login.currentlyLoggedIn);
  return (
    <div className="usa-grid-full margin landing-page">
      <div className="usa-width-three-fourths">
        <article className="usa-content">
          <div className="schemaform-title">
            <h1>Connect your health devices to share data</h1>
          </div>
          <div className="va-introtext">
            <p>
              Connecting a device will share your device health data with VA.
              This data is automatically shared with your care team.
            </p>
          </div>
          <p>
            <strong>Note:</strong> Your shared data will not be monitored by
            your VA care team. If you have concerns about any specific shared
            data, you must contact your care team directly.
          </p>
          {/* Show sign in button if user not logged in */}
          {!isLoggedIn && <UnauthenticatedPageContent />}
          {/* show your devices and Connect device section if user is logged in */}
          {isLoggedIn && <AuthenticatedPageContent />}
          <FrequentlyAskedQuestions />
        </article>
      </div>
    </div>
  );
}

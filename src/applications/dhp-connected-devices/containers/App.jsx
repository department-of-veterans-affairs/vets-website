import React from 'react';
import MetaTags from 'react-meta-tags';
import { useSelector } from 'react-redux';
import UnauthenticatedPageContent from '../components/UnauthenticatedPageContent';
import { AuthenticatedPageContent } from '../components/AuthenticatedPageContent';
import { FrequentlyAskedQuestions } from '../components/FrequentlyAskedQuestions';

export default function App() {
  const isLoading = useSelector(state => state?.user?.profile?.loading);
  const isLoggedIn = useSelector(state => state?.user.login.currentlyLoggedIn);
  const pageContent = isLoggedIn ? (
    <AuthenticatedPageContent />
  ) : (
    <UnauthenticatedPageContent />
  );
  const content = isLoading ? <va-loading-indicator set-focus /> : pageContent;

  return (
    <div className="usa-grid-full margin landing-page">
      <MetaTags>
        <meta name="robots" content="noindex" />
        <meta
          name="google-site-verification"
          content="scLJgpqcnJ33AfSYWbB9cdebuyOuHWWWoW_zdeyYNc4"
        />
      </MetaTags>
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
          {content}
          <FrequentlyAskedQuestions />
        </article>
      </div>
    </div>
  );
}

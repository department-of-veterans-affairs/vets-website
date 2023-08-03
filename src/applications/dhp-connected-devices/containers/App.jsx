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

  const disclaimerText = () => {
    return (
      <p>
        <strong>
          This page is meant for Digital Health Pathway pilot participants only.
        </strong>{' '}
        If you have not received an invitation to join a DHP pilot program but
        are interested in sharing your device data with your VA care team,
        please visit the{' '}
        <a
          href="https://mobile.va.gov/app/share-my-health-data"
          target="_blank"
          rel="noreferrer"
        >
          VA Share My Health Data app
        </a>
        .
      </p>
    );
  };

  return (
    <div className="usa-grid-full margin landing-page">
      <MetaTags>
        <meta name="robots" content="noindex" />
      </MetaTags>
      <div className="usa-width-three-fourths">
        <article className="usa-content">
          <div className="schemaform-title">
            <h1>Connect your health devices to share data</h1>
          </div>
          <div className="va-introtext">
            <p>
              Connecting a device will share your health data with VA. This data
              will become available to your care team.
            </p>
          </div>
          {disclaimerText()}
          {content}
          <FrequentlyAskedQuestions />
        </article>
      </div>
    </div>
  );
}

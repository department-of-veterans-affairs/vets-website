import React from 'react';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import Navigation from '../components/Navigation';

const LandingPageUnauth = () => {
  return (
    <div>
      <Breadcrumbs />
      <div className="vads-l-grid-container secure-messaging-container">
        <div className="secure-messaging-navigation">
          <Navigation />
        </div>
        <div className="main-content">
          <h1>Messages</h1>
          <p className="va-introtext vads-u-margin-top--1">
            Send and receive messages with your care team and get replies within
            3 business days.
          </p>
          <va-alert
            close-btn-aria-label="Close notification"
            status="continue"
            visible
          >
            <h2 id="track-your-status-on-mobile" slot="headline">
              Sign in to access your messages
            </h2>
            <div>
              <p className="vads-u-margin-top--0">
                Sign in with your
                <strong> Login.gov</strong>, <strong>ID.me</strong>, or{' '}
                <strong>My HealtheVet</strong> account. If you don’t have any of
                these accounts, you can create a free account now.
              </p>
              <button className="va-button-primary">
                Sign in or create an account
              </button>
            </div>
          </va-alert>
          <h2>To send messages, you must be a VA patient</h2>
          <p>
            And your VA provider must agree to communicate with you through
            secure messaging.
          </p>
          <p>
            VA health care covers primary care and specialist appointments, as
            well as services like home health and geriatric (elder) care. And VA
            offers family and caregiver health benefits.
          </p>
          <p className="vads-u-margin-top--3px">
            <a
              className="vads-c-action-link--blue compose-message-link"
              href="/my-health/secure-messages"
            >
              Compose a new message
            </a>
          </p>
          <p>
            <a href="/my-health/secure-messages">
              Learn about VA health benefits
            </a>
          </p>
          <h2>
            Use the messages tool to send and receive messages with your care
            team
          </h2>
          <h2>You can use the Messages tool if</h2>
          <h2>Questions?</h2>
        </div>
      </div>
    </div>
  );
};

export default LandingPageUnauth;

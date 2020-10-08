// Node modules.
import React from 'react';
// Relative imports.
import ThirdPartyApps from '../../containers/ThirdPartyApps';

export const AppDirectory = () => (
  <div>
    <h1>Find apps to use</h1>

    <p className="va-introtext">
      Below, you&apos;ll find a list of third-party websites and applications
      you can link to your personal VA data, like health or service records.
      Third-party services are created by developers that aren&apos;t VA. It is
      never required to use them.
    </p>

    {/* Search Results */}
    <ThirdPartyApps />

    {/* Questions Content */}
    <div className="feature">
      <h3>Have questions about connected apps?</h3>
      <p>
        Get answers to frequently asked questions about how connected
        third-party apps work, what types of information they can see, and the
        benefits of sharing your information.
      </p>
      <a href="" rel="noopener noreferrer">
        Go to connected apps FAQs
      </a>
    </div>
  </div>
);

export default AppDirectory;

// Node modules.
import React from 'react';
// Relative imports.
import ThirdPartyAppList from '../../containers/ThirdPartyAppList';

export const AppDirectory = () => (
  <div>
    <h1>Find apps to use</h1>

    <p className="va-introtext">
      Below, you&apos;ll find a list of third-party websites and applications
      you can link to your personal VA data, like health or service records.
      Third-party services are created by developers that aren&apos;t VA. It is
      never required to use them.
    </p>

    {/* App list */}
    <ThirdPartyAppList />
  </div>
);

export default AppDirectory;

import React, { useEffect } from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import PropTypes from 'prop-types';

import apps from './apps';

export const AvailableApps = ({ activeApps }) => {
  console.log('This is apps', apps);
  console.log('This is active apps', activeApps);

  const availableAppsNames = apps.map(app => app.name);
  const connectedAppsNames = activeApps.map(app => app.attributes.title);

  // Any entries of connectedApps names need to removed from availableAppsNames

  const filteredApps = apps.filter(
    app => !connectedAppsNames.includes(app.name),
  );

  console.log('This is filtered Apps', filteredApps);

  return (
    <>
      <div className="vads-u-margin-y--2">
        <AdditionalInfo
          triggerText={`What other third-party apps can I connect to my profile?`}
        >
          <p>
            <strong>At this time, you can connect any of these apps:</strong>
          </p>
          <ul>
            {filteredApps.map(app => (
              <li key={app.name}>
                <a href={app.appUrl} target="_blank" rel="noopener noreferrer">
                  {app.name}
                </a>
              </li>
            ))}
          </ul>
        </AdditionalInfo>
      </div>
    </>
  );
};

AvailableApps.propTypes = {
  activeApps: PropTypes.array.isRequired,
};

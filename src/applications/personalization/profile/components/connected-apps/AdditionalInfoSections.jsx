import React from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';

import availableConnectedApps from './availableConnectedApps';

export const AdditionalInfoSections = ({ activeApps }) => {
  const connectedAppsNames = activeApps
    ? activeApps.map(app => app.attributes.title)
    : [];

  // This filters out any availableConnectedApps that the user has already connected to
  const filteredApps = availableConnectedApps.filter(
    app => !connectedAppsNames.includes(app.name),
  );

  // We only show 'apps to connect to' if the user already has connected to apps, and if
  // there are apps available they have not yet connected to
  const showConnectToAvailableApps =
    !isEmpty(activeApps) && !isEmpty(filteredApps);

  return (
    <>
      {showConnectToAvailableApps && (
        <div className="vads-u-margin-y--3 available-connected-apps">
          <AdditionalInfo
            triggerText={`What other third-party apps can I connect to my profile?`}
          >
            <p>
              <strong>At this time, you can connect any of these apps:</strong>
            </p>
            <ul className="vads-u-margin-bottom--3 vads-u-margin-left--3">
              {filteredApps?.map(app => {
                return (
                  <li key={app.name}>
                    <a
                      href={app.appURL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {app.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </AdditionalInfo>
        </div>
      )}
    </>
  );
};

AdditionalInfoSections.propTypes = {
  activeApps: PropTypes.array.isRequired,
};

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

      <div className="vads-u-margin-bottom--3">
        <AdditionalInfo
          triggerText={`How do I connect a third-party app to my profile?`}
        >
          <p>
            <strong>Take these steps to connect the app:</strong>
          </p>
          <ol>
            <li className="vads-u-padding-left--1">
              When the app (or website) prompts you to connect your VA account,
              it will ask you to sign in.
            </li>
            <li className="vads-u-padding-left--1">
              Sign in with your preferred VA.gov account:{' '}
              <strong>DS Logon</strong>, <strong>My HealtheVet</strong>, or{' '}
              <strong>ID.me</strong>.
            </li>
            <li className="vads-u-padding-left--1">
              Review the information the app is asking to access.
            </li>
          </ol>
          <p>
            If you’re comfortable sharing that information, allow access. If you
            have trouble connecting the app, contact the app’s support for help.
          </p>
        </AdditionalInfo>
      </div>
    </>
  );
};

AdditionalInfoSections.propTypes = {
  activeApps: PropTypes.array.isRequired,
};

import React from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/formation-react/Telephone';

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

  const hasConnectedApps = !isEmpty(activeApps);

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

      {hasConnectedApps && (
        <div className="vads-u-margin-bottom--3">
          <AdditionalInfo
            triggerText={`What should I do if my records are wrong or out of date in a connected app?`}
          >
            <p>
              <strong>This depends on the issue:</strong>
            </p>
            <ul className="vads-u-margin-left--3">
              <li className="vads-u-padding-left--1">
                <strong>If your health records are missing:</strong> It can take
                up to 3 days for new health records to show in a connected app.
                If it’s been more than 3 days since your last appointment, or if
                you need your information sooner,{' '}
                <a
                  href="https://www.myhealth.va.gov/mhv-portal-web/user-login?redirect=/mhv-portal-web/home"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  sign in to My HealtheVet
                </a>{' '}
                or contact your VA health care team.
              </li>
              <li className="vads-u-padding-left--1">
                <strong>If your information isn’t accurate:</strong> Call VA311
                at <Telephone contact={CONTACTS.VA_311} />. If you have hearing
                loss, call{' '}
                <Telephone
                  contact={CONTACTS['711']}
                  pattern={PATTERNS['911']}
                />
                . Or visit a VA health facility near you and ask a staff member
                for help.{' '}
                <p>
                  <a href="/find-locations">
                    Find a VA health facility near you
                  </a>
                </p>
              </li>
              <li className="vads-u-padding-left--1">
                <strong>If you’re getting an “unreadable data” message:</strong>{' '}
                This means the connected app has access to your information, but
                isn’t using it in its interface. It’s nothing to worry about. If
                you have questions about this, send feedback directly to the
                app.
              </li>
            </ul>
          </AdditionalInfo>
        </div>
      )}

      {hasConnectedApps && (
        <div className="vads-u-margin-bottom--4">
          <AdditionalInfo
            triggerText={`What should I do if I no longer trust a connected app?`}
          >
            <p>
              <strong>Take these 3 steps to protect your information:</strong>
            </p>
            <ol>
              <li className="vads-u-padding-left--1">
                Disconnect from the app.
              </li>
              <li className="vads-u-padding-left--1">
                Contact the app’s support and ask them to permanently delete any
                stored information they may still have from you.
              </li>
              <li className="vads-u-padding-left--1">
                <a href="mailto:api@va.gov">Report the app to us</a>
              </li>
            </ol>
          </AdditionalInfo>
        </div>
      )}
    </>
  );
};

AdditionalInfoSections.propTypes = {
  activeApps: PropTypes.array.isRequired,
};

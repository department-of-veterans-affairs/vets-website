import React, { useEffect } from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export const AdditionalInfoSections = ({ activeApps }) => {
  return (
    <>
      {activeApps && (
        <div className="vads-u-margin-y--2">
          <AdditionalInfo
            triggerText={`What other third-party apps can I connect to my profile?`}
          >
            <p>
              <strong>At this time, you can connect any of these apps:</strong>
            </p>
            <ul>
              <li>Test</li>
            </ul>
          </AdditionalInfo>
        </div>
      )}

      <div className="vads-u-margin-bottom--2">
        <AdditionalInfo
          triggerText={`How do I connect a third-party app to my profile?`}
        >
          <p>
            <strong>Take these steps to connect the app:</strong>
          </p>
          <ol>
            <li>
              When the app (or website) prompts you to connect your VA account,
              it will ask you to sign in.
            </li>
            <li>
              Sign in with your preferred VA.gov account: DS Logon, My
              HealtheVet, or ID.me.
            </li>
            <li>Review the information the app is asking to access.</li>
          </ol>
          <p>
            If you’re comfortable sharing that information, allow access. If you
            have trouble connecting the app, contact the app’s support for help.
          </p>
        </AdditionalInfo>
      </div>

      {activeApps && (
        <div className="vads-u-margin-bottom--2">
          <AdditionalInfo
            triggerText={`What should I do if my records are wrong or out of date in a connected app?`}
          >
            <p>
              <strong>This depends on the issue:</strong>
            </p>
            <ul>
              <li>
                If your health records are missing: It can take up to 3 days for
                new health records to show in a connected app. If it’s been more
                than 3 days since your last appointment, or if you need your
                information sooner,{' '}
                <a
                  href="https://www.myhealth.va.gov/mhv-portal-web/user-login?redirect=/mhv-portal-web/home"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  sign in to My HealtheVet
                </a>{' '}
                or contact your VA health care team.
              </li>
              <li>
                If your information isn’t accurate: Call VA311 at 844-698-2311.
                If you have hearing loss, call TTY: 711. Or visit a VA health
                facility near you and ask a staff member for help.{' '}
                <a href="/find-locations">Find a VA health facility near you</a>
              </li>
              <li>
                If you’re getting an “unreadable data” message: This means the
                connected app has access to your information, but isn’t using it
                in its interface. It’s nothing to worry about. If you have
                questions about this, send feedback directly to the app.
              </li>
            </ul>
          </AdditionalInfo>
        </div>
      )}

      {activeApps && (
        <AdditionalInfo
          triggerText={`What should I do if I no longer trust a connected app?`}
        >
          <p>
            <strong>Take these 3 steps to protect your information:</strong>
          </p>
          <ol>
            <li>Disconnect from the app.</li>
            <li>
              Contact the app’s support and ask them to permanently delete any
              stored information they may still have from you.
            </li>
            <li>
              <a href="mailto:api@va.gov">Report the app to us</a>
            </li>
          </ol>
        </AdditionalInfo>
      )}
    </>
  );
};

AdditionalInfoSections.propTypes = {
  activeApps: PropTypes.array.isRequired,
};

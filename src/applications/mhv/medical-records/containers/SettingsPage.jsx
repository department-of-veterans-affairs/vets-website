import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const fullState = useSelector(state => state);
  const [optedIn, setOptedIn] = useState(true);

  useEffect(
    () => {
      dispatch(
        setBreadcrumbs([{ url: '/my-health', label: 'Dashboard' }], {
          url: '/my-health/medical-records/share-your-medical-record',
          label: 'Share your medical record',
        }),
      );
    },
    [dispatch],
  );

  return (
    <div className="vads-u-margin-bottom--5">
      <section>
        <h1>Share your medical record</h1>
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--0 va-introtext">
          Review and update your medical records sharing and notification
          settings.
        </p>
      </section>
      <section className="set-width-486">
        <h2>Manage your sharing settings</h2>
        <p>
          The Veterans Health Information Exchange program is a secure online
          system that gives participating community care providers instant
          access to your VA medical records.
        </p>
        <p>
          We share your records with your providers only when they’re treating
          you. Ask your community care providers if they participate in this
          program.
        </p>
        <h3>What we share through this program:</h3>
        <ul>
          <li>
            All allergies, vaccines, medications, and health conditions in your
            VA medical records
          </li>
          <li>
            Recent lab and test results, vitals, and care summaries and notes
            from VA providers
          </li>
          <li>List of your past and future appointments with VA providers</li>
          <li>
            Other information your providers may need, such as your emergency
            contacts
          </li>
        </ul>
        <div className="card vads-u-padding--3 vads-u-background-color--gray-lightest">
          <h3 className="vads-u-margin-top--0">
            Your sharing setting: {optedIn ? 'Opted in' : 'Opted out'}
          </h3>
          {optedIn ? (
            <p>
              We automatically include you in this online sharing program. You
              can opt out (ask us not to share your records) at any time.
            </p>
          ) : (
            <p>
              We’re not currently sharing your records online with your
              community care providers. If you want us to start sharing your
              records, you can opt back in.
            </p>
          )}
          <va-button
            text={optedIn ? 'Opt out' : 'Opt back in'}
            onClick={() => {
              // setShareStatus(formSelection);
              setOptedIn(!optedIn);
            }}
          />
        </div>
      </section>
      <section className="set-width-486">
        <h2>Manage notification settings</h2>
        <p>
          You can sign up to get email notifications when you have new lab and
          test results or images available. You can also opt out of email
          notifications at any time.
        </p>
        <p>
          To review or update your notification settings, go to your profile
          page on the My HealtheVet website.
        </p>
        <p>
          <a
            href={mhvUrl(
              isAuthenticatedWithSSOe(fullState),
              'download-my-data',
            )}
            target="_blank"
            rel="noreferrer"
          >
            Go to your profile on the My Healthevet website
          </a>
        </p>
      </section>
    </div>
  );
};

export default SettingsPage;

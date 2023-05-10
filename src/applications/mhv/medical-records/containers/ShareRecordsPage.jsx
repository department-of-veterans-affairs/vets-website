import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';

const ShareRecordsPage = () => {
  const dispatch = useDispatch();
  const fullState = useSelector(state => state);
  const [editShareStatus, setEditShareStatus] = useState(false);
  const [shareStatus, setShareStatus] = useState('Sharing through VHIE');
  const [formSelection, setFormSelection] = useState(null);

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
        <p className="vads-u-font-size--h3">
          Find out how to share your VA medical records with non-VA providers.
        </p>
      </section>
      <section>
        <h2>With providers in our community care network</h2>
        <p>
          If your provider is in our network, we can share your records through
          the Veterans Health Information Exchange (VHIE) program.
        </p>
        <p>
          VHIE is a secure online system that gives participating providers
          instant access to your VA medical records. Ask your provider if they
          can access VHIE.
        </p>
        <va-additional-info trigger="What we share through VHIE">
          <ul>
            <li>
              All allergies, vaccines, medications, and health conditions in
              your VA medical records
            </li>
            <li>
              Your most recent lab and test results, vitals, and care summaries
              and notes from VA providers (from the past 1.5 to 2 years)
            </li>
            <li>List of your past and future appointments with VA providers</li>
            <li>
              Other key information for providers, including your emergency
              contacts
            </li>
          </ul>
        </va-additional-info>
        <a href="https://www.va.gov/resources/the-veterans-health-information-exchange-vhie/">
          Learn more about VHIE
        </a>
        <p>
          <strong>Note: </strong>
          Most records are available in VHIE <strong>3 days</strong> after
          providers enter them in our system.
        </p>
        <h3>Check or change your sharing status</h3>
        <p>
          We automatically include you in VHIE. You can change your sharing
          status at any time.
        </p>
        <p>
          <strong>Your status: </strong>
          {shareStatus}
        </p>
        {editShareStatus === false ? (
          <va-button
            onClick={() => setEditShareStatus(true)}
            text="Change your status"
          />
        ) : (
          <form>
            <va-radio onClick={event => setFormSelection(event.target.value)}>
              <va-radio-option
                label="Share my record"
                name="share"
                value="Sharing through VHIE"
              />
              <va-radio-option
                label="Don't share my record"
                name="sharen't"
                value="Not sharing through VHIE"
              />
              <div className="vads-l-row vads-u-margin-top--1">
                <va-button
                  text="Save"
                  onClick={() => {
                    setShareStatus(formSelection);
                    setEditShareStatus(false);
                  }}
                />
                <va-button
                  secondary
                  text="Cancel"
                  onClick={() => setEditShareStatus(false)}
                />
              </div>
            </va-radio>
          </form>
        )}
      </section>
      <section>
        <h2>With providers outside our network</h2>
        <p>
          If your provider can’t access VHIE, you can download and share your VA
          Blue Button report. Or you can get a copy of your complete VA medical
          record from your VA health facility.
        </p>
        <h3>Download your Blue Button report</h3>
        <p>
          Download your Blue Button report here. Then share it with your
          provider by mail, fax, or in person at your appointment.
        </p>
        <va-additional-info trigger="What your Blue Button report includes">
          <ul>
            <li>
              Key information from your VA medical records —including your
              allergies, vaccines, medications, and lab and test results
            </li>
            <li>
              Care summaries and notes from VA providers (only from 2013 or
              later)
            </li>
            <li>List of past and future appointments with VA providers</li>
          </ul>
          <p>
            This Blue Button report won’t include information you entered
            yourself. To find information you entered, go back to the previous
            version of Blue Button on the My HealtheVet website.
          </p>
          <a
            href={mhvUrl(
              isAuthenticatedWithSSOe(fullState),
              'download-my-data',
            )}
            target="_blank"
            rel="noreferrer"
          >
            Go back to the previous version of Blue Button
          </a>
        </va-additional-info>
        <p className="vads-u-margin-bottom--0">
          <strong>Note: </strong>
          Most records are available in Blue Button
          <strong>36 hours</strong> after providers enter them in our system.
        </p>
        <button className="link-button" type="button">
          <i className="fas fa-download vads-u-margin-right--0p5" />
          Download PDF document
        </button>
        <br />
        <button className="link-button" type="button">
          <i className="fas fa-download vads-u-margin-right--0p5" />
          Download Text file
        </button>
        <va-additional-info
          trigger="What to know about downloading records"
          className="no-print"
        >
          <ul>
            <li>
              <strong>If you’re on a public or shared computer,</strong> print
              your records instead of downloading. Downloading will save a copy
              of your records to the public computer.
            </li>
            <li>
              <strong>If you use assistive technology,</strong> a Text file
              (.txt) may work better for technology such as screen reader,
              screen enlargers, or Braille displays.
            </li>
          </ul>
        </va-additional-info>
        <h3 className="vads-u-margin-top--2">
          Get your complete VA medical record
        </h3>
        <p>
          If you can’t find what you need in Blue Button, you can request a copy
          of your complete record from your health facility’s medical records
          office. It may take up to <strong>30 days</strong> to get your records
          this way.{' '}
        </p>
        <a href="https://www.va.gov/resources/how-to-get-your-medical-records-from-your-va-health-facility/">
          Learn how to get records from your VA health facility
        </a>
      </section>
    </div>
  );
};

export default ShareRecordsPage;

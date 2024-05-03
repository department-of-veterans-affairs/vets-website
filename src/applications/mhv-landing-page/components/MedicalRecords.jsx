import React from 'react';
import classnames from 'classnames';

const BLUE_BUTTON_URL =
  'https://mhv-syst.myhealth.va.gov/mhv-portal-web/download-my-data';

const recordTypes = [
  'Lab and test results',
  'Care summaries and notes',
  'Vaccines',
  'Allergies and reactions',
  'Health conditions',
  'Vitals',
];

const toKebabCase = (phrase = '') => phrase.toLowerCase().replace(/\s+/g, '-');

const MedicalRecords = () => (
  <div
    className={classnames(
      'vads-l-grid-container',
      'large-screen:vads-u-padding-x--0',
      'vads-u-margin-bottom--5',
    )}
    data-testid="mhvMedicalRecords"
  >
    <a className="vads-u-display--block vads-u-margin-y--3" href="/my-health">
      &lt; Back to My HealtheVet home
    </a>

    <span className="usa-label vads-u-background-color--primary">
      Coming soon
    </span>

    <h1 className="vads-u-margin-top--0p5 vads-u-margin-bottom--1">
      Medical records
    </h1>

    <p
      className={classnames(
        'vads-u-font-size--lg',
        'vads-u-margin-top--1',
        'vads-u-margin-bottom--4',
        'vads-u-measure--2',
      )}
    >
      Soon, you’ll be able to find, print, and download your medical records on
      VA.gov
    </p>

    <div className="vads-u-background-color--gray-lightest vads-u-padding-x--4 vads-u-padding-y--3">
      <h2 className="vads-u-margin-top--0">
        Medical records on VA.gov isn’t ready to use yet
      </h2>
      <p className="vads-u-measure--5">
        You still have access to your medical records on the previous version of
        My HealtheVet. You can go back to that site at any time to download your
        VA health records (Blue Button) or view your lab and test results.
      </p>
      <a
        className="vads-c-action-link--green vads-u-margin-y--2"
        href={BLUE_BUTTON_URL}
      >
        Download health records (Blue Button®)
      </a>
    </div>

    <h2>What’s coming soon</h2>

    <p className="vads-u-font-size--md vads-u-measure--4">
      We’re working on bringing all your medical records together under one roof
      here on VA.gov. When it’s ready, you’ll be able to quickly find, print, or
      download each type of record according to your needs.
    </p>

    <p className="vads-u-font-size--md">
      Types of records coming soon include:
    </p>

    <ul className="vads-u-font-size--md">
      {recordTypes.map((type, i) => (
        <li key={`${i}-${toKebabCase(type)}`}>{type}</li>
      ))}
    </ul>
  </div>
);

export default MedicalRecords;

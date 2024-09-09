import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { datadogRum } from '@datadog/browser-rum';

import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const breadcrumbList = [
  {
    href: '/',
    label: 'VA.gov home',
  },
  {
    href: '/my-health',
    label: 'My HealtheVet',
  },
  {
    href: '/my-health/records',
    label: 'Medical records',
  },
];

export const recordTypes = [
  'Lab and test results',
  'Care summaries and notes',
  'Vaccines',
  'Allergies and reactions',
  'Health conditions',
  'Vitals',
];

const toKebabCase = (phrase = '') => phrase.toLowerCase().replace(/\s+/g, '-');

const MedicalRecords = ({ blueButtonUrl, pageHeading }) => (
  <div
    className={classnames(
      'vads-l-grid-container',
      'large-screen:vads-u-padding-x--0',
      'vads-u-margin-bottom--5',
    )}
    data-testid="mhvMedicalRecords"
  >
    <VaBreadcrumbs breadcrumbList={breadcrumbList} />

    <div className="vads-u-display--flex vads-u-flex-wrap--wrap">
      <h1 className="vads-u-margin-bottom--0">{pageHeading}</h1>

      <div
        className={classnames(
          'vads-u-display--none',
          'medium-screen:vads-u-display--block',
          'medium-screen:vads-u-margin--2',
        )}
      >
        <span className="usa-label vads-u-background-color--primary">
          Coming soon
        </span>
      </div>
    </div>

    <div
      className={classnames(
        'vads-u-display--block',
        'vads-u-margin-top--0p5',
        'vads-u-margin-x--0p5',
        'vads-u-margin-bottom--2',
        'medium-screen:vads-u-display--none',
      )}
    >
      <span className="usa-label vads-u-background-color--primary">
        Coming soon
      </span>
    </div>

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

    <div
      className={classnames(
        'vads-u-background-color--gray-lightest',
        'vads-u-display--inline-block',
        'vads-u-padding-x--2',
        'medium-screen:vads-u-padding-x--4',
        'medium-screen:vads-u-padding-y--3',
      )}
    >
      <h2 className="vads-u-margin-top--1 medium-screen:vads-u-margin-top--0">
        Medical records on VA.gov isn’t ready to use yet
      </h2>
      <p className="vads-u-measure--5 medium-screen:vads-u-margin-bottom--3">
        You still have access to your medical records on the previous version of
        My HealtheVet. You can go back to that site at any time to download your
        VA health records (Blue Button®).
      </p>
      <p>
        <a
          className="vads-c-action-link--green"
          onClick={() =>
            datadogRum.addAction(
              'Click on Medical Records: Coming Soon - Go back to the previous version of My HealtheVet',
            )
          }
          href={blueButtonUrl}
        >
          Go back to the previous version of My HealtheVet
        </a>
      </p>
    </div>

    <h2>What’s coming soon</h2>

    <p className="vads-u-font-size--md vads-u-measure--4">
      We’re working on bringing all your VA medical records together in a single
      tool here on VA.gov. When it’s ready, you’ll be able to quickly find,
      print, or download these types of records:
    </p>

    <ul className="vads-u-font-size--md">
      {recordTypes.map((type, i) => (
        <li key={`${i}-${toKebabCase(type)}`}>{type}</li>
      ))}
    </ul>
  </div>
);

MedicalRecords.propTypes = {
  blueButtonUrl: PropTypes.string.isRequired,
  pageHeading: PropTypes.string.isRequired,
};

export default MedicalRecords;

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import { updatePageTitle } from '../../shared/util/helpers';
import { pageTitles } from '../util/constants';

const DownloadRecordsPage = () => {
  const dispatch = useDispatch();

  useEffect(
    () => {
      dispatch(
        setBreadcrumbs(
          [{ url: '/my-health/medical-records', label: 'Medical records' }],
          {
            url: '/my-health/medical-records/download-all',
            label: 'Download all medical records',
          },
        ),
      );
      focusElement(document.querySelector('h1'));
      updatePageTitle(pageTitles.DOWNLOAD_PAGE_TITLE);
    },
    [dispatch],
  );

  return (
    <div className="vads-u-margin-bottom--5">
      <section>
        <h1>Download all medical records</h1>
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--0 va-introtext">
          Download all your medical records as a single file using VA Blue
          Button&#174;.
        </p>
      </section>
      <section>
        <h2>What you can download here</h2>
        <p>
          Your downloaded file will include these types of records from your VA
          providers:
        </p>
        <ul>
          <li>Lab and test results</li>
          <li>Care summaries and notes (only from 2013 or later)</li>
          <li>
            Records of your vaccines, allergies, health conditions, and vitals
          </li>
        </ul>
        <p className="vads-u-margin-bottom--0">
          <span className="vads-u-font-weight--bold">
            What to know before you download{' '}
          </span>
        </p>
        <ul>
          <li>
            If you use assistive technology, a text file may work better for
            you.
          </li>
          <li>
            If you’re on a public or shared computer, remember that downloading
            will save a copy of your records to that computer.
          </li>
        </ul>

        <button className="link-button" type="button">
          <i
            className="fas fa-download vads-u-margin-right--0p5"
            aria-hidden="true"
          />
          Download PDF document
        </button>
        <br />
        <button className="link-button" type="button">
          <i
            className="fas fa-download vads-u-margin-right--0p5"
            aria-hidden="true"
          />
          Download Text file
        </button>
        <h3 className="vads-u-margin-top--2">
          What to do if you can’t find all your records
        </h3>
        <p>
          If you’re looking for recent records, check back later. It may take{' '}
          <span className="vads-u-font-weight--bold">36 hours</span> for some
          records to become available for download.
        </p>
        <a href="https://www.va.gov/resources/how-to-get-your-medical-records-from-your-va-health-facility/">
          Learn how to find other types of records
        </a>
      </section>
    </div>
  );
};

export default DownloadRecordsPage;

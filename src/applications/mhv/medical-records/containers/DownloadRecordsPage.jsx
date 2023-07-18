import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setBreadcrumbs } from '../actions/breadcrumbs';

const DownloadRecordsPage = () => {
  const dispatch = useDispatch();

  useEffect(
    () => {
      dispatch(
        setBreadcrumbs([{ url: '/my-health', label: 'Dashboard' }], {
          url: '/my-health/medical-records/download-your-medical-records',
          label: 'Download all medical records',
        }),
      );
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
      <section className="set-width-486">
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
          <strong>What to know before you download </strong>
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
          <strong>36 hours</strong> for some records to become available for
          download.
        </p>
        <a
          href="https://www.va.gov/resources/how-to-get-your-medical-records-from-your-va-health-facility/"
          target="_blank"
          rel="noreferrer"
        >
          Learn how to find other types of records
        </a>
      </section>
    </div>
  );
};

export default DownloadRecordsPage;

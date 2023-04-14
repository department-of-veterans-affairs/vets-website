import React from 'react';
import PropTypes from 'prop-types';
import { dateFormat, downloadFile } from '../../util/helpers';
import PrintHeader from '../shared/PrintHeader';
import { getVaccinePdf } from '../../api/MrApi';

const EkgDetails = props => {
  const { results } = props;

  const formattedDate = dateFormat(results?.date, 'MMMM D, YYYY');

  const download = () => {
    getVaccinePdf(1).then(res =>
      downloadFile('electrocardiogram.pdf', res.pdf),
    );
  };

  const content = () => {
    if (results) {
      return (
        <>
          <PrintHeader />
          <h1 className="condition-header">{results.name}</h1>
          <div className="time-header">
            <h2 className="vads-u-font-size--base vads-u-font-family--sans">
              Date:{' '}
            </h2>
            <p>{formattedDate}</p>
          </div>
          <div className="condition-buttons">
            <div className="vads-u-display--flex vads-u-padding-y--3 vads-u-margin-y--0 no-print">
              <button
                className="link-button vads-u-margin-right--3 no-print"
                type="button"
                onClick={window.print}
              >
                <i
                  aria-hidden="true"
                  className="fas fa-print vads-u-margin-right--1"
                  data-testid="print-records-button"
                />
                Print page
              </button>
              <button
                className="link-button no-print"
                type="button"
                onClick={download}
              >
                <i
                  aria-hidden="true"
                  className="fas fa-download vads-u-margin-right--1"
                />
                Download page
              </button>
            </div>
            <va-additional-info trigger="What to know about downloading records">
              <ul>
                <li>
                  <strong>If you’re on a public or shared computer,</strong>{' '}
                  print your records instead of downloading. Downloading will
                  save a copy of your records to the public computer.
                </li>
                <li>
                  <strong>If you use assistive technology,</strong> a Text file
                  (.txt) may work better for technology such as screen reader,
                  screen enlargers, or Braille displays.
                </li>
              </ul>
            </va-additional-info>
          </div>
          <div className="condition-details max-80">
            <h2 className="vads-u-font-size--base vads-u-font-family--sans">
              Ordering location
            </h2>
            <p>
              {results.facility || 'There is no facility reported at this time'}
            </p>
            <h2 className="vads-u-font-size--base vads-u-font-family--sans">
              Results
            </h2>
            <p>
              Your EKG results aren’t available in this tool. To get your EKG
              results, you can request a copy of your complete medical record
              from your VA health facility.
            </p>
            <p className="vads-u-margin-top--2">
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.va.gov/resources/how-to-get-your-medical-records-from-your-va-health-facility/"
              >
                Learn how to get records from your VA health facility
              </a>
            </p>
          </div>
        </>
      );
    }
    return <></>;
  };

  return (
    <div
      className="vads-l-grid-container vads-u-padding-x--0 vads-u-margin-bottom--5"
      id="condition-details"
    >
      {content()}
    </div>
  );
};

export default EkgDetails;

EkgDetails.propTypes = {
  results: PropTypes.object,
};

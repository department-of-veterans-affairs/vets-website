import React from 'react';
import PropTypes from 'prop-types';
import { dateFormat, downloadFile } from '../../util/helpers';
import PrintHeader from '../shared/PrintHeader';
import { getVaccinePdf } from '../../api/MrApi';

const RadiologyDetails = props => {
  const { results } = props;

  const formattedDate = dateFormat(results?.date, 'MMMM D, YYYY');

  const download = () => {
    getVaccinePdf(1).then(res => downloadFile('radiology.pdf', res.pdf));
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

          <div>
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

          <div className="test-details-container max-80">
            <h2>Details about this test</h2>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Images
            </h3>
            <p>
              <va-link
                active
                href="https://i0.wp.com/www.aliem.com/wp-content/uploads/2020/02/Normal-ankle-radiology-AP-2.jpg?fit=853%2C1999&ssl=1"
                text="See all 44 images"
              />
            </p>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Reason for test
            </h3>
            <p>{results.reason}</p>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Clinical history
            </h3>
            <p>{results.clinicalHistory}</p>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Ordered by
            </h3>
            <p>{results.orderedBy}</p>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Ordering location
            </h3>
            <p>{results.orderingLocation}</p>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Imaging location
            </h3>
            <p>{results.imagingLocation}</p>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Imaging provider
            </h3>
            <p>{results.imagingProvider}</p>
          </div>

          <div className="test-results-container">
            <h2>Results</h2>
            <va-additional-info trigger="Need help understanding your results?">
              <p>This is how to understand your results.</p>
            </va-additional-info>
            <p>{results.labResults}</p>
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

export default RadiologyDetails;

RadiologyDetails.propTypes = {
  results: PropTypes.object,
};

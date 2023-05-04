import React from 'react';
import PropTypes from 'prop-types';
import { dateFormat, downloadFile } from '../../util/helpers';
import PrintHeader from '../shared/PrintHeader';
import { getVaccinePdf } from '../../api/MrApi';

const AdmissionAndDischargeDetails = props => {
  const { results } = props;

  const admissionDate = dateFormat(results?.startDate, 'MMMM D, YYYY');
  const dischargeDate = dateFormat(results?.endDate, 'MMMM D, YYYY');

  const download = () => {
    getVaccinePdf(1).then(res => downloadFile('pathology.pdf', res.pdf));
  };

  const content = () => {
    if (results) {
      return (
        <>
          <PrintHeader />
          <h1 className="vads-u-margin-bottom--0">{results.name}</h1>
          <div className="time-header">
            <h2 className="vads-u-font-size--base vads-u-font-family--sans">
              Dates:{' '}
            </h2>
            <p>
              {admissionDate} to {dischargeDate}
            </p>
          </div>

          <p className="vads-u-margin-bottom--0">
            Review a summary of your stay at a hospital or other health facility
            (called an admission and discharge summary).
          </p>

          <div className="no-print">
            <div className="vads-u-display--flex vads-u-padding-y--3 vads-u-margin-y--0">
              <button
                className="link-button vads-u-margin-right--3"
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
              <button className="link-button" type="button" onClick={download}>
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
            <h2>Details</h2>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Location
            </h3>
            <p>{results.facility}</p>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Admission date
            </h3>
            <p>{admissionDate}</p>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Discharge date
            </h3>
            <p>{dischargeDate}</p>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Admitted by
            </h3>
            <p>{results.admittingPhysician}</p>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Discharged by
            </h3>
            <p>{results.dischargePhysician}</p>
          </div>

          <div className="test-results-container">
            <h2>Summary</h2>
            <p>{results.summary}</p>
          </div>
        </>
      );
    }
    return <></>;
  };

  return (
    <div className="vads-l-grid-container vads-u-padding-x--0 vads-u-margin-bottom--5">
      {content()}
    </div>
  );
};

export default AdmissionAndDischargeDetails;

AdmissionAndDischargeDetails.propTypes = {
  results: PropTypes.object,
};

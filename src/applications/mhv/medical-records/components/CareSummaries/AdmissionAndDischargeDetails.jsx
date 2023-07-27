import React from 'react';
import PropTypes from 'prop-types';
import PrintHeader from '../shared/PrintHeader';
import PrintDownload from '../shared/PrintDownload';

const AdmissionAndDischargeDetails = props => {
  const { record } = props;

  const download = () => {};

  const content = () => {
    if (record) {
      return (
        <>
          <PrintHeader />
          <h1 className="vads-u-margin-bottom--0">{record.name}</h1>
          <div className="time-header">
            <h2 className="vads-u-font-size--base vads-u-font-family--sans">
              Dates:{' '}
            </h2>
            <p>
              {record.startDate} to {record.endDate}
            </p>
          </div>

          <section className="set-width-486">
            <p className="vads-u-margin-bottom--0">
              Review a summary of your stay at a hospital or other health
              facility (called an admission and discharge summary).
            </p>
            <div className="no-print">
              <PrintDownload download={download} />
              <va-additional-info trigger="What to know about downloading records">
                <ul>
                  <li>
                    <strong>If you’re on a public or shared computer,</strong>{' '}
                    print your records instead of downloading. Downloading will
                    save a copy of your records to the public computer.
                  </li>
                  <li>
                    <strong>If you use assistive technology,</strong> a Text
                    file (.txt) may work better for technology such as screen
                    reader, screen enlargers, or Braille displays.
                  </li>
                </ul>
              </va-additional-info>
            </div>
          </section>

          <div className="test-details-container max-80">
            <h2>Details</h2>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Location
            </h3>
            <p>{record.location}</p>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Admission date
            </h3>
            <p>{record.startDate}</p>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Discharge date
            </h3>
            <p>{record.endDate}</p>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Admitted by
            </h3>
            <p>{record.admittingPhysician || record.physician}</p>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Discharged by
            </h3>
            <p>{record.dischargePhysician || record.physician}</p>
          </div>

          <div className="test-results-container">
            <h2>Summary</h2>
            <p>{record.summary}</p>
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
  record: PropTypes.object,
};

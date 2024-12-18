import React from 'react';
import PropTypes from 'prop-types';

const MissingRecordsError = ({ documentType, recordTypes }) => {
  if (!Array.isArray(recordTypes) || recordTypes.length === 0) {
    return <></>;
  }
  return (
    <va-alert
      status="error"
      visible
      aria-live="polite"
      data-testid="missing-records-error-alert"
    >
      <h3 id="track-your-status-on-mobile" slot="headline">
        We can’t include certain records in your {documentType} right now
      </h3>
      <p>
        We’re sorry. There’s a problem with our system. The report you just
        downloaded doesn’t include these records:
      </p>
      <ul>
        {recordTypes.map(recordType => (
          <li key={recordType}>{recordType}</li>
        ))}
      </ul>
      <p>
        Try downloading these records again later. If it still doesn’t work,
        call us at <va-telephone contact="8773270022" /> (
        <va-telephone tty contact="711" />
        ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
      </p>
    </va-alert>
  );
};

export default MissingRecordsError;

MissingRecordsError.propTypes = {
  documentType: PropTypes.string,
  recordTypes: PropTypes.array,
};

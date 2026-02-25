import React from 'react';
import PropTypes from 'prop-types';

const DuplicateRecordsAlert = ({ visible }) => {
  if (!visible) return null;

  return (
    <va-alert
      id="duplicate-records-alert"
      status="info"
      class="no-print vads-u-margin-y--1p5"
      data-testid="duplicate-records-info-alert"
      data-dd-action-name="You may notice duplicate records for a time"
    >
      <h2 slot="headline">You may notice duplicate records for a time</h2>
      <p>
        We haven’t removed or changed any records. But recent updates may show
        duplicate records.
      </p>
    </va-alert>
  );
};

export default DuplicateRecordsAlert;

DuplicateRecordsAlert.propTypes = {
  visible: PropTypes.bool,
};

import React from 'react';
import PropTypes from 'prop-types';

const NoRecordsMessage = ({ type }) => {
  return (
    <va-card
      background
      class="record-list-item vads-u-margin-top--4 vads-u-margin-bottom--8"
      data-testid="record-list-item"
    >
      <h2
        className="vads-u-font-size--base vads-u-font-weight--normal vads-u-font-family--sans vads-u-margin-top--0 vads-u-margin-bottom--0"
        data-testid="no-records-message"
      >
        {`There are no ${type} in your VA medical records.`}
      </h2>
    </va-card>
  );
};

export default NoRecordsMessage;

NoRecordsMessage.propTypes = {
  type: PropTypes.string,
};

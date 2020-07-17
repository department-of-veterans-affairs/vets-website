import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

import CompleteDetails from './CompleteDetails';

function ClaimComplete({ completedDate }) {
  return (
    <>
      <div className="usa-alert usa-alert-info background-color-only claims-alert-status">
        <h3 className="claims-alert-header vads-u-font-size--h4">
          Your claim was closed{' '}
          {completedDate
            ? `on ${moment(completedDate).format('MMM D, YYYY')}`
            : null}
        </h3>
      </div>
      <CompleteDetails className="vads-u-margin--2" />
    </>
  );
}

ClaimComplete.propTypes = {
  completedDate: PropTypes.string,
};

export default ClaimComplete;

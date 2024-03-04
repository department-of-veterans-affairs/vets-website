import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

import Payments from './claim-status-tab/Payments';

function ClaimComplete({ completedDate }) {
  return (
    <>
      <div className="usa-alert usa-alert-info background-color-only claims-alert-status">
        <h3 className="claims-alert-header vads-u-font-size--h4">
          We decided your claim{' '}
          {completedDate
            ? `on ${moment(completedDate).format('MMMM D, YYYY')}`
            : null}
        </h3>
      </div>
      <div>
        <p>
          We mailed you a decision letter. It should arrive within 10 days after
          the date we decided your claim. It can sometimes take longer.
        </p>
        <Payments />
      </div>
    </>
  );
}

ClaimComplete.propTypes = {
  completedDate: PropTypes.string,
};

export default ClaimComplete;

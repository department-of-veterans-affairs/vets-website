import React from 'react';
import PropTypes from 'prop-types';

export default function CompleteDetails({ className }) {
  return (
    <div className={className}>
      <p>
        We mailed you a decision letter. It should arrive within 10 days after
        the date we decided your claim. It can sometimes take longer.
      </p>
      <h5 className="vads-u-font-size--h4">Payments</h5>
      <p>
        If you are entitled to back payment (based on an effective date), you
        can expect to receive payment within 1 month of your claim’s decision
        date.
      </p>
    </div>
  );
}

CompleteDetails.propTypes = {
  className: PropTypes.string,
};

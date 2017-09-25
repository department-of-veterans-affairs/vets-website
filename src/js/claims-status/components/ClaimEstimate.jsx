import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { Link } from 'react-router';

export default function ClaimEstimate({ maxDate, id }) {
  const estimatedDate = moment(maxDate);
  const today = moment().startOf('day');

  if (maxDate === undefined || !estimatedDate.isValid() || estimatedDate.isAfter(moment(today).add(2, 'years'))) {
    return (
      <div className="claim-completion-estimation">
        <p>Estimate not available</p>
      </div>
    );
  }

  return (
    <div className="claim-completion-estimation">
      <p className="date-estimation">Estimated date: {estimatedDate.format('MMM D, YYYY')}</p>
      {estimatedDate.isBefore(today)
        ? <p>We estimated your claim would be completed by now but we need more time.</p>
        : <p>We base this on claims similar to yours. It isn’t an exact date.</p>}
      <p><Link to={`your-claims/${id}/claim-estimate`}>Learn about this estimate</Link>.</p>
    </div>
  );
}

ClaimEstimate.propTypes = {
  maxDate: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
};

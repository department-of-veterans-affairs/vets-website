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
      <p className="date-estimation">Estimated {estimatedDate.format('MMM D, YYYY')}</p>
      {estimatedDate.isBefore(today)
        ? <p>We estimated your claim would be completed by now but we need more time.</p>
        : <p>This date is based on claims similar to yours and is not an exact date.</p>}
      <p><Link to={`your-claims/${id}/claim-estimate`}>Learn about this estimation</Link></p>
    </div>
  );
}

ClaimEstimate.propTypes = {
  maxDate: React.PropTypes.string.isRequired,
  id: React.PropTypes.string.isRequired
};

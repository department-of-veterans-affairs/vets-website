import React from 'react';
import moment from 'moment';

export default function ClaimEstimate({ maxDate }) {
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
        : null}
      <p><a href="/">Learn about this estimation</a></p>
    </div>
  );
}

ClaimEstimate.propTypes = {
  maxDate: React.PropTypes.string.isRequired
};

import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { Link } from 'react-router';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

export default function ClaimEstimate({
  maxDate,
  id,
  showCovidMessage = true,
}) {
  // Hide until estimates are accurate
  if (showCovidMessage) {
    return (
      <AlertBox
        status="warning"
        headline="Claim completion dates aren’t available right now"
      >
        <p>
          We can’t provide an estimated date on when your claim will be complete
          due to the affect that COVID-19 has had on scheduling in-person claim
          exams. We’re starting to schedule in-person exams again in many
          locations. To see the status of claim exams in your area, you can{' '}
          <a href="https://benefits.va.gov/compensation/claimexam.asp">
            review locations where we’re now offering in-person exams
          </a>
          .
        </p>
      </AlertBox>
    );
  }

  const estimatedDate = moment(maxDate);
  const today = moment().startOf('day');

  if (
    maxDate === undefined ||
    !estimatedDate.isValid() ||
    estimatedDate.isAfter(moment(today).add(2, 'years'))
  ) {
    return (
      <div className="claim-completion-desc">
        <p>Estimate not available</p>
      </div>
    );
  }

  return (
    <p>
      <span className="claim-completion-estimation">
        Estimated date: {estimatedDate.format('MMM D, YYYY')}
      </span>
      <br />
      {estimatedDate.isBefore(today) ? (
        <span className="claim-completion-desc">
          We estimated your claim would be completed by now but we need more
          time.
        </span>
      ) : (
        <span className="claim-completion-desc">
          We base this on claims similar to yours. It isn’t an exact date.
        </span>
      )}
      <br />
      <span>
        <Link
          className="claim-estimate-link"
          to={`your-claims/${id}/claim-estimate`}
        >
          Learn about this estimate
        </Link>
        .
      </span>
    </p>
  );
}

ClaimEstimate.propTypes = {
  maxDate: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

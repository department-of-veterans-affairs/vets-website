import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { Link } from 'react-router';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export default function ClaimEstimate({
  maxDate,
  id,
  showCovidMessage = true,
}) {
  // Hide until estimates are accurate
  if (showCovidMessage) {
    return (
      <AlertBox status="warning" headline="Completion estimate is unavailable">
        <p>
          The estimated claim completion date feature has been temporarily
          removed. Due to the impact COVID-19 has bad on the availability and
          scheduling of required in-person medical disability exams, the
          estimated completion date is not accurate at this time. VA is
          coordinating efforts to ensure all exams are scheduled and conducted
          as soon as it is safe in each area. You can{' '}
          <a href="https://benefits.va.gov/compensation/claimexam.asp">
            review the status of exams in your area
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

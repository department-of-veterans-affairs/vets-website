import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { Link } from 'react-router';

export default function ClaimEstimate({
  maxDate,
  id,
  showCovidMessage = true,
}) {
  // Hide until estimates are accurate
  if (showCovidMessage) {
    return (
      <va-alert status="warning">
        <h5 slot="headline">
          We don’t know yet when we’ll be able to make a decision on your claim
        </h5>
        <p className="vads-u-font-size--base">
          To decide your claim, we need to complete your in-person claim exam.
          But we don’t know yet when we’ll be able to schedule your exam. We
          stopped scheduling in-person claim exams because of COVID-19. Now
          we’re starting to schedule these exams again in many locations.{' '}
          <a href="https://benefits.va.gov/compensation/claimexam.asp">
            Find out where we offer in-person exams now
          </a>
          .
        </p>
      </va-alert>
    );
  }

  const estimatedDate = moment(maxDate || null);
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
  id: PropTypes.string.isRequired,
  maxDate: PropTypes.string.isRequired,
  showCovidMessage: PropTypes.bool,
};

import React from 'react';
import { Link, useNavigate } from 'react-router-dom-v5-compat';
import { formatInTimeZone } from 'date-fns-tz';
import Wrapper from '../layout/Wrapper';

// TODO: replace with actual data
const details = {
  phoneNumber: '8008270611',
  appointmentDateTime: new Date().toISOString(),
  topic: 'Education',
};

const formatDateTime = dateString => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Format date as "Weekday, Month DD, YYYY"
  const formattedDate = formatInTimeZone(
    dateString,
    timezone,
    'EEEE, MMMM dd, yyyy',
  );

  // Format time as "HH:MM p.m. TZ"
  const formattedTime = formatInTimeZone(dateString, timezone, 'hh:mm a zzz');

  return { formattedDate, formattedTime };
};

const Review = () => {
  const navigate = useNavigate();

  const handleConfirmCall = () => {
    navigate('/confirmation');
  };

  const { formattedDate, formattedTime } = formatDateTime(
    details.appointmentDateTime,
  );

  return (
    <Wrapper
      pageTitle="Review your VA Solid Start call details"
      testID="review-page"
      showBackButton
    >
      <hr
        aria-hidden="true"
        className="vads-u-margin-top--2 vads-u-margin-bottom--1"
      />
      <p
        className="vads-u-font-weight--bold vads-u-margin-y--0"
        data-testid="solid-start-call-title"
      >
        VA Solid Start call
      </p>
      <p
        className="vads-u-margin-top--0p5 vads-u-margin-bottom--1"
        data-testid="solid-start-call-description"
      >
        Your representative will call you on the day and time you select.
        They’ll call you from <va-telephone contact={details.phoneNumber} />.
      </p>
      <hr aria-hidden="true" className="vads-u-margin-y--1" />
      <div className="vads-u-display--flex vads-u-justify-content--space-between vads-u-align-items--center">
        <p
          className="vads-u-font-weight--bold vads-u-margin--0"
          data-testid="date-time-title"
        >
          Date and time
        </p>
        <Link
          to="/date-time"
          data-testid="date-time-edit-link"
          aria-label="Edit date and time"
        >
          Edit
        </Link>
      </div>
      <p
        className="vads-u-margin-top--0p5 vads-u-margin-bottom--1"
        data-testid="date-time-description"
      >
        {formattedDate}
        <br />
        {formattedTime}
      </p>
      <hr
        aria-hidden="true"
        className=" vads-u-margin-top--1 vads-u-margin-bottom--0p5"
      />
      <div className="vads-u-display--flex vads-u-justify-content--space-between vads-u-align-items--center">
        <p
          className="vads-u-font-weight--bold vads-u-margin--0"
          data-testid="topic-title"
        >
          Topic
        </p>
        <Link
          to="/topic-selection"
          data-testid="topic-edit-link"
          aria-label="Edit topic"
        >
          Edit
        </Link>
      </div>
      <p
        className="vads-u-margin-top--0p5 vads-u-margin-bottom--1"
        data-testid="topic-description"
      >
        {details.topic}
      </p>
      <hr
        aria-hidden="true"
        className="vads-u-margin-top--0 vads-u-margin-bottom--1"
      />
      <div className="vads-u-margin-top--2">
        <va-button
          onClick={handleConfirmCall}
          text="Confirm call"
          data-testid="confirm-call-button"
          uswds
        />
      </div>
    </Wrapper>
  );
};

export default Review;

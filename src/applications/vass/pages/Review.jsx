import React from 'react';
import { Link, useNavigate } from 'react-router-dom-v5-compat';
import { useSelector } from 'react-redux';
import Wrapper from '../layout/Wrapper';
import DateTime from '../components/DateTime';
import { usePostAppointmentMutation } from '../redux/api/vassApi';
import {
  selectSelectedTopics,
  selectSelectedDate,
} from '../redux/slices/formSlice';

// TODO: replace with actual data
const details = {
  phoneNumber: '8008270611',
};

const Review = () => {
  const navigate = useNavigate();
  const [postAppointment, { isLoading }] = usePostAppointmentMutation();
  const selectedTopics = useSelector(selectSelectedTopics);
  const selectedDate = useSelector(selectSelectedDate);
  const handleConfirmCall = async () => {
    const res = await postAppointment({
      topics: selectedTopics,
      dtStartUtc: selectedDate,
      dtEndUtc: selectedDate,
    });
    navigate(`/confirmation/${res.data.appointmentId}`);
  };

  return (
    <Wrapper
      pageTitle="Review your VA Solid Start call details"
      testID="review-page"
      showBackLink
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
      {selectedDate && <DateTime dateTime={selectedDate} />}
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
        {(selectedTopics || []).map(topic => topic?.topicName || '').join(', ')}
      </p>
      <hr
        aria-hidden="true"
        className="vads-u-margin-top--0 vads-u-margin-bottom--1"
      />
      <div className="vads-u-margin-top--2">
        <va-button
          onClick={handleConfirmCall}
          loading={isLoading}
          text="Confirm call"
          data-testid="confirm-call-button"
          uswds
        />
      </div>
    </Wrapper>
  );
};

export default Review;

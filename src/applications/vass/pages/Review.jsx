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
import { URLS } from '../utils/constants';
import { isServerError, isAppointmentFailedError } from '../utils/errors';

const Review = () => {
  const navigate = useNavigate();
  const [
    postAppointment,
    { isLoading, error: postAppointmentError },
  ] = usePostAppointmentMutation();
  const selectedTopics = useSelector(selectSelectedTopics);
  const selectedDate = useSelector(selectSelectedDate);
  const handleConfirmCall = async () => {
    const res = await postAppointment({
      topics: selectedTopics,
      dtStartUtc: selectedDate,
      dtEndUtc: selectedDate,
    });
    if (res.error) {
      return;
    }
    navigate(`${URLS.CONFIRMATION}/${res.data.appointmentId}`);
  };

  return (
    <Wrapper
      pageTitle="Review your VA Solid Start appointment details"
      testID="review-page"
      showBackLink
      errorAlert={
        isServerError(postAppointmentError) ||
        isAppointmentFailedError(postAppointmentError)
      }
    >
      <div className="vads-u-display--flex vads-u-justify-content--space-between vads-u-align-items--center">
        <p
          className="vads-u-font-weight--bold vads-u-margin--0"
          data-testid="date-time-title"
        >
          Date and time
        </p>
        <Link
          to={URLS.DATE_TIME}
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
          to={URLS.TOPIC_SELECTION}
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
      <div className="vads-u-display--flex vads-u-margin-top--4 vass-form__button-container vass-flex-direction--column">
        <va-button
          big
          onClick={handleConfirmCall}
          loading={isLoading}
          text="Confirm appointment"
          data-testid="confirm-call-button"
          uswds
        />
      </div>
    </Wrapper>
  );
};

export default Review;

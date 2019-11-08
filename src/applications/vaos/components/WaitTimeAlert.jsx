import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { Link } from 'react-router';
import { MENTAL_HEALTH } from '../utils/constants';
import newAppointmentFlow from '../newAppointmentFlow';

export const WaitTimeAlert = ({
  preferredDate,
  nextAvailableApptDate,
  typeOfCareId,
  eligibleForRequests,
  onClickRequest,
}) => {
  const today = moment();
  const momentPreferredDate = moment(preferredDate);
  const momentNextAvailableDate = moment(nextAvailableApptDate);

  if (momentPreferredDate.isValid() && momentNextAvailableDate.isValid()) {
    const actions = (
      <div className="vads-u-display--flex vads-u-margin-top--2 vads-u-align-items--center">
        {eligibleForRequests && (
          <>
            <Link to={newAppointmentFlow.requestDateTime.url}>
              <button className="usa-button-secondary" onClick={onClickRequest}>
                Request earlier appointment
              </button>
            </Link>
            <span className="vads-u-display--inline-block vads-u-margin-x--2 vads-u-font-weight--bold">
              OR
            </span>
          </>
        )}
        <span>Call your VA facility directly</span>
      </div>
    );

    // If preferred date is today, show urgent care warning
    if (today.isSame(momentPreferredDate, 'day')) {
      const content = (
        <>
          <p>
            The earliest appointment we can schedule for you is{' '}
            {momentNextAvailableDate.format('MMM D, YYYY')}. If this is an
            emergency, please use Urgent Care or the Veteran's Crisis Line.
          </p>
          <p>
            If this is not an emergency you may be able to ask for an earlier
            appointment, but you will not be able to directly schedule it. Or
            you can pick one of these available dates.
          </p>
          {actions}
        </>
      );
      return (
        <AlertBox
          headline="Do not use VAOS for emergency care"
          content={content}
          status="warning"
        />
      );
    }

    // If Preferred date >5 days away, and next avail appointment is >20 (mental health)
    // or 28 (other ToCs) days away from the preferred date, show request alert
    const nextAvailableDateWarningLimit =
      typeOfCareId === MENTAL_HEALTH ? 20 : 28;
    const durationBetweenNowAndNextAvailable = moment
      .duration(momentNextAvailableDate.diff(today))
      .asDays();

    if (
      nextAvailableApptDate &&
      momentPreferredDate.isAfter(moment().add(5, 'days'), 'day') &&
      durationBetweenNowAndNextAvailable > nextAvailableDateWarningLimit
    ) {
      const content = (
        <>
          <p>
            The earliest appointment we can schedule for you is{' '}
            {momentNextAvailableDate.format('MMM Do, YYYY')}.
          </p>
          <p>
            You can request an earlier appointment and we will do our best to
            get you seen sooner, but we cannot directly schedule an appointment
            sooner than those you see here.
          </p>
          {actions}
        </>
      );
      return (
        <AlertBox
          headline="You my be able to request an earlier appointment"
          content={content}
          status="info"
        />
      );
    }
  }

  return null;
};

WaitTimeAlert.propTypes = {
  preferredDate: PropTypes.string.isRequired,
  nextAvailableApptDate: PropTypes.string,
  typeOfCareId: PropTypes.string.isRequired,
  eligibleForRequests: PropTypes.bool,
  onClickRequest: PropTypes.func,
};

export default WaitTimeAlert;

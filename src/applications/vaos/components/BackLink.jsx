import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import { useDispatch } from 'react-redux';
import { GA_PREFIX } from '../utils/constants';
import { closeCancelAppointment } from '../appointment-list/redux/actions';

export default function BackLink({ appointment }) {
  const {
    isPastAppointment,
    isPendingAppointment,
    isUpcomingAppointment,
  } = appointment.vaos;

  const location = useLocation();
  const dispatch = useDispatch();

  const handleClickGATracker = () => {
    let status;
    if (isPendingAppointment) {
      status = 'pending';
    } else if (isUpcomingAppointment) {
      status = 'upcoming';
    } else if (isPastAppointment) {
      status = 'past';
    }

    const progress =
      location.search === '?confirmMsg=true' ? 'confirmation' : 'appointment';

    if (progress === 'confirmation' && status === 'upcoming') {
      status = 'direct';
    }
    return () => {
      recordEvent({
        event: `${GA_PREFIX}-${status}-${progress}-details-descriptive-back-link`,
      });

      dispatch(closeCancelAppointment());
    };
  };

  const handleBackLinkText = () => {
    // Default to upcoming page
    let linkText = 'Back to appointments';
    if (isPendingAppointment) {
      linkText = 'Back to request for appointments';
    } else if (isPastAppointment) {
      linkText = 'Back to past appointments';
    }
    return linkText;
  };
  const handleBackLink = () => {
    // Default to upcoming page
    let link = '/';
    if (isPendingAppointment) {
      link = '/pending';
    } else if (isPastAppointment) {
      link = '/past';
    }
    return link;
  };

  return (
    <div
      className="backLinkContainer vads-u-margin-top--2"
      aria-describedby="vaos-hide-for-print backLink"
    >
      <div
        aria-hidden
        className="vads-u-color--link-default vads-u-margin-right--1"
      >
        ‹
      </div>
      <NavLink
        aria-label={handleBackLinkText()}
        to={handleBackLink()}
        className="vaos-hide-for-print vads-u-color--link-default"
        onClick={handleClickGATracker()}
      >
        {handleBackLinkText()}
      </NavLink>
    </div>
  );
}

BackLink.propTypes = {
  appointment: PropTypes.object.isRequired,
};

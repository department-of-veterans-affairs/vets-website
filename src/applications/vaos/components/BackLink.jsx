import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { FETCH_STATUS, GA_PREFIX } from '../utils/constants';
import { getCancelInfo } from '../appointment-list/redux/selectors';
import { closeCancelAppointment } from '../appointment-list/redux/actions';

export default function BackLink({
  appointment,
  featureAppointmentDetailsRedesign = false,
}) {
  const {
    isPastAppointment,
    isPendingAppointment,
    isUpcomingAppointment,
  } = appointment.vaos;

  const location = useLocation();
  const history = useHistory();
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

      if (featureAppointmentDetailsRedesign) dispatch(closeCancelAppointment());
    };
  };

  const { cancelAppointmentStatus } = useSelector(getCancelInfo);
  const handleBackLinkText = () => {
    let linkText;
    if (isPendingAppointment) {
      linkText = 'Back to pending appointments';
      if (
        featureAppointmentDetailsRedesign &&
        cancelAppointmentStatus !== FETCH_STATUS.succeeded
      )
        linkText = 'Back to request for appointments';
    } else if (isUpcomingAppointment) {
      linkText = 'Back to appointments';
    } else if (isPastAppointment) {
      linkText = 'Back to past appointments';
    }
    return linkText;
  };
  const handleBackLink = () => {
    let link;
    if (isPendingAppointment) {
      link = '/pending';
      if (
        featureAppointmentDetailsRedesign &&
        cancelAppointmentStatus !== FETCH_STATUS.succeeded
      ) {
        // Don't change the url
        link = history.location.pathname;
      }
    } else if (isUpcomingAppointment) {
      link = '/';
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
  featureAppointmentDetailsRedesign: PropTypes.bool,
};

import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectFeatureBreadcrumbUrlUpdate } from '../redux/selectors';

export default function BackLink({ appointment }) {
  const {
    isPastAppointment,
    isPendingAppointment,
    isUpcomingAppointment,
  } = appointment.vaos;
  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );
  const handleBackLinkText = () => {
    let linkText;
    if (isPendingAppointment && featureBreadcrumbUrlUpdate) {
      linkText = 'Back to requests';
    } else if (isPendingAppointment) {
      linkText = 'Back to pending appointments';
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
    } else if (isUpcomingAppointment) {
      link = '/';
    } else if (isPastAppointment) {
      link = '/past';
    }
    return link;
  };
  return (
    <div
      className="backLinkContainer"
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
      >
        {handleBackLinkText()}
      </NavLink>
    </div>
  );
}

BackLink.propTypes = {
  appointment: PropTypes.object.isRequired,
};

import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function BackLink({ appointment }) {
  const {
    isPastAppointment,
    isPendingAppointment,
    isUpcomingAppointment,
  } = appointment.vaos;
  const handleBackLinkText = () => {
    let linkText;
    if (isPendingAppointment) {
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
    <div className="backLinkContainer">
      <div style={{ color: '#0753A3', marginRight: '0.5rem' }}>‹</div>
      <NavLink
        style={{ color: '#0753A3' }}
        aria-label="Breadcrumbs"
        to={handleBackLink()}
        className="vaos-hide-for-print backLink"
      >
        {handleBackLinkText()}
      </NavLink>
    </div>
  );
}

BackLink.propTypes = {
  appointment: PropTypes.object.isRequired,
};

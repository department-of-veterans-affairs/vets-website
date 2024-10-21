import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
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
  const history = useHistory();
  const dispatch = useDispatch();

  let status;
  let link;
  let linkText;
  if (isPendingAppointment) {
    status = 'pending';
    link = '/pending';
    linkText = 'Back to request for appointments';
  } else if (isUpcomingAppointment) {
    status = 'upcoming';
    link = '/';
    linkText = 'Back to appointments';
  } else if (isPastAppointment) {
    status = 'past';
    link = '/past';
    linkText = 'Back to past appointments';
  }

  const progress =
    location.search === '?confirmMsg=true' ? 'confirmation' : 'appointment';

  if (progress === 'confirmation' && status === 'upcoming') {
    status = 'direct';
  }

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
        aria-label={linkText}
        to={link}
        className="vaos-hide-for-print vads-u-color--link-default"
        onClick={() => {
          recordEvent({
            event: `${GA_PREFIX}-${status}-${progress}-details-descriptive-back-link`,
          });
          dispatch(closeCancelAppointment());
          if (progress !== 'confirmation') history.goBack();
        }}
      >
        {linkText}
      </NavLink>
    </div>
  );
}

BackLink.propTypes = {
  appointment: PropTypes.object.isRequired,
};

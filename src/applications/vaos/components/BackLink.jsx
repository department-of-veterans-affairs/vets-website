import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { closeCancelAppointment } from '../appointment-list/redux/actions';
import { GA_PREFIX } from '../utils/constants';

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
    linkText = 'Back to pending appointments';
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
      <VaLink
        back
        href={`/my-health/appointments${link}`}
        text={linkText}
        aria-label={linkText}
        className="vaos-hide-for-print vads-u-color--link-default"
        onClick={e => {
          e.preventDefault();

          recordEvent({
            event: `${GA_PREFIX}-${status}-${progress}-details-descriptive-back-link`,
          });
          dispatch(closeCancelAppointment());
          if (progress !== 'confirmation') {
            history.goBack();
          }
          history.push(link);
        }}
      />
    </div>
  );
}

BackLink.propTypes = {
  appointment: PropTypes.object.isRequired,
};

import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { routeToRequestAppointmentPage } from '../../redux/actions';

function RequestAppointmentLink({ pageKey }) {
  const dispatch = useDispatch();
  const history = useHistory();
  return (
    <va-link
      active
      href="my-health/appointments/schedule/va-request/"
      text="Request an appointment"
      data-testid="request-appointment-link"
      onClick={e => {
        e.preventDefault();
        dispatch(routeToRequestAppointmentPage(history, pageKey));
      }}
    />
  );
}

export default RequestAppointmentLink;

RequestAppointmentLink.propTypes = {
  pageKey: PropTypes.string,
};

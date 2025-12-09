import React from 'react';

import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { routeToRequestAppointmentPage } from '../../redux/actions';
import FacilityPhone from '../../../components/FacilityPhone';

function OptionsForRequest({ hasProviders, facilityPhone, pageKey }) {
  const dispatch = useDispatch();
  const history = useHistory();

  const title = hasProviders
    ? 'If you want to schedule with a different provider'
    : 'How to schedule';

  return (
    <>
      <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--0 vads-u-margin-top--2">
        {title}
      </h2>
      <h3 className="vads-u-font-size--h4 vads-u-margin-bottom--0 vads-u-margin-top--1">
        Option 1: Request your preferred date and time online
      </h3>
      <p className="vads-u-margin-top--0">
        We’ll contact you within 2 business days after we receive your request
        and help you finish scheduling your appointment.
      </p>
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
      <h3
        className="vads-u-font-size--h4 vads-u-margin-bottom--0 vads-u-margin-top--1p5"
        data-testid="cc-eligible-header"
      >
        Option 2: Call the facility
      </h3>
      <p className="vads-u-margin-y--0">
        Call and ask to schedule with that provider:{' '}
        <FacilityPhone contact={facilityPhone} icon={false} />
      </p>
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
    </>
  );
}

OptionsForRequest.propTypes = {
  facilityPhone: PropTypes.string,
  hasProviders: PropTypes.bool,
  pageKey: PropTypes.string,
};

export default OptionsForRequest;

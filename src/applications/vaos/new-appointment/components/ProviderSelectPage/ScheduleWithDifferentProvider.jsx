import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getFacilityPhone } from '../../../services/location';
import FacilityPhone from '../../../components/FacilityPhone';
import { ELIGIBILITY_REASONS } from '../../../utils/constants';
import { routeToRequestAppointmentPage } from '../../redux/actions';

export default function ScheduleWithDifferentProvider({
  eligibility,
  selectedFacility,
}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const pageKey = 'selectProvider';
  const facilityPhone = getFacilityPhone(selectedFacility);
  const isEligibleForRequest = eligibility?.request;
  const overRequestLimit =
    eligibility.requestReasons[0] === ELIGIBILITY_REASONS.overRequestLimit;

  if (overRequestLimit || !isEligibleForRequest) {
    return (
      <>
        <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--0 vads-u-margin-top--2">
          If you want to schedule with a different provider
        </h2>
        <p className="vads-u-margin-y--0">
          Call and ask to schedule with that provider:{' '}
          <FacilityPhone contact={facilityPhone} icon={false} />
        </p>
      </>
    );
  }
  return (
    <>
      <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--0 vads-u-margin-top--2">
        If you want to schedule with a different provider
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
        className="vads-u-font-size--h4 vads-u-margin-bottom--0 vads-u-margin-top--1"
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

ScheduleWithDifferentProvider.propTypes = {
  eligibility: PropTypes.object.isRequired,
  selectedFacility: PropTypes.object.isRequired,
};

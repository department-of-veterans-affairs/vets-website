import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getFacilityPhone } from '../../../services/location';
import FacilityPhone from '../../../components/FacilityPhone';
import getNewAppointmentFlow from '../../newAppointmentFlow';
import { startRequestAppointmentFlow } from '../../redux/actions';
import { ELIGIBILITY_REASONS } from '../../../utils/constants';

function handleClick(history, dispatch, requestDateTime) {
  return () => {
    dispatch(startRequestAppointmentFlow());
    history.push(requestDateTime.url);
  };
}

// const pageKey = 'selectProvider';
// // function handleClick(history, dispatch, requestDateTime, selectProvider) {
// function handleClick(history, dispatch, requestDateTime) {
//   return e => {
//     // Stop default behavior for anchor tag since we are using React routing.
//     e.preventDefault();

//     dispatch(routeToNextAppointmentPage(history, pageKey));
//     // history.push(selectProvider.url);
//     history.push(requestDateTime.url);
//   };
// }

export default function ScheduleWithDifferentProvider({
  eligibility,
  selectedFacility,
}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { requestDateTime } = useSelector(getNewAppointmentFlow);
  const facilityPhone = getFacilityPhone(selectedFacility);
  const overRequestLimit =
    eligibility.requestReasons[0] === ELIGIBILITY_REASONS.overRequestLimit;

  if (overRequestLimit) {
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
      <h3
        className="vads-u-font-size--h4 vads-u-margin-bottom--0 vads-u-margin-top--1"
        data-testid="cc-eligible-header"
      >
        Option 1: Call the facility
      </h3>
      <p className="vads-u-margin-y--0">
        Call and ask to schedule with that provider:{' '}
        <FacilityPhone contact={facilityPhone} icon={false} />
      </p>

      <h3 className="vads-u-font-size--h4 vads-u-margin-bottom--0 vads-u-margin-top--1">
        Option 2: Request your preferred date and time online
      </h3>
      <p className="vads-u-margin-top--0">
        We’ll contact you and help you finish scheduling your appointment.
      </p>
      <va-link
        active
        text="Request an appointment"
        // href={`${root.url}/${requestDateTime.url}`}
        onClick={handleClick(history, dispatch, requestDateTime)}
      />
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
    </>
  );
}

ScheduleWithDifferentProvider.propTypes = {
  eligibility: PropTypes.object.isRequired,
  selectedFacility: PropTypes.object.isRequired,
};

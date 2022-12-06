import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { makeSelectCurrentContext, makeSelectForm } from '../selectors';

const useTravelPayFlags = () => {
  const [travelPayClaimSent, setTravelPayClaimSent] = useState();
  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const context = useSelector(selectCurrentContext);
  const { token, appointment } = context;

  const selectForm = useMemo(makeSelectForm, []);
  const { data } = useSelector(selectForm);

  // These will be undefined if the travel pay pages are skipped.
  const {
    'travel-question': travelQuestion,
    'travel-address': travelAddress,
    'travel-mileage': travelMileage,
    'travel-vehicle': travelVehicle,
  } = data;

  const startDate = format(new Date(appointment.startTime), 'yyyy-LL-dd');

  let travelPayData = {
    uuid: token,
    appointmentDate: startDate,
  };

  if (travelQuestion !== undefined) {
    travelPayData = {
      ...travelPayData,
      travelQuestion: travelQuestion === 'yes',
    };
  }
  if (travelAddress !== undefined) {
    travelPayData = {
      ...travelPayData,
      travelAddress: travelAddress === 'yes',
    };
  }
  if (travelMileage !== undefined) {
    travelPayData = {
      ...travelPayData,
      travelMileage: travelMileage === 'yes',
    };
  }
  if (travelVehicle !== undefined) {
    travelPayData = {
      ...travelPayData,
      travelVehicle: travelVehicle === 'yes',
    };
  }

  const travelPayEligible =
    travelPayData.travelAddress &&
    travelPayData.travelMileage &&
    travelPayData.travelVehicle;

  return {
    travelPayData,
    travelPayClaimSent,
    setTravelPayClaimSent,
    travelPayEligible,
  };
};

export { useTravelPayFlags };

import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeSelectCurrentContext, makeSelectForm } from '../selectors';

const useTravelPayFlags = () => {
  const [travelPayClaimSent, setTravelPayClaimSent] = useState();
  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const context = useSelector(selectCurrentContext);
  const { token } = context;

  const selectForm = useMemo(makeSelectForm, []);
  const { data } = useSelector(selectForm);

  // These will be undefined if the travel pay pages are skipped.
  const {
    'travel-question': travelQuestion,
    'travel-address': travelAddress,
    'travel-mileage': travelMileage,
    'travel-vehicle': travelVehicle,
  } = data;

  let travelPayData = {
    uuid: token,
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

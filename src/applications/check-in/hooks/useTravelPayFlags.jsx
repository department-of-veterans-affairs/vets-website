import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeSelectCurrentContext, makeSelectForm } from '../selectors';

const useTravelPayFlags = () => {
  const [travelPayClaimSent, setTravelPayClaimSent] = useState(false);
  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const context = useSelector(selectCurrentContext);
  const { token } = context;

  const selectForm = useMemo(makeSelectForm, []);
  const { data } = useSelector(selectForm);

  // These will be undefined if the travel pay pages are skipped.
  const { travelQuestion, travelAddress, travelMileage, travelVehicle } = data;

  let travelPayData = {
    uuid: token,
  };

  if (travelQuestion !== undefined) {
    travelPayData = {
      ...travelPayData,
      travelQuestion: 'travel-question' === 'yes',
    };
  }
  if (travelAddress !== undefined) {
    travelPayData = {
      ...travelPayData,
      travelAddress: 'travel-address' === 'yes',
    };
  }
  if (travelMileage !== undefined) {
    travelPayData = {
      ...travelPayData,
      travelMileage: 'travel-mileage' === 'yes',
    };
  }
  if (travelVehicle !== undefined) {
    travelPayData = {
      ...travelPayData,
      travelVehicle: 'travel-vehicle' === 'yes',
    };
  }

  const travelPayEligible = travelAddress && travelMileage && travelVehicle;

  return {
    travelPayData,
    travelPayClaimSent,
    setTravelPayClaimSent,
    travelPayEligible,
  };
};

export { useTravelPayFlags };

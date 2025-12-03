import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { DLC_PHONE } from '../constants';
import { makeSelectFeatureToggles } from '../utils/selectors/feature-toggles';

import Accessories from './Accessories';
import ApneaSupplies from './ApneaSupplies';
import Batteries from './Batteries';

const BatteriesAndAccessories = () => {
  // Retrieve feature flag values to control behavior
  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const featureToggles = useSelector(selectFeatureToggles);
  const {
    isSupplyReorderingSleepApneaEnabled,
    isLoadingFeatureFlags,
  } = featureToggles;

  if (isLoadingFeatureFlags)
    return <va-loading-indicator message="Loading your information..." />;

  return (
    <>
      <h3>Add supplies to your order</h3>
      <p>
        We’ll send you a 6-month supply of each item added to your order. You
        can only order each item once every 5 months.
      </p>
      <p>
        If you need unavailable items sooner, please call the DLC Customer
        Service Section at <va-telephone contact={DLC_PHONE} /> or email{' '}
        <a href="mailto:dalc.css@va.gov">dalc.css@va.gov</a>.
      </p>
      <Batteries />
      <Accessories />
      {isSupplyReorderingSleepApneaEnabled && <ApneaSupplies />}
    </>
  );
};
export default BatteriesAndAccessories;

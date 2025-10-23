import React from 'react';
import { useSelector } from 'react-redux';
import { isLoggedIn } from 'platform/user/selectors';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';

import AuthContext from '../AuthContext';
import UnauthContext from '../UnauthContext';

export const App = () => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

  const currentlyLoggedIn = useSelector(isLoggedIn);
  const smocEnabled = useToggleValue(
    TOGGLE_NAMES.travelPaySubmitMileageExpense,
  );

  return (
    <>
      {!smocEnabled && (
        <p>
          You can file a claim online through the Beneficiary Travel Self
          Service System (BTSSS).
        </p>
      )}
      {currentlyLoggedIn ? <AuthContext /> : <UnauthContext />}
    </>
  );
};

export default App;

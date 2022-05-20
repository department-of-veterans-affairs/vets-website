import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
// import { debtLettersShowLetters } from '../../combined/utils/helpers';

const DebtLettersApp = ({ children }) => {
  const { debtLetters } = useSelector(({ combinedPortal }) => combinedPortal);

  const { isProfileUpdating, isPending, isPendingVBMS } = debtLetters;
  // const showDebtLetters = useSelector(state => debtLettersShowLetters(state));
  // isLoggedIn

  // Generic loading flags
  // const isLoadingFlags = useSelector(state => selectLoadingFeatureFlags(state));
  // const profileLoading = useSelector(state => isProfileLoading(state));

  // useEffect(
  //   () => {
  //     if (showDebtLetters) {
  //       const generateFetchDebtLetters = () => {
  //         fetchDebtLetters(dispatch);
  //       };
  //       dispatch(generateFetchDebtLetters);
  //     }
  //   },
  //   [dispatch, showDebtLetters],
  // );

  if (isPending || isPendingVBMS || isProfileUpdating) {
    return (
      <div className="vads-u-margin--5">
        <va-loading-indicator
          label="Loading"
          message="Please wait while we load the application for you."
          set-focus
        />
      </div>
    );
  }

  // if (showDebtLetters === false) {
  //   // TODO: URL Update
  //   window.location.replace('/manage-va-debt');
  //   return (
  //     <div className="vads-u-margin--5">
  //       <va-loading-indicator
  //         label="Loading"
  //         message="Please wait while we load the application for you."
  //         set-focus
  //       />
  //     </div>
  //   );
  // }
  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0 vads-u-margin-bottom--4 vads-u-margin-top--2 vads-u-font-family--serif">
      {children}
    </div>
  );
};

DebtLettersApp.propTypes = {
  children: PropTypes.array,
};

export default DebtLettersApp;

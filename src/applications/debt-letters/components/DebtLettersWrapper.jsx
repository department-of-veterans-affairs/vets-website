import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import { showDebtLettersSelector } from '../selectors';
import { isProfileLoading, isLoggedIn } from 'platform/user/selectors';
import { fetchDebts } from '../actions';

const DebtLettersWrapper = ({ children }) => {
  const showDebtLetters = useSelector(state => showDebtLettersSelector(state));
  const profileLoading = useSelector(state => isProfileLoading(state));
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  const pending = useSelector(({ debtLetters }) => debtLetters.pending);
  const pendingVBMS = useSelector(({ debtLetters }) => debtLetters.pendingVBMS);
  const dispatch = useDispatch();

  useEffect(
    () => {
      if (showDebtLetters) {
        dispatch(fetchDebts());
      }
    },
    [showDebtLetters], // eslint-disable-line react-hooks/exhaustive-deps
  );

  if (pending || pendingVBMS || profileLoading) {
    return (
      <div className="vads-u-margin--5">
        <LoadingIndicator
          setFocus
          message="Please wait while we load the application for you."
        />
      </div>
    );
  }

  if (showDebtLetters === false || userLoggedIn === false) {
    window.location.replace('/manage-va-debt');
    return (
      <div className="vads-u-margin--5">
        <LoadingIndicator
          setFocus
          message="Please wait while we load the application for you."
        />
      </div>
    );
  }

  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0 vads-u-margin-bottom--4 vads-u-margin-top--2 vads-u-font-family--serif">
      {children}
    </div>
  );
};

export default DebtLettersWrapper;

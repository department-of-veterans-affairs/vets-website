import React, { useCallback, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { createSetSession } from '../../actions/authentication';
import { setError } from '../../actions/universal';

import { useFormRouting } from '../../hooks/useFormRouting';

import ValidateDisplay from '../../components/pages/validate/ValidateDisplay';
import { validateLogin } from '../../utils/validateVeteran';
import { makeSelectCurrentContext } from '../../selectors';

import { useSessionStorage } from '../../hooks/useSessionStorage';
import { makeSelectFeatureToggles } from '../../utils/selectors/feature-toggles';

const ValidateVeteran = props => {
  const { router } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    getValidateAttempts,
    incrementValidateAttempts,
    resetAttempts,
    setPermissions,
  } = useSessionStorage(false);

  const updateError = useCallback(
    error => {
      dispatch(setError(error));
    },
    [dispatch],
  );

  const setSession = useCallback(
    (token, permissions) => {
      dispatch(createSetSession({ token, permissions }));
      setPermissions(window, permissions);
    },
    [dispatch, setPermissions],
  );

  const { goToNextPage, goToErrorPage } = useFormRouting(router);

  const [isLoading, setIsLoading] = useState(false);
  const [lastName, setLastName] = useState('');
  const [last4Ssn, setLast4Ssn] = useState('');

  const [dob, setDob] = useState('--');
  const [dobError, setDobError] = useState(false);

  const [lastNameErrorMessage, setLastNameErrorMessage] = useState();
  const [last4ErrorMessage, setLast4ErrorMessage] = useState();

  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const { token } = useSelector(selectCurrentContext);

  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const {
    isLorotaSecurityUpdatesEnabled,
    isLorotaDeletionEnabled,
  } = useSelector(selectFeatureToggles);

  const { isMaxValidateAttempts } = getValidateAttempts(window);
  const [showValidateError, setShowValidateError] = useState(false);
  const app = '';
  const onClick = useCallback(
    () => {
      setShowValidateError(false);
      validateLogin(
        last4Ssn,
        lastName,
        dob,
        dobError,
        setLastNameErrorMessage,
        setLast4ErrorMessage,
        setIsLoading,
        setShowValidateError,
        isLorotaSecurityUpdatesEnabled,
        goToErrorPage,
        goToNextPage,
        incrementValidateAttempts,
        isMaxValidateAttempts,
        token,
        setSession,
        app,
        resetAttempts,
        isLorotaDeletionEnabled,
        updateError,
      );
    },
    [
      app,
      goToErrorPage,
      goToNextPage,
      incrementValidateAttempts,
      isMaxValidateAttempts,
      last4Ssn,
      lastName,
      dob,
      dobError,
      resetAttempts,
      setSession,
      token,
      isLorotaDeletionEnabled,
      isLorotaSecurityUpdatesEnabled,
      updateError,
    ],
  );

  const validateErrorMessage = isLorotaSecurityUpdatesEnabled
    ? t(
        'sorry-we-couldnt-find-an-account-that-matches-that-last-name-or-date-of-birth-please-try-again',
      )
    : t(
        'were-sorry-we-couldnt-match-your-information-to-our-records-please-try-again',
      );

  return (
    <>
      <ValidateDisplay
        header={t('check-in-at-va')}
        subTitle={t(
          'we-need-some-information-to-verify-your-identity-so-we-can-check-you-in',
        )}
        last4Input={{
          last4ErrorMessage,
          setLast4Ssn,
          last4Ssn,
        }}
        lastNameInput={{
          lastNameErrorMessage,
          setLastName,
          lastName,
        }}
        dobInput={{
          setDob,
          dob,
        }}
        setDobError={setDobError}
        isLoading={isLoading}
        validateHandler={onClick}
        showValidateError={showValidateError}
        validateErrorMessage={validateErrorMessage}
      />
    </>
  );
};

ValidateVeteran.propTypes = {
  router: PropTypes.object,
};

export default ValidateVeteran;

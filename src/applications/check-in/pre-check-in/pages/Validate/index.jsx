import React, { useCallback, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import propTypes from 'prop-types';

import { useTranslation } from 'react-i18next';

import { createSetSession } from '../../../actions/authentication';

import BackToHome from '../../../components/BackToHome';
import ValidateDisplay from '../../../components/pages/validate/ValidateDisplay';
import Footer from '../../../components/layout/Footer';

import { useFormRouting } from '../../../hooks/useFormRouting';

import { makeSelectCurrentContext, makeSelectApp } from '../../../selectors';

import { useSessionStorage } from '../../../hooks/useSessionStorage';
import { makeSelectFeatureToggles } from '../../../utils/selectors/feature-toggles';
import { validateLogin } from '../../../utils/validateVeteran';

const Index = ({ router }) => {
  const { goToNextPage, goToErrorPage } = useFormRouting(router);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const setSession = useCallback(
    (token, permissions) => {
      dispatch(createSetSession({ token, permissions }));
    },
    [dispatch],
  );

  const selectContext = useMemo(makeSelectCurrentContext, []);
  const { token } = useSelector(selectContext);

  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);

  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const { isLorotaSecurityUpdatesEnabled } = useSelector(selectFeatureToggles);

  const [isLoading, setIsLoading] = useState(false);
  const [lastName, setLastName] = useState('');
  const [last4Ssn, setLast4Ssn] = useState('');
  const [dob, setDob] = useState('');

  const [lastNameErrorMessage, setLastNameErrorMessage] = useState();
  const [last4ErrorMessage, setLast4ErrorMessage] = useState();
  const [dobErrorMessage, setDobErrorMessage] = useState();

  const {
    getValidateAttempts,
    incrementValidateAttempts,
    resetAttempts,
  } = useSessionStorage(true);
  const { isMaxValidateAttempts } = getValidateAttempts(window);
  const [showValidateError, setShowValidateError] = useState(false);

  const validateHandler = useCallback(
    () => {
      validateLogin(
        last4Ssn,
        lastName,
        dob,
        setLastNameErrorMessage,
        setLast4ErrorMessage,
        setDobErrorMessage,
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
      resetAttempts,
      setSession,
      token,
      isLorotaSecurityUpdatesEnabled,
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
        header={t('start-pre-check-in')}
        subtitle={t(
          'we-need-to-verify-your-identity-so-you-can-start-pre-check-in',
        )}
        validateHandler={validateHandler}
        isLoading={isLoading}
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
          dobErrorMessage,
          setDob,
          dob,
        }}
        Footer={Footer}
        showValidateError={showValidateError}
        validateErrorMessage={validateErrorMessage}
      />
      <BackToHome />
    </>
  );
};

Index.propTypes = {
  router: propTypes.object,
};

export default Index;

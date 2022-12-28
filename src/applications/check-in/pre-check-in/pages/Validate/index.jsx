import React, { useCallback, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import propTypes from 'prop-types';

import { useTranslation } from 'react-i18next';

import { createSetSession } from '../../../actions/authentication';

import ValidateDisplay from '../../../components/pages/validate/ValidateDisplay';

import { useFormRouting } from '../../../hooks/useFormRouting';

import { makeSelectCurrentContext, makeSelectApp } from '../../../selectors';

import { useSessionStorage } from '../../../hooks/useSessionStorage';
import { useUpdateError } from '../../../hooks/useUpdateError';
import { makeSelectFeatureToggles } from '../../../utils/selectors/feature-toggles';
import { validateLogin } from '../../../utils/validateVeteran';

const Index = ({ router }) => {
  const { setPermissions } = useSessionStorage(true);
  const { goToNextPage } = useFormRouting(router);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { updateError } = useUpdateError();

  const setSession = useCallback(
    (token, permissions) => {
      dispatch(createSetSession({ token, permissions }));
      setPermissions(window, permissions);
    },
    [dispatch, setPermissions],
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
  const [dobError, setDobError] = useState(false);

  const [lastNameErrorMessage, setLastNameErrorMessage] = useState();
  const [last4ErrorMessage, setLast4ErrorMessage] = useState();

  const [showValidateError, setShowValidateError] = useState(false);

  const validateHandler = useCallback(
    () => {
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
        goToNextPage,
        token,
        setSession,
        app,
        updateError,
      );
    },
    [
      app,
      goToNextPage,
      last4Ssn,
      lastName,
      dob,
      dobError,
      setSession,
      token,
      isLorotaSecurityUpdatesEnabled,
      updateError,
    ],
  );

  const validateErrorMessage = isLorotaSecurityUpdatesEnabled
    ? t('sorry-we-couldnt-find-an-account-that-matches-last-name-or-dob')
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
        validateHandler={validateHandler}
        showValidateError={showValidateError}
        validateErrorMessage={validateErrorMessage}
      />
    </>
  );
};

Index.propTypes = {
  router: propTypes.object,
};

export default Index;

import React, { useCallback, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { createSetSession } from '../../actions/authentication';

import { useFormRouting } from '../../hooks/useFormRouting';

import BackToHome from '../../components/BackToHome';
import Footer from '../../components/layout/Footer';
import ValidateDisplay from '../../components/pages/validate/ValidateDisplay';
import { validateLogin } from '../../utils/validateVeteran';
import { makeSelectCurrentContext } from '../../selectors';

import { useSessionStorage } from '../../hooks/useSessionStorage';
import { makeSelectFeatureToggles } from '../../utils/selectors/feature-toggles';

const ValidateVeteran = props => {
  const { router } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const setSession = useCallback(
    (token, permissions) => {
      dispatch(createSetSession({ token, permissions }));
    },
    [dispatch],
  );

  const { goToNextPage, goToErrorPage } = useFormRouting(router);

  const [isLoading, setIsLoading] = useState(false);
  const [lastName, setLastName] = useState('');
  const [last4Ssn, setLast4Ssn] = useState('');

  const defaultDob = Object.freeze({
    day: {
      value: '',
      dirty: false,
    },
    month: {
      value: '',
      dirty: false,
    },
    year: {
      value: '',
      dirty: false,
    },
  });
  const [dob, setDob] = useState(defaultDob);

  const [lastNameErrorMessage, setLastNameErrorMessage] = useState();
  const [last4ErrorMessage, setLast4ErrorMessage] = useState();
  const [dobErrorMessage, setDobErrorMessage] = useState();

  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const { token } = useSelector(selectCurrentContext);

  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const { isLorotaSecurityUpdatesEnabled } = useSelector(selectFeatureToggles);

  const { getValidateAttempts, incrementValidateAttempts } = useSessionStorage(
    false,
  );
  const { isMaxValidateAttempts } = getValidateAttempts(window);
  const [showValidateError, setShowValidateError] = useState(false);
  const app = '';
  const onClick = useCallback(
    () => {
      validateLogin(
        last4Ssn,
        lastName,
        dob,
        showValidateError,
        setLastNameErrorMessage,
        setLast4ErrorMessage,
        setDobErrorMessage,
        setDob,
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
      setSession,
      showValidateError,
      token,
      isLorotaSecurityUpdatesEnabled,
    ],
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
          dobErrorMessage,
          setDob,
          dob,
        }}
        isLoading={isLoading}
        validateHandler={onClick}
        Footer={Footer}
        showValidateError={showValidateError}
        validateErrorMessage={t(
          'were-sorry-we-couldnt-match-your-information-to-our-records-please-try-again',
        )}
      />
      <BackToHome />
    </>
  );
};

ValidateVeteran.propTypes = {
  router: PropTypes.object,
};

export default ValidateVeteran;

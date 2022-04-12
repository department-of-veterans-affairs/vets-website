import React, { useCallback, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { focusElement } from 'platform/utilities/ui';
import isAfter from 'date-fns/isAfter';

import { api } from '../../api';
import { createSetSession } from '../../actions/authentication';

import { useFormRouting } from '../../hooks/useFormRouting';

import BackToHome from '../../components/BackToHome';
import Footer from '../../components/Footer';
import ValidateDisplay from '../../components/pages/validate/ValidateDisplay';

import { makeSelectCurrentContext } from '../../selectors';

import { useSessionStorage } from '../../hooks/useSessionStorage';
import { makeSelectFeatureToggles } from '../../utils/selectors/feature-toggles';
import { formatDateObjectTo8601 } from '../../utils/formatters';

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
      value: 1,
      dirty: false,
    },
    month: {
      value: 1,
      dirty: false,
    },
    year: {
      value: '1976',
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

  const onClick = useCallback(
    async () => {
      setLastNameErrorMessage();
      setLast4ErrorMessage();
      setDobErrorMessage();
      if (isLorotaSecurityUpdatesEnabled) {
        if (!lastName || isAfter(new Date(dob.year.value), new Date())) {
          if (!lastName) {
            setLastNameErrorMessage(t('please-enter-your-last-name'));
          }
          if (isAfter(new Date(dob.year.value), new Date())) {
            setDobErrorMessage(
              t('your-date-of-birth-can-not-be-in-the-future'),
            );
            setDob(prevState => ({
              year: { ...prevState.year, dirty: true },
              day: { ...prevState.day, dirty: true },
              month: { ...prevState.month, dirty: true },
            }));
          }
        } else {
          setIsLoading(true);
          try {
            const resp = await api.v2.postSessionDOB({
              token,
              dob: formatDateObjectTo8601(dob),
              lastName,
            });
            if (resp.errors || resp.error) {
              setIsLoading(false);
              goToErrorPage();
            } else {
              setSession(token, resp.permissions);
              goToNextPage();
            }
          } catch (e) {
            setIsLoading(false);
            if (e?.errors[0]?.status !== '401' || isMaxValidateAttempts) {
              goToErrorPage();
            } else {
              if (!showValidateError) {
                setShowValidateError(true);
              }
              incrementValidateAttempts(window);
            }
          }
        }
      } else if (!lastName || !last4Ssn) {
        if (!lastName) {
          setLastNameErrorMessage(t('please-enter-your-last-name'));
        }
        if (!last4Ssn) {
          setLast4ErrorMessage(
            t('please-enter-the-last-4-digits-of-your-social-security-number'),
          );
        }
      } else {
        // API call
        setIsLoading(true);
        try {
          const resp = await api.v2.postSession({
            token,
            last4: last4Ssn,
            lastName,
          });
          if (resp.errors || resp.error) {
            setIsLoading(false);
            goToErrorPage();
          } else {
            setSession(token, resp.permissions);
            goToNextPage();
          }
        } catch (e) {
          setIsLoading(false);
          if (e?.errors[0]?.status !== '401' || isMaxValidateAttempts) {
            goToErrorPage();
          } else {
            if (!showValidateError) {
              setShowValidateError(true);
            }
            incrementValidateAttempts(window);
          }
        }
      }
    },
    [
      goToErrorPage,
      goToNextPage,
      last4Ssn,
      lastName,
      dob,
      setSession,
      token,
      incrementValidateAttempts,
      isMaxValidateAttempts,
      showValidateError,
      isLorotaSecurityUpdatesEnabled,
      t,
    ],
  );
  useEffect(() => {
    focusElement('h1');
  }, []);
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

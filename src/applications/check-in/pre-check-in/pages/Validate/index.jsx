import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import propTypes from 'prop-types';

import { useTranslation } from 'react-i18next';
import { focusElement } from 'platform/utilities/ui';
import isAfter from 'date-fns/isAfter';

import { api } from '../../../api';

import { createSetSession } from '../../../actions/authentication';

import BackToHome from '../../../components/BackToHome';
import ValidateDisplay from '../../../components/pages/validate/ValidateDisplay';
import Footer from '../../../components/Footer';

import { useFormRouting } from '../../../hooks/useFormRouting';

import { makeSelectCurrentContext, makeSelectApp } from '../../../selectors';

import { useSessionStorage } from '../../../hooks/useSessionStorage';
import { makeSelectFeatureToggles } from '../../../utils/selectors/feature-toggles';
import { formatDateObjectTo8601 } from '../../../utils/formatters';

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

  const { getValidateAttempts, incrementValidateAttempts } = useSessionStorage(
    true,
  );
  const { isMaxValidateAttempts } = getValidateAttempts(window);
  const [showValidateError, setShowValidateError] = useState(false);

  const validateHandler = useCallback(
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
              checkInType: app,
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
        setIsLoading(true);
        try {
          const resp = await api.v2.postSession({
            token,
            last4: last4Ssn,
            lastName,
            checkInType: app,
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
      t,
      isLorotaSecurityUpdatesEnabled,
    ],
  );

  useEffect(() => {
    focusElement('h1');
  }, []);
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
        validateErrorMessage={t(
          'were-sorry-we-couldnt-match-your-information-to-our-records-please-try-again',
        )}
      />
      <BackToHome />
    </>
  );
};

Index.propTypes = {
  router: propTypes.object,
};

export default Index;

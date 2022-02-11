import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import propTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui';

import { api } from '../../../api';

import { createSetSession } from '../../../actions/authentication';

import BackToHome from '../../../components/BackToHome';
import ValidateDisplay from '../../../components/pages/validate/ValidateDisplay';
import Footer from '../../../components/Footer';

import { useFormRouting } from '../../../hooks/useFormRouting';

import { makeSelectCurrentContext, makeSelectApp } from '../../../selectors';

import { useSessionStorage } from '../../../hooks/useSessionStorage';

const Index = ({ router }) => {
  const { goToNextPage, goToErrorPage } = useFormRouting(router);
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

  const [isLoading, setIsLoading] = useState(false);
  const [lastName, setLastName] = useState('');
  const [last4Ssn, setLast4Ssn] = useState('');

  const [lastNameErrorMessage, setLastNameErrorMessage] = useState();
  const [last4ErrorMessage, setLast4ErrorMessage] = useState();

  const { getValidateAttempts, incrementValidateAttempts } = useSessionStorage(
    true,
  );
  const { isMaxValidateAttempts } = getValidateAttempts(window);
  const [showValidateError, setShowValidateError] = useState(false);

  const validateHandler = useCallback(
    async () => {
      setLastNameErrorMessage();
      setLast4ErrorMessage();
      if (!lastName || !last4Ssn) {
        if (!lastName) {
          setLastNameErrorMessage('Please enter your last name.');
        }
        if (!last4Ssn) {
          setLast4ErrorMessage(
            'Please enter the last 4 digits of your Social Security number.',
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
          if (
            e?.message !== 'Invalid last4 or last name!' ||
            isMaxValidateAttempts
          ) {
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
      setSession,
      token,
      showValidateError,
    ],
  );

  useEffect(() => {
    focusElement('h1');
  }, []);
  return (
    <>
      <ValidateDisplay
        header="Start pre-check-in"
        subtitle="We need to verify your identity so you can start pre-check-in."
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
        Footer={Footer}
        showValidateError={showValidateError}
        validateErrorMessage="Sorry, we couldn't find an account that matches that last name or SSN. Please try again."
      />
      <BackToHome />
    </>
  );
};

Index.propTypes = {
  router: propTypes.object,
};

export default Index;

import React, { useCallback, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';

import { api } from '../../api';
import { createSetSession } from '../../actions/authentication';

import { useFormRouting } from '../../hooks/useFormRouting';

import BackToHome from '../../components/BackToHome';
import Footer from '../../components/Footer';
import ValidateDisplay from '../../components/pages/validate/ValidateDisplay';

import { makeSelectCurrentContext } from '../../selectors';

import { useSessionStorage } from '../../hooks/useSessionStorage';

const ValidateVeteran = props => {
  const { router } = props;
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

  const [lastNameErrorMessage, setLastNameErrorMessage] = useState();
  const [last4ErrorMessage, setLast4ErrorMessage] = useState();

  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const { token } = useSelector(selectCurrentContext);

  const { getValidateAttempts, incrementValidateAttempts } = useSessionStorage(
    false,
  );
  const { isMaxValidateAttempts } = getValidateAttempts(window);
  const [showValidateError, setShowValidateError] = useState(false);

  const onClick = useCallback(
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
      goToErrorPage,
      goToNextPage,
      last4Ssn,
      lastName,
      setSession,
      token,
      incrementValidateAttempts,
      isMaxValidateAttempts,
      showValidateError,
    ],
  );
  useEffect(() => {
    focusElement('h1');
  }, []);
  return (
    <>
      <ValidateDisplay
        header="Check in at VA"
        subTitle="We need some information to verify your identity so we can check you in."
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
        isLoading={isLoading}
        validateHandler={onClick}
        Footer={Footer}
        showValidateError={showValidateError}
        validateErrorMessage="Sorry, we couldn't find an account that matches that last name or SSN. Please try again."
      />
      <BackToHome />
    </>
  );
};

ValidateVeteran.propTypes = {
  router: PropTypes.object,
};

export default ValidateVeteran;

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';

import { api } from '../../../api';

import { createSetSession } from '../../../actions/authentication';

import BackToHome from '../../components/BackToHome';
import ValidateDisplay from '../../../components/pages/validate/ValidateDisplay';
import Footer from '../../components/Footer';

import { useFormRouting } from '../../../hooks/useFormRouting';
import { URLS } from '../../../utils/navigation/pre-check-in';

import { makeSelectCurrentContext } from '../../../selectors';

export default function Index({ router }) {
  const { goToNextPage, goToErrorPage } = useFormRouting(router, URLS);
  const dispatch = useDispatch();
  const setSession = useCallback(
    (token, permissions) => {
      dispatch(createSetSession({ token, permissions }));
    },
    [dispatch],
  );

  const selectContext = useMemo(makeSelectCurrentContext, []);
  const { token } = useSelector(selectContext);

  const [isLoading, setIsLoading] = useState(false);
  const [lastName, setLastName] = useState('');
  const [last4Ssn, setLast4Ssn] = useState('');

  const [lastNameErrorMessage, setLastNameErrorMessage] = useState();
  const [last4ErrorMessage, setLast4ErrorMessage] = useState();
  const validateHandler = async () => {
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
        });
        setSession(token, resp.permissions);
        goToNextPage();
      } catch (e) {
        setIsLoading(false);
        goToErrorPage();
      }
    }
  };

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
      />
      <BackToHome />
    </>
  );
}

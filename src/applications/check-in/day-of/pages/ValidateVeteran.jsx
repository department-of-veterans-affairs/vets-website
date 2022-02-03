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
        const checkInType = 'checkIn';
        try {
          const resp = await api.v2.postSession({
            token,
            last4: last4Ssn,
            lastName,
            checkInType,
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
          goToErrorPage();
        }
      }
    },
    [goToErrorPage, goToNextPage, last4Ssn, lastName, setSession, token],
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
      />
      <BackToHome />
    </>
  );
};

ValidateVeteran.propTypes = {
  router: PropTypes.object,
};

export default ValidateVeteran;

import React, { useCallback, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import propTypes from 'prop-types';

import { useTranslation } from 'react-i18next';

import { createSetSession } from '../../../actions/authentication';

import ValidateDisplay from '../../../components/pages/validate/ValidateDisplay';

import { useFormRouting } from '../../../hooks/useFormRouting';

import { makeSelectCurrentContext, makeSelectApp } from '../../../selectors';

import { useStorage } from '../../../hooks/useStorage';
import { useUpdateError } from '../../../hooks/useUpdateError';
import { validateLogin } from '../../../utils/validateVeteran';

const Validate = ({ router }) => {
  const { setPermissions } = useStorage(true);
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

  const [isLoading, setIsLoading] = useState(false);
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [dobError, setDobError] = useState(false);

  const [lastNameError, setLastNameError] = useState(false);

  const [showValidateError, setShowValidateError] = useState(false);

  const validateHandler = useCallback(
    () => {
      validateLogin(
        lastName,
        dob,
        dobError,
        setLastNameError,
        setIsLoading,
        setShowValidateError,
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
      lastName,
      dob,
      dobError,
      setSession,
      token,
      updateError,
    ],
  );

  const validateErrorMessage = t(
    'sorry-we-couldnt-find-an-account-that-matches-last-name-or-dob',
  );

  return (
    <>
      <ValidateDisplay
        header={t('file-travel-reimbursement-claim')}
        subtitle={t('file-a-travel-reimbursement-claim-if-youre-eligible')}
        lastNameInput={{
          lastNameError,
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

Validate.propTypes = {
  router: propTypes.object,
};

export default Validate;

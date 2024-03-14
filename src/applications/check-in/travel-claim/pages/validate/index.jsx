import React, { useCallback, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import propTypes from 'prop-types';

import { useTranslation } from 'react-i18next';

import { createSetSession } from '../../../actions/authentication';

import ValidateDisplay from '../../../components/pages/validate/ValidateDisplay';

import { useFormRouting } from '../../../hooks/useFormRouting';

import { makeSelectCurrentContext } from '../../../selectors';
import { APP_NAMES } from '../../../utils/appConstants';

import { useStorage } from '../../../hooks/useStorage';
import { useUpdateError } from '../../../hooks/useUpdateError';
import { validateLogin } from '../../../utils/validateVeteran';

const Validate = ({ router }) => {
  const { setPermissions } = useStorage(APP_NAMES.TRAVEL_CLAIM);
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
        APP_NAMES.TRAVEL_CLAIM,
        updateError,
      );
    },
    [goToNextPage, lastName, dob, dobError, setSession, token, updateError],
  );

  const validateErrorMessage = t(
    'sorry-we-couldnt-find-an-account-that-matches-last-name-or-dob',
  );

  return (
    <>
      <ValidateDisplay
        header={t('file-travel-reimbursement-claim')}
        subtitle={t('first-need-last-name-date-birth')}
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

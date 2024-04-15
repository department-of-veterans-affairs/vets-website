import React, { useCallback, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { createSetSession } from '../../actions/authentication';

import { useFormRouting } from '../../hooks/useFormRouting';
import { useUpdateError } from '../../hooks/useUpdateError';

import ValidateDisplay from '../../components/pages/validate/ValidateDisplay';
import { validateLogin } from '../../utils/validateVeteran';
import { makeSelectCurrentContext } from '../../selectors';
import { APP_NAMES } from '../../utils/appConstants';

import { useStorage } from '../../hooks/useStorage';

const ValidateVeteran = props => {
  const { router } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { setPermissions } = useStorage(APP_NAMES.CHECK_IN);

  const { updateError } = useUpdateError();

  const setSession = useCallback(
    (token, permissions) => {
      dispatch(createSetSession({ token, permissions }));
      setPermissions(window, permissions);
    },
    [dispatch, setPermissions],
  );

  const { goToNextPage } = useFormRouting(router);

  const [isLoading, setIsLoading] = useState(false);
  const [lastName, setLastName] = useState('');

  const [dob, setDob] = useState('--');
  const [dobError, setDobError] = useState(false);

  const [lastNameError, setLastNameError] = useState();

  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const { token } = useSelector(selectCurrentContext);

  const [showValidateError, setShowValidateError] = useState(false);
  const app = '';
  const onClick = useCallback(
    () => {
      setShowValidateError(false);
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
        header={t('check-in-at-va')}
        subTitle={t(
          'we-need-some-information-to-verify-your-identity-so-we-can-check-you-in',
        )}
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
        validateHandler={onClick}
        showValidateError={showValidateError}
        validateErrorMessage={validateErrorMessage}
      />
    </>
  );
};

ValidateVeteran.propTypes = {
  router: PropTypes.object,
};

export default ValidateVeteran;

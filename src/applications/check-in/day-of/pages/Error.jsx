import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { makeSelectError } from '../../selectors';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import Wrapper from '../../components/layout/Wrapper';

const Error = () => {
  const { t } = useTranslation();
  const { getValidateAttempts } = useSessionStorage(false);
  const selectError = useMemo(makeSelectError, []);
  const { error } = useSelector(selectError);
  const { isMaxValidateAttempts } = getValidateAttempts(window);

  const validationError = isMaxValidateAttempts || error === 'max-validation';

  const maxValidateMessage = t(
    'were-sorry-we-couldnt-match-your-information-to-our-records-please-ask-a-staff-member-for-help',
  );
  const message = validationError
    ? maxValidateMessage
    : t(
        'were-sorry-something-went-wrong-on-our-end-check-in-with-a-staff-member',
      );

  return (
    <Wrapper pageTitle={t('we-couldnt-check-you-in')}>
      <va-alert
        background-only
        show-icon
        status={validationError ? 'error' : 'info'}
        data-testid="error-message"
      >
        <div>{message}</div>
      </va-alert>
    </Wrapper>
  );
};

export default Error;

import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { makeSelectError } from '../../selectors';
import Wrapper from '../../components/layout/Wrapper';

const Error = () => {
  const { t } = useTranslation();
  const selectError = useMemo(makeSelectError, []);
  const { error } = useSelector(selectError);

  const message =
    error === 'max-validation'
      ? 'were-sorry-we-couldnt-match-your-information-please-ask-for-help'
      : t(
          'were-sorry-something-went-wrong-on-our-end-check-in-with-a-staff-member',
        );

  return (
    <Wrapper pageTitle={t('we-couldnt-check-you-in')}>
      <va-alert
        background-only
        show-icon
        status={error === 'max-validation' ? 'error' : 'info'}
        data-testid="error-message"
      >
        <div>{message}</div>
      </va-alert>
    </Wrapper>
  );
};

export default Error;

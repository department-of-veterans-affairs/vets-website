import React from 'react';
import { useTranslation } from 'react-i18next';

import BackToHome from '../../components/BackToHome';
import Footer from '../../components/layout/Footer';

import { useSessionStorage } from '../../hooks/useSessionStorage';
import Wrapper from '../../components/layout/Wrapper';

const Error = () => {
  const { t } = useTranslation();
  const { getValidateAttempts } = useSessionStorage(false);
  const { isMaxValidateAttempts } = getValidateAttempts(window);
  const maxValidateMessage = t(
    'were-sorry-we-couldnt-match-your-information-to-our-records-please-ask-a-staff-member-for-help',
  );
  const message = isMaxValidateAttempts
    ? maxValidateMessage
    : t(
        'were-sorry-something-went-wrong-on-our-end-check-in-with-a-staff-member',
      );

  return (
    <Wrapper pageTitle={t('we-couldnt-check-you-in')}>
      <va-alert
        background-only
        show-icon
        status={isMaxValidateAttempts ? 'error' : 'info'}
        data-testid="error-message"
      >
        <div>{message}</div>
      </va-alert>
      <Footer />
      <BackToHome />
    </Wrapper>
  );
};

export default Error;

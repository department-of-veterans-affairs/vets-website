import React from 'react';
import { useTranslation } from 'react-i18next';

import ErrorMessage from '../../components/ErrorMessage';
import BackToHome from '../../components/BackToHome';
import Footer from '../../components/layout/Footer';

import { useSessionStorage } from '../../hooks/useSessionStorage';
import Wrapper from '../../components/layout/Wrapper';

const Error = () => {
  const { t } = useTranslation();
  const { getValidateAttempts } = useSessionStorage(false);
  const { isMaxValidateAttempts } = getValidateAttempts(window);
  return (
    <Wrapper pageTitle={t('we-couldnt-check-you-in')}>
      {isMaxValidateAttempts ? (
        <ErrorMessage isMaxValidateAttempts />
      ) : (
        <ErrorMessage />
      )}
      <Footer />
      <BackToHome />
    </Wrapper>
  );
};

export default Error;

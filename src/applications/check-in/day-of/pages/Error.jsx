import React from 'react';
import { useTranslation } from 'react-i18next';

import ErrorMessage from '../../components/ErrorMessage';
import BackToHome from '../../components/BackToHome';
import LanguagePicker from '../../components/LanguagePicker';
import Footer from '../../components/Footer';

import { useSessionStorage } from '../../hooks/useSessionStorage';

const Error = () => {
  const { getValidateAttempts } = useSessionStorage(false);
  const { isMaxValidateAttempts } = getValidateAttempts(window);
  const { t } = useTranslation();
  const maxValidateMessage = t(
    'were-sorry-we-couldnt-match-your-information-to-our-records-please-ask-a-staff-member-for-help',
  );
  return (
    <div className="vads-l-grid-container vads-u-padding-y--5 ">
      {isMaxValidateAttempts ? (
        <ErrorMessage message={maxValidateMessage} />
      ) : (
        <ErrorMessage />
      )}
      <Footer />
      <BackToHome />
      <LanguagePicker />
    </div>
  );
};

export default Error;

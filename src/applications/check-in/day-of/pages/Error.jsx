import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';

import { makeSelectError } from '../../selectors';
import Wrapper from '../../components/layout/Wrapper';

const Error = () => {
  const { t } = useTranslation();
  const selectError = useMemo(makeSelectError, []);
  const { error } = useSelector(selectError);

  let messageText = '';
  let alertType = '';
  let header = '';

  switch (error) {
    case 'max-validation':
      alertType = 'error';
      header = t('we-couldnt-check-you-in');
      messageText = t(
        'were-sorry-we-couldnt-match-your-information-please-ask-for-help',
      );
      break;
    case 'uuid-not-found':
      // Shown when POST sessions returns 404.
      alertType = 'info';
      header = t('were-sorry-this-link-has-expired');
      messageText = (
        <Trans
          i18nKey="trying-to-check-in-for-an-appointment--info-message"
          components={[
            <span key="bold" className="vads-u-font-weight--bold" />,
            <va-telephone
              key="53079"
              data-testid="error-message-sms"
              contact="53079"
              sms
            />,
          ]}
        />
      );
      break;
    default:
      alertType = 'info';
      header = t('we-couldnt-check-you-in');
      messageText = t(
        'were-sorry-something-went-wrong-on-our-end-check-in-with-a-staff-member',
      );
  }

  return (
    <Wrapper pageTitle={header}>
      <va-alert
        background-only
        show-icon
        status={alertType}
        data-testid="error-message"
      >
        <div>{messageText}</div>
      </va-alert>
    </Wrapper>
  );
};

export default Error;

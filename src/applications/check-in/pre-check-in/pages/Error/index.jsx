import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { subDays } from 'date-fns';

import ErrorMessage from '../../../components/ErrorMessage';
import BackToHome from '../../../components/BackToHome';
import Footer from '../../../components/Footer';

import { makeSelectVeteranData } from '../../../selectors';

import { useSessionStorage } from '../../../hooks/useSessionStorage';

const Error = props => {
  const { expired } = props.location.query;
  const { getValidateAttempts } = useSessionStorage(true);
  const { isMaxValidateAttempts } = getValidateAttempts(window);
  // try get date of appointment
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { appointments } = useSelector(selectVeteranData);
  const { t } = useTranslation();

  // If date exists, then show date.
  const defaultMessageText = isMaxValidateAttempts
    ? t(
        'were-sorry-we-couldnt-match-your-information-to-our-records-please-call-us-at-800-698-2411-tty-711-for-help-signing-in',
      )
    : t('were-sorry-something-went-wrong-on-our-end-please-try-again');
  const messages = [
    {
      text: defaultMessageText,
    },
  ];
  if (appointments && appointments.length > 0 && appointments[0].startTime) {
    messages.push({
      text: t('you-can-pre-check-in-online-until-date', {
        date: subDays(new Date(appointments[0].startTime), 1),
      }),
      testId: 'date-message',
    });
  }
  const combinedMessage = (
    <>
      {messages.map((message, index) => {
        return (
          <p key={index} data-testid={message.testId}>
            {message.text}
          </p>
        );
      })}
    </>
  );

  return (
    <div className="vads-l-grid-container vads-u-padding-y--5 ">
      <ErrorMessage
        header={
          expired
            ? t('sorry-we-cant-complete-pre-check-in')
            : t('we-couldnt-complete-pre-check-in')
        }
        message={
          expired
            ? t('you-can-still-check-in-once-you-arrive')
            : combinedMessage
        }
        showAlert={!expired}
      />
      <Footer />
      <BackToHome />
    </div>
  );
};

export default Error;

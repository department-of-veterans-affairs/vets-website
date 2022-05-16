import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { subDays } from 'date-fns';

import ErrorMessage from '../../../components/ErrorMessage';
import BackToHome from '../../../components/BackToHome';
import Footer from '../../../components/Footer';
import PreCheckInAccordionBlock from '../../../components/PreCheckInAccordionBlock';

import { makeSelectVeteranData } from '../../../selectors';
import {
  preCheckinExpired,
  appointmentStartTimePast15,
} from '../../../utils/appointment';

import { useSessionStorage } from '../../../hooks/useSessionStorage';

const Error = () => {
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
          <div key={index} data-testid={message.testId}>
            {message.text}
          </div>
        );
      })}
    </>
  );

  const getErrorMessages = () => {
    if (appointments && appointments.length) {
      // don't show sub message if we are 15 minutes past appointment start time
      if (appointmentStartTimePast15(appointments)) return ['', null];
      if (preCheckinExpired(appointments))
        return [
          t('you-can-still-check-in-once-you-arrive'),
          <PreCheckInAccordionBlock key="accordion" errorPage />,
        ];
    }
    return [combinedMessage, null];
  };
  const header = t('sorry-we-cant-complete-pre-check-in');
  const [message, additionalDetails] = getErrorMessages();

  return (
    <div className="vads-l-grid-container vads-u-padding-y--5 ">
      <ErrorMessage
        header={header}
        message={message}
        additionalDetails={additionalDetails}
      />
      <Footer />
      <BackToHome />
    </div>
  );
};

Error.propTypes = {
  location: PropTypes.shape({
    query: PropTypes.shape({
      type: PropTypes.string,
    }),
  }),
};

export default Error;

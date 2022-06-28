import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { subDays } from 'date-fns';

import ErrorMessage from '../../../components/ErrorMessage';
import BackToHome from '../../../components/BackToHome';
import Footer from '../../../components/layout/Footer';
import PreCheckInAccordionBlock from '../../../components/PreCheckInAccordionBlock';

import { makeSelectVeteranData } from '../../../selectors';
import { makeSelectFeatureToggles } from '../../../utils/selectors/feature-toggles';

import {
  preCheckinExpired,
  appointmentStartTimePast15,
} from '../../../utils/appointment';

import { useSessionStorage } from '../../../hooks/useSessionStorage';
import Wrapper from '../../../components/layout/Wrapper';

const Error = () => {
  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const { isPhoneAppointmentsEnabled } = useSelector(selectFeatureToggles);
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
      const accordions = (
        <PreCheckInAccordionBlock
          key="accordion"
          errorPage
          appointments={appointments}
        />
      );
      // don't show sub message if we are 15 minutes past appointment start time
      if (appointmentStartTimePast15(appointments))
        return [t('sorry-pre-check-in-is-no-longer-available'), '', accordions];
      if (preCheckinExpired(appointments)) {
        if (!isPhoneAppointmentsEnabled) {
          return [
            t('sorry-pre-check-in-is-no-longer-available'),
            t('you-can-still-check-in-once-you-arrive'),
            accordions,
          ];
        }
        const apptType = appointments[0]?.kind;
        return [
          t('sorry-pre-check-in-is-no-longer-available'),
          apptType === 'phone'
            ? `${t('your-provider-will-call-you')} ${t('you-may-need-to-wait')}`
            : t('you-can-still-check-in-once-you-arrive'),
          accordions,
        ];
      }
    }
    return [t('sorry-we-cant-complete-pre-check-in'), combinedMessage, null];
  };
  const [header, message, additionalDetails] = getErrorMessages();

  return (
    <Wrapper pageTitle={header}>
      <ErrorMessage
        message={message}
        additionalDetails={additionalDetails}
        validationError={isMaxValidateAttempts}
      />
      <Footer />
      <BackToHome />
    </Wrapper>
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

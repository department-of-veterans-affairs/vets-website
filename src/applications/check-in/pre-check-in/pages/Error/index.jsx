import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { subDays } from 'date-fns';

import PreCheckInAccordionBlock from '../../../components/PreCheckInAccordionBlock';
import HowToLink from '../../../components/HowToLink';

import { makeSelectVeteranData, makeSelectError } from '../../../selectors';

import {
  preCheckinExpired,
  appointmentStartTimePast15,
  appointmentWasCanceled,
  getFirstCanceledAppointment,
} from '../../../utils/appointment';

import { useSessionStorage } from '../../../hooks/useSessionStorage';
import Wrapper from '../../../components/layout/Wrapper';

const appointmentAccordion = appointments => {
  return (
    <PreCheckInAccordionBlock
      key="accordion"
      errorPage
      appointments={appointments}
    />
  );
};

const Error = () => {
  const { getValidateAttempts } = useSessionStorage(true);
  const { isMaxValidateAttempts } = getValidateAttempts(window);
  const selectError = useMemo(makeSelectError, []);
  const { error } = useSelector(selectError);

  let apptType = 'clinic';
  const validationError = isMaxValidateAttempts || error === 'max-validation';
  // Get appointment dates if available.
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { appointments } = useSelector(selectVeteranData);

  const { t } = useTranslation();

  const mixedPhoneAndInPersonMessage = (
    <div>
      <div>
        <span className="fas fa-chevron-right vads-u-margin-left--neg0p5" />
        <span className="appointment-type-label vads-u-margin-left--0p5 vads-u-font-weight--bold">
          {t('in-person-appointment')}
        </span>
      </div>
      <div className="vads-u-margin-top--2">
        {t(
          'you-can-still-check-in-with-your-phone-on-the-day-of-your-appointment',
        )}
      </div>
      <div className="vads-u-margin-top--2">
        <span className="fas fa-chevron-right vads-u-margin-left--neg0p5" />
        <span className="appointment-type-label vads-u-margin-left--0p5 vads-u-font-weight--bold">
          {t('telephone-appointment')}
        </span>
      </div>
      <div className="vads-u-margin-top--2">
        {t(
          'your-provider-will-call-you-at-your-appointment-time-you-may-need-to-wait-about-15-minutes-for-their-call-thanks-for-your-patience',
        )}
      </div>
    </div>
  );

  let header = t('sorry-we-cant-complete-pre-check-in');
  let messages = [];
  let accordion = null;

  let messageText = t(
    'were-sorry-something-went-wrong-on-our-end-please-try-again',
  );
  let showHowToLink = true;
  const dontShowLinkErrors = [
    'session-error',
    'bad-token',
    'no-token',
    'max-validation',
  ];
  if (dontShowLinkErrors.indexOf(error) > -1) {
    showHowToLink = false;
  }
  if (validationError) {
    messageText = (
      <>
        <div className="vads-u-margin-bottom--2">
          {t('were-sorry-we-couldnt-match-your-information-to-our-records')}
        </div>
        {mixedPhoneAndInPersonMessage}
      </>
    );
  }
  const UUIDErrors = ['session-error', 'bad-token', 'no-token'];
  messages.push({ text: messageText });
  if (appointments && appointments.length > 0) {
    apptType = appointments[0]?.kind ?? 'clinic';
    if (apptType !== 'clinic') {
      showHowToLink = false;
    }
    if (appointmentWasCanceled(appointments)) {
      // get first appointment that was cancelled?
      const canceledAppointment = getFirstCanceledAppointment(appointments);
      const appointmentDateTime = new Date(canceledAppointment.startTime);
      const cancelledMessage = (
        <div>
          <p className="vads-u-margin-top--0">
            {t('your-appointment-at-on-is-cancelled', {
              day: appointmentDateTime,
              time: appointmentDateTime,
            })}
          </p>
          <p className="vads-u-margin-top--2">
            {t('if-you-have-questions-please-call-us-were-here-24-7')}
          </p>
          {canceledAppointment?.kind === 'phone' ? (
            ''
          ) : (
            <p className="vads-u-margin-top--2 vads-u-margin-bottom--0">
              {t('or-talk-to-a-staff-member-if-youre-at-a-va-facility')}
            </p>
          )}
        </div>
      );

      header = t('sorry-pre-check-in-is-no-longer-available');
      messages = [{ text: cancelledMessage }];
      accordion = appointmentAccordion(appointments);
      showHowToLink = false;
    } else if (appointmentStartTimePast15(appointments)) {
      // don't show sub message if we are 15 minutes past appointment start time
      header = t('sorry-pre-check-in-is-no-longer-available');
      messages = [];
      accordion = appointmentAccordion(appointments);
      showHowToLink = false;
    } else if (preCheckinExpired(appointments)) {
      header = t('sorry-pre-check-in-is-no-longer-available');

      messages =
        apptType === 'phone'
          ? [
              {
                text: t(
                  'your-provider-will-call-you-at-your-appointment-time-you-may-need-to-wait-about-15-minutes-for-their-call-thanks-for-your-patience',
                ),
              },
            ]
          : [{ text: t('you-can-still-check-in-once-you-arrive') }];

      accordion = appointmentAccordion(appointments);
    } else if (appointments[0].startTime) {
      // If date exists, then show date.
      messages.push({
        text: t('you-can-pre-check-in-online-until-date', {
          date: subDays(new Date(appointments[0].startTime), 1),
        }),
        testId: 'date-message',
      });
    }
  } else if (UUIDErrors.indexOf(error) > -1) {
    messages = [
      {
        text: mixedPhoneAndInPersonMessage,
      },
    ];
  } else {
    header = t('sorry-we-cant-complete-pre-check-in');
  }
  const errorText = messages.length ? (
    <>
      {messages.map((message, index) => {
        return (
          <div key={index} data-testid={message.testId}>
            {message.text}
          </div>
        );
      })}
    </>
  ) : (
    ''
  );

  return (
    <Wrapper pageTitle={header}>
      {errorText && (
        <va-alert
          background-only
          show-icon
          status={validationError ? 'error' : 'info'}
          data-testid="error-message"
        >
          <div>{errorText}</div>
        </va-alert>
      )}
      {showHowToLink && <HowToLink apptType={apptType} />}
      {accordion && <div className="vads-u-margin-top--3">{accordion}</div>}
    </Wrapper>
  );
};

export default Error;

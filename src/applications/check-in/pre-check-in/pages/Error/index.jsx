import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { subDays } from 'date-fns';

import BackToHome from '../../../components/BackToHome';
import Footer from '../../../components/layout/Footer';
import PreCheckInAccordionBlock from '../../../components/PreCheckInAccordionBlock';
import HowToLink from '../../../components/HowToLink';

import { makeSelectVeteranData } from '../../../selectors';
import { makeSelectFeatureToggles } from '../../../utils/selectors/feature-toggles';

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
  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const { isPhoneAppointmentsEnabled } = useSelector(selectFeatureToggles);

  const { getValidateAttempts } = useSessionStorage(true);
  let { isMaxValidateAttempts } = getValidateAttempts(window);
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const error = urlParams.get('error');
  let apptType = 'clinic';
  if (error === 'validation') {
    isMaxValidateAttempts = true;
  }
  // Get appointment dates if available.
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { appointments } = useSelector(selectVeteranData);

  const { t } = useTranslation();

  const phoneAppointmentLoginFailedMessage = (
    <div>
      {t('were-sorry-we-couldnt-match-your-information-to-our-records')}
      <div className="vads-u-margin-top--2">
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

  // If date exists, then show date.
  let messageText = t(
    'were-sorry-something-went-wrong-on-our-end-please-try-again',
  );
  let showHowToLink = true;

  if (isMaxValidateAttempts) {
    messageText = isPhoneAppointmentsEnabled
      ? phoneAppointmentLoginFailedMessage
      : t(
          'were-sorry-we-couldnt-match-your-information-to-our-records-please-call-us-at-800-698-2411-tty-711-for-help-signing-in',
        );
    showHowToLink = false;
  }

  messages.push({ text: messageText });
  if (appointments && appointments.length > 0) {
    apptType = appointments[0]?.kind ?? 'clinic';
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
          {isPhoneAppointmentsEnabled &&
          canceledAppointment?.kind === 'phone' ? (
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
      messages.push({
        text: t('you-can-pre-check-in-online-until-date', {
          date: subDays(new Date(appointments[0].startTime), 1),
        }),
        testId: 'date-message',
      });
    }
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
          status={isMaxValidateAttempts ? 'error' : 'info'}
          data-testid="error-message"
        >
          <div>{errorText}</div>
        </va-alert>
      )}
      {showHowToLink && <HowToLink apptType={apptType} />}
      {accordion && <div className="vads-u-margin-top--3">{accordion}</div>}
      <Footer />
      <BackToHome />
    </Wrapper>
  );
};

export default Error;

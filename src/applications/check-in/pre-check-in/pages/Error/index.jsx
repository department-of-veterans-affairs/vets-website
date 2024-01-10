import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { subDays } from 'date-fns';

import { phoneNumbers } from '../../../utils/appConstants';
import PreCheckInAccordionBlock from '../../../components/PreCheckInAccordionBlock';
import HowToLink from '../../../components/HowToLink';

import { makeSelectVeteranData, makeSelectError } from '../../../selectors';

import Wrapper from '../../../components/layout/Wrapper';

import { getFirstCanceledAppointment } from '../../../utils/appointment';

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
  const selectError = useMemo(makeSelectError, []);
  const { error } = useSelector(selectError);

  // Get appointment dates if available.
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { appointments } = useSelector(selectVeteranData);

  const { t } = useTranslation();

  let header = '';

  let apptType = '';
  if (appointments && appointments.length > 0) {
    apptType = appointments[0]?.kind ?? 'clinic';
  }

  let accordion = null;
  let alertType = '';
  let messageText = '';
  let showHowToLink = false;

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
        {t('your-provider-will-call-you-at-your-appointment-time')}
      </div>
    </div>
  );

  switch (error) {
    case 'max-validation':
      alertType = 'error';
      header = t('sorry-we-cant-complete-pre-check-in');
      messageText = (
        <>
          <div className="vads-u-margin-bottom--2">
            {t('were-sorry-we-couldnt-match-your-information-to-our-records')}
          </div>
          {mixedPhoneAndInPersonMessage}
        </>
      );
      showHowToLink = false;
      break;
    case 'pre-check-in-post-error':
    case 'error-completing-pre-check-in':
      alertType = 'info';
      header = t('sorry-we-cant-complete-pre-check-in');
      messageText = (
        <>
          <div>
            {t('were-sorry-something-went-wrong-on-our-end-please-try-again')}
          </div>
          <div data-testid="date-message">
            {t('you-can-pre-check-in-online-until-date', {
              date: subDays(new Date(appointments[0].startTime), 1),
            })}
          </div>
        </>
      );
      showHowToLink = apptType === 'clinic';
      break;
    case 'appointment-canceled': {
      alertType = 'info';
      header = t('sorry-pre-check-in-is-no-longer-available');
      // get first appointment that was cancelled?
      const canceledAppointment = getFirstCanceledAppointment(appointments);
      const appointmentDateTime = new Date(canceledAppointment.startTime);
      messageText = (
        <div>
          <p className="vads-u-margin-top--0">
            {t('your-appointment-at-on-is-cancelled', {
              day: appointmentDateTime,
              time: appointmentDateTime,
            })}
          </p>
          <p className="vads-u-margin-top--2">
            <Trans
              i18nKey="if-you-have-questions-please-call-us-were-here-24-7"
              components={[
                <va-telephone
                  contact={phoneNumbers.mainInfo}
                  key={phoneNumbers.mainInfo}
                />,
                <va-telephone contact="711" tty key="711" />,
              ]}
            />
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
      showHowToLink = false;
      accordion = appointmentAccordion(appointments);
      break;
    }
    case 'pre-check-in-past-appointment':
      alertType = 'info';
      header = t('sorry-pre-check-in-is-no-longer-available');
      messageText = t('pre-check-in-no-longer-available--info-message');
      showHowToLink = false;
      accordion = appointmentAccordion(appointments);
      break;
    case 'pre-check-in-expired':
      alertType = 'info';
      header = t('sorry-pre-check-in-is-no-longer-available');
      messageText =
        apptType === 'clinic'
          ? t('you-can-still-check-in-once-you-arrive')
          : t('your-provider-will-call-you-at-your-appointment-time');
      accordion = appointmentAccordion(appointments);
      showHowToLink = true;
      break;
    case 'uuid-not-found':
      // Shown when POST sessions returns 404.
      alertType = 'info';
      header = t('this-link-has-expired');
      messageText = mixedPhoneAndInPersonMessage;
      showHowToLink = false;
      break;
    case 'session-error':
    case 'bad-token':
    case 'no-token':
    case 'reload-data-error':
    case 'possible-canceled-appointment':
      // This is considered our generic error message
      alertType = 'info';
      header = t('sorry-we-cant-complete-pre-check-in');
      messageText = mixedPhoneAndInPersonMessage;
      showHowToLink = false;
      break;
    default:
      // should never get here but if it does show the minimum
      alertType = 'error';
      header = t('sorry-we-cant-complete-pre-check-in');
      messageText = (
        <div>
          {t('were-sorry-something-went-wrong-on-our-end-please-try-again')}
        </div>
      );
      showHowToLink = false;
      break;
  }

  return (
    <Wrapper pageTitle={header}>
      <va-alert
        show-icon
        status={alertType}
        data-testid="error-message"
        uswds
        slim
      >
        <div>{messageText}</div>
      </va-alert>
      {showHowToLink && <HowToLink apptType={apptType} />}
      {accordion && <div className="vads-u-margin-top--3">{accordion}</div>}
    </Wrapper>
  );
};

export default Error;

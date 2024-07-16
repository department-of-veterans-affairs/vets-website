import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { subDays } from 'date-fns';

import { phoneNumbers } from '../../../utils/appConstants';
import PreCheckInAccordionBlock from '../../../components/PreCheckInAccordionBlock';
import HowToLink from '../../../components/HowToLink';
import ExternalLink from '../../../components/ExternalLink';

import { makeSelectVeteranData, makeSelectError } from '../../../selectors';

import Wrapper from '../../../components/layout/Wrapper';

import { getFirstCanceledAppointment } from '../../../utils/appointment';

const Error = () => {
  const selectError = useMemo(makeSelectError, []);
  const { error } = useSelector(selectError);

  // Get appointment dates if available.
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { appointments } = useSelector(selectVeteranData);

  const { t } = useTranslation();

  let header = '';

  let alertType = '';
  let messageText = '';

  const noLongerAvailableMessage = (
    <p
      data-testid="no-longer-available-message"
      className="vads-u-margin-top--0"
    >
      {t('pre-check-in-no-longer-available')}
    </p>
  );
  const somethingWentWrongMesage = (
    <div data-testid="something-went-wrong-message">
      <p className="vads-u-margin-top--0">{t('something-went-wrong')}</p>
      <p>
        <ExternalLink
          href="https://www.va.gov/find-locations"
          hrefLang="en"
          eventId="find-facility-locations--link-clicked"
          eventPrefix="nav"
        >
          {t('find-your-va-health-facility')}
        </ExternalLink>
      </p>
    </div>
  );
  const chevRight = (
    <va-icon
      icon="navigate_next"
      size={3}
      className="vads-u-margin-left--neg0p5"
    />
  );
  const mixedModalityMessage = (
    <div data-testid="mixed-modality-message">
      <div>
        {chevRight}
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
        {chevRight}
        <span className="appointment-type-label vads-u-margin-left--0p5 vads-u-font-weight--bold">
          {t('video-appointment--title')}
        </span>
      </div>
      <div className="vads-u-margin-top--2">{t('video-error-help-text')}</div>
      <div className="vads-u-margin-top--2">
        <ExternalLink
          href="https://www.va.gov/health-care/schedule-view-va-appointments/"
          hrefLang="en"
          eventId="sign-in-to-find--link-clicked"
          eventPrefix="nav"
        >
          {t('sign-in-to-find-appointment')}
        </ExternalLink>
      </div>
      <div className="vads-u-margin-top--2">
        {chevRight}
        <span className="appointment-type-label vads-u-margin-left--0p5 vads-u-font-weight--bold">
          {t('phone-appointment')}
        </span>
      </div>
      <div className="vads-u-margin-top--2">{t('phone-error-help-text')}</div>
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
          {mixedModalityMessage}
        </>
      );
      break;
    case 'pre-check-in-post-error':
    case 'error-completing-pre-check-in':
      alertType = 'error';
      header = t('sorry-we-cant-complete-pre-check-in');
      messageText = (
        <>
          <p className="vads-u-margin-top--0">
            {t('something-went-wrong-please-try-again')}
          </p>
          <p data-testid="date-message">
            {t('you-can-pre-check-in-online-until-date', {
              date: subDays(new Date(appointments[0].startTime), 1),
            })}
          </p>
        </>
      );
      break;
    case 'appointment-canceled': {
      alertType = 'warning';
      header = t('sorry-pre-check-in-is-no-longer-available');
      // get first appointment that was canceled?
      const canceledAppointment = getFirstCanceledAppointment(appointments);
      const appointmentDateTime = new Date(canceledAppointment.startTime);
      messageText = (
        <div>
          <p className="vads-u-margin-top--0">
            {t('your-appointment-at-on-is-canceled', {
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
      break;
    }
    case 'pre-check-in-expired':
    case 'pre-check-in-past-appointment':
      alertType = 'warning';
      header = t('sorry-pre-check-in-is-no-longer-available');
      messageText = (
        <>
          {noLongerAvailableMessage}
          {mixedModalityMessage}
        </>
      );
      break;
    case 'uuid-not-found':
      // Shown when POST sessions returns 404.
      alertType = 'warning';
      header = t('sorry-pre-check-in-is-no-longer-available');
      messageText = (
        <>
          {somethingWentWrongMesage}
          {mixedModalityMessage}
        </>
      );
      break;
    case 'reload-data-error':
      alertType = 'error';
      header = t('sorry-we-cant-complete-pre-check-in');
      messageText = (
        <>
          <p className="vads-u-margin-top--0">
            {t('something-went-wrong-please-try-again')}
          </p>
          <p>{t('if-you-have-questions-call')}</p>
          <p>
            <ExternalLink
              href="https://www.va.gov/find-locations"
              hrefLang="en"
              eventId="find-facility-locations--link-clicked"
              eventPrefix="nav"
            >
              {t('find-your-va-health-facility')}
            </ExternalLink>
          </p>
        </>
      );
      break;
    default:
      // This is considered our generic error message
      alertType = 'error';
      header = t('sorry-we-cant-complete-pre-check-in');
      messageText = (
        <>
          {somethingWentWrongMesage}
          {mixedModalityMessage}
        </>
      );
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
      <HowToLink />
      <div className="vads-u-margin-top--3">
        <PreCheckInAccordionBlock
          key="accordion"
          errorPage
          appointments={appointments}
        />
      </div>
    </Wrapper>
  );
};

export default Error;

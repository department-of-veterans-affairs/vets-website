import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { subDays } from 'date-fns';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

import { phoneNumbers } from '../../../utils/appConstants';
import HowToLink from '../../../components/HowToLink';
import ExternalLink from '../../../components/ExternalLink';
import ConfirmationAccordionBlock from '../../../components/ConfirmationAccordionBlock';
import { makeSelectVeteranData, makeSelectError } from '../../../selectors';

import Wrapper from '../../../components/layout/Wrapper';

import { getFirstCanceledAppointment } from '../../../utils/appointment';

const Error = () => {
  const selectError = useMemo(makeSelectError, []);
  const { error } = useSelector(selectError);
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  // appt link will be /my-health/appointments if toggle is on
  const apptLink = useToggleValue(
    TOGGLE_NAMES.vaOnlineSchedulingBreadcrumbUrlUpdate,
  )
    ? 'https://va.gov/my-health/appointments/'
    : 'https://va.gov/health-care/schedule-view-va-appointments/appointments/';
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
      {t('the-link-selected-has-expired')}
    </p>
  );
  const somethingWentWrongMesage = (
    <div data-testid="something-went-wrong-message">
      <p className="vads-u-margin-top--0">
        {t('were-sorry-something-went-wrong-on-our-end')}
      </p>
    </div>
  );
  const mixedModalityMessage = (
    <div data-testid="mixed-modality-message">
      <div>
        <span className="appointment-type-label vads-u-font-weight--bold">
          {t('in-person-appointment')}
        </span>
      </div>
      <div className="vads-u-margin-top--2">
        {t(
          'you-can-still-check-in-with-your-phone-on-the-day-of-your-appointment',
        )}
      </div>
      <div className="vads-u-margin-top--2">
        <span className="appointment-type-label vads-u-font-weight--bold">
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
        <span className="appointment-type-label vads-u-font-weight--bold">
          {t('phone-appointment')}
        </span>
      </div>
      <div className="vads-u-margin-top--2">{t('phone-error-help-text')}</div>
    </div>
  );

  switch (error) {
    case 'max-validation':
      alertType = 'error';
      header = t('we-cant-match-your-information');
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
      header = t('something-went-wrong-on-our-end');
      messageText = (
        <>
          <p className="vads-u-margin-top--0">
            {t('something-went-wrong-please-try-again')}
          </p>
          <p data-testid="date-message">
            {t('you-can-review-online-until-date', {
              date: subDays(new Date(appointments[0].startTime), 1),
            })}
          </p>
        </>
      );
      break;
    case 'appointment-canceled': {
      alertType = 'error';
      header = t('canceled-in-person-appointment');
      // get first appointment that was canceled?
      const canceledAppointment = getFirstCanceledAppointment(appointments);
      const openingText =
        canceledAppointment.status === 'CANCELLED BY PATIENT'
          ? t('you-canceled')
          : t('facility-canceled');
      messageText = (
        <div data-testid="canceled-message">
          <p className="vads-u-margin-top--0">
            <span className="vads-u-font-weight--bold">{openingText} </span>
            <Trans
              i18nKey="if-you-want-to-reschedule"
              components={[
                <va-telephone
                  contact={phoneNumbers.mainInfo}
                  key={phoneNumbers.mainInfo}
                />,
                <va-telephone contact="711" tty key="711" />,
              ]}
            />
          </p>
          <p>
            <ExternalLink
              href={apptLink}
              hrefLang="en"
              target="_blank"
              rel="noreferrer"
            >
              {t('sign-in-to-schedule')}
            </ExternalLink>
          </p>
          <p className="vads-u-margin-top--2 vads-u-margin-bottom--0">
            {t('or-talk-to-a-staff-member-if-youre-at-a-va-facility')}
          </p>
        </div>
      );
      break;
    }
    case 'pre-check-in-expired':
    case 'uuid-not-found':
      alertType = 'warning';
      header = t('you-cant-review-information-right-now');
      messageText = <>{noLongerAvailableMessage}</>;
      break;
    default:
      // This is considered our generic error message
      alertType = 'error';
      header = t('something-went-wrong-on-our-end');
      messageText = <>{somethingWentWrongMesage}</>;
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
        <div data-testid={error}>{messageText}</div>
      </va-alert>
      {error !== 'max-validation' && (
        <>
          <HowToLink />
          <p className="vads-u-margin-bottom--4">
            <ExternalLink href={apptLink} hrefLang="en">
              {t('sign-in-to-manage')}
            </ExternalLink>
          </p>
          <div className="vads-u-margin-top--3">
            <ConfirmationAccordionBlock errorPage appointments={appointments} />
          </div>
        </>
      )}
    </Wrapper>
  );
};

export default Error;

import React, { useMemo, useState, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';
import isValid from 'date-fns/isValid';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-unresolved
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';

import { createAnalyticsSlug } from '../../../utils/analytics';
import { useFormRouting } from '../../../hooks/useFormRouting';
import { setForm } from '../../../actions/universal';
import { makeSelectVeteranData, makeSelectApp } from '../../../selectors';
import { makeSelectFeatureToggles } from '../../../utils/selectors/feature-toggles';

import {
  appointmentIcon,
  clinicName,
  findAppointment,
  findUpcomingAppointment,
  getAppointmentId,
} from '../../../utils/appointment';
import { useStorage } from '../../../hooks/useStorage';
import { ELIGIBILITY } from '../../../utils/appointment/eligibility';
import { APP_NAMES, phoneNumbers } from '../../../utils/appConstants';

import Wrapper from '../../layout/Wrapper';
import BackButton from '../../BackButton';
import ActionLink from '../../ActionLink';
import AppointmentMessage from '../../AppointmentDisplay/AppointmentMessage';
import AddressBlock from '../../AddressBlock';
import ExternalLink from '../../ExternalLink';
import PrepareContent from '../../PrepareContent';

const AppointmentDetails = props => {
  const { router } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    goToPreviousPage,
    jumpToPage,
    getCurrentPageFromRouter,
  } = useFormRouting(router);
  const page = getCurrentPageFromRouter();
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { appointments, upcomingAppointments } = useSelector(selectVeteranData);
  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);
  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const { isMedicationReviewContentEnabled } = useSelector(
    selectFeatureToggles,
  );
  const [appointment, setAppointment] = useState({});
  const [isUpcoming, setIsUpcoming] = useState(false);
  const appointmentDay = new Date(appointment?.startTime);
  const isPhoneAppointment = appointment?.kind === 'phone';
  const isCvtAppointment = appointment?.kind === 'cvt';
  const isVvcAppointment = appointment?.kind === 'vvc';
  const isInPersonAppointment = appointment?.kind === 'clinic';
  const { appointmentId } = router.params;
  const { getPreCheckinComplete } = useStorage(app);

  useLayoutEffect(
    () => {
      if (appointmentId) {
        // TODO: It's not going to find upcoming appoinments in the list of vista appointments until we can figure out which data to use to link the two.
        const activeAppointmentDetails = findAppointment(
          appointmentId,
          appointments,
        );
        if (activeAppointmentDetails) {
          setAppointment(activeAppointmentDetails);
          return;
        }
        const activeUpcomingAppointmentDetails = findUpcomingAppointment(
          appointmentId,
          upcomingAppointments,
        );
        if (activeUpcomingAppointmentDetails) {
          setIsUpcoming(true);
          setAppointment(activeUpcomingAppointmentDetails);
          return;
        }
      }
      // Go back to appointments page if no activeAppointment or not in list.
      jumpToPage('appointments');
    },
    [appointmentId, appointments, upcomingAppointments, jumpToPage],
  );

  const handlePhoneNumberClick = () => {
    recordEvent({
      event: createAnalyticsSlug('details-phone-link-clicked', 'nav', app),
    });
  };

  const action = e => {
    e.preventDefault();
    if (app === APP_NAMES.CHECK_IN) {
      dispatch(
        setForm({
          data: {
            activeAppointmentId: appointmentId,
          },
        }),
      );
      jumpToPage('arrived');
    }
    if (app === APP_NAMES.PRE_CHECK_IN) {
      jumpToPage('contact-information');
    }
  };

  const clinic = appointment && clinicName(appointment);

  let preCheckInSubTitle = (
    <>
      {isMedicationReviewContentEnabled && (
        <h2 className="vads-u-font-size--sm">{t('how-to-check-in')}</h2>
      )}
      <p
        data-testid="in-person-appointment-subtitle"
        className="vads-u-margin--0"
      >
        {isMedicationReviewContentEnabled
          ? t('on-day-of-appointment-we-send-text')
          : t('remember-to-bring-your-insurance-cards-with-you')}
      </p>
    </>
  );
  if (isPhoneAppointment) {
    preCheckInSubTitle = (
      <p data-testid="phone-appointment-subtitle" className="vads-u-margin--0">
        {t('your-provider-will-call-you-at-your-appointment-time')}
      </p>
    );
  }
  if (isCvtAppointment) {
    preCheckInSubTitle = (
      <p data-testid="cvt-appointment-subtitle" className="vads-u-margin--0">
        {t('go-to-facility-for-this-video-appointment', {
          facility: appointment.facility,
        })}
      </p>
    );
  }
  if (isVvcAppointment) {
    preCheckInSubTitle = (
      <p data-testid="vvc-appointment-subtitle" className="vads-u-margin--0">
        {t('you-can-join-your-appointment-by-using-our-appointments-tool')}
      </p>
    );
  }
  const isCanceled = isUpcoming && appointment.status.includes('CANCELLED');
  const appointmentTitle = () => {
    let title = '';
    switch (appointment?.kind) {
      case 'phone':
        title = `${t('phone')} ${t('appointment')}`;
        break;
      case 'cvt':
        title = t('video-appointment-at-facility', {
          facility: appointment.facility,
        });
        break;
      case 'vvc':
        title = t('video-appointment--title');
        break;
      default:
        title = t('in-person-appointment');
        break;
    }
    if (isCanceled) {
      return `${t('canceled')} ${t('#-util-uncapitalize', { value: title })}`;
    }
    return title;
  };
  let eligibleAppointment = true;
  if (app === APP_NAMES.CHECK_IN) {
    eligibleAppointment = appointment.eligibility === ELIGIBILITY.ELIGIBLE;
  }
  let link = '';
  if (!isUpcoming && eligibleAppointment) {
    link = (
      <div className="vads-u-margin-top--2">
        <ActionLink
          app={app}
          action={action}
          appointmentId={getAppointmentId(appointment)}
        />
      </div>
    );
  }
  return (
    <>
      {Object.keys(appointment).length && (
        <>
          <BackButton
            router={router}
            action={goToPreviousPage}
            prevUrl="#back"
            text={t('back-to-last-screen')}
          />
          <Wrapper classNames="appointment-details-page" withBackButton>
            <div className="appointment-details--container vads-u-margin-top--2 vads-u-border--2px vads-u-border-color--gray vads-u-padding-x--2 vads-u-padding-top--4 vads-u-padding-bottom--2">
              <div className="appointment-details--icon">
                {appointmentIcon(appointment)}
              </div>
              <h1
                tabIndex="-1"
                data-testid="header"
                className="vads-u-font-size--h3"
              >
                {appointmentTitle()}
              </h1>
              {!isUpcoming && (
                <>
                  {app === APP_NAMES.PRE_CHECK_IN &&
                    getPreCheckinComplete(window)?.complete &&
                    preCheckInSubTitle}
                  {app === APP_NAMES.CHECK_IN && (
                    <div className="vads-u-margin-x--neg2 vads-u-margin-top--2">
                      <AppointmentMessage
                        appointment={appointment}
                        page={page}
                      />
                    </div>
                  )}
                </>
              )}
              {isCanceled && (
                <va-alert
                  uswds
                  slim
                  status="error"
                  show-icon
                  data-testid="canceled-message"
                  class="vads-u-margin-top--2"
                >
                  <div>
                    <p className="vads-u-margin-top--0">
                      {appointment.status === 'CANCELLED BY PATIENT' && (
                        <span
                          className="vads-u-font-weight--bold"
                          data-testid="canceled-by-patient"
                        >
                          {`${t('you-canceled')} `}
                        </span>
                      )}
                      {appointment.status === 'CANCELLED BY CLINIC' && (
                        <span
                          className="vads-u-font-weight--bold"
                          data-testid="canceled-by-faciity"
                        >
                          {`${t('facility-canceled')} `}
                        </span>
                      )}
                      <Trans
                        i18nKey="if-you-want-to-reschedule"
                        components={[
                          <va-telephone
                            key={phoneNumbers.mainInfo}
                            contact={phoneNumbers.mainInfo}
                          />,
                          <va-telephone
                            key={phoneNumbers.tty}
                            contact={phoneNumbers.tty}
                            tty
                            ariaLabel="7 1 1."
                          />,
                        ]}
                      />
                    </p>
                    <p>
                      <ExternalLink
                        href="https://www.va.gov/health-care/schedule-view-va-appointments/"
                        hrefLang="en"
                      >
                        {t('sign-in-to-schedule')}
                      </ExternalLink>
                    </p>
                    <p>{t('or-talk-staff-if-at-facility')}</p>
                  </div>
                </va-alert>
              )}
              {app === APP_NAMES.PRE_CHECK_IN &&
                !getPreCheckinComplete(window)?.complete && (
                  <>
                    <h2 className="vads-u-font-size--sm">
                      {t('review-contact-information')}
                    </h2>
                    {link}
                  </>
                )}
              <div data-testid="appointment-details--when">
                <h2 className="vads-u-font-size--sm">{t('when')}</h2>
                <div data-testid="appointment-details--date-value">
                  {isValid(appointmentDay) &&
                    t('appointment-day', { date: appointmentDay })}
                </div>
              </div>
              {appointment.doctorName && (
                <div data-testid="appointment-details--provider">
                  <h2 className="vads-u-font-size--sm">{t('who')}</h2>
                  <div data-testid="appointment-details--provider-value">
                    {appointment.doctorName}
                  </div>
                </div>
              )}

              {(isInPersonAppointment || isCvtAppointment) && (
                <div data-testid="appointment-details--where">
                  <h2 className="vads-u-font-size--sm">
                    {t('where-to-attend')}
                  </h2>
                  <div data-testid="appointment-details--facility-value">
                    {appointment.facility}
                    {appointment.facilityAddress?.street1 && (
                      <div className="vads-u-margin-bottom--2">
                        <AddressBlock
                          address={appointment.facilityAddress}
                          placeName={appointment.facility}
                          showDirections
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
              {(isPhoneAppointment || isVvcAppointment) && (
                <div data-testid="appointment-details--need-to-make-changes">
                  <h2 className="vads-u-font-size--sm">
                    {t('need-to-make-changes')}
                  </h2>
                  <p className="vads-u-margin-top--0">
                    {t('contact-this-facility')}
                  </p>
                </div>
              )}

              {(isPhoneAppointment || isVvcAppointment) && (
                <div data-testid="appointment-details--facility-info">
                  {appointment.facility && (
                    <div data-testid="appointment-details--facility-value">
                      {appointment.facility}
                    </div>
                  )}
                  {appointment.facilityAddress?.city &&
                    appointment.facilityAddress?.state && (
                      <div data-testid="appointment-details--facility-address">
                        {`${appointment.facilityAddress.city}, ${
                          appointment.facilityAddress.state
                        }`}
                      </div>
                    )}
                </div>
              )}
              <div className="vads-u-margin-top--2">
                {clinic && (
                  <div data-testid="appointment-details--clinic-value">
                    {`${t('clinic')}:`} {clinic}
                  </div>
                )}
                {(isInPersonAppointment || isCvtAppointment) &&
                  appointment.clinicLocation && (
                    <div data-testid="appointment-details--location-value">
                      {`${t('location')}: ${appointment.clinicLocation}`}
                    </div>
                  )}
                {appointment.clinicPhoneNumber && (
                  <div data-testid="appointment-details--phone">
                    <div data-testid="appointment-details--phone-value">
                      {`${t('clinic-phone')}: `}
                      <va-telephone
                        onClick={handlePhoneNumberClick}
                        contact={appointment.clinicPhoneNumber}
                      />
                      <br />(
                      <va-telephone
                        contact={phoneNumbers.tty}
                        tty
                        ariaLabel="7 1 1."
                      />
                      )
                    </div>
                  </div>
                )}
              </div>
              {app === APP_NAMES.CHECK_IN && link}
              {app === APP_NAMES.PRE_CHECK_IN && (
                <PrepareContent
                  router={router}
                  smallHeading
                  appointmentCount={1}
                />
              )}
            </div>
          </Wrapper>
        </>
      )}
    </>
  );
};

AppointmentDetails.propTypes = {
  router: PropTypes.object,
};

export default AppointmentDetails;

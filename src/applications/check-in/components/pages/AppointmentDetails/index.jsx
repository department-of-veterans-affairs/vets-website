import React, { useMemo, useState, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import isValid from 'date-fns/isValid';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-unresolved
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';

import { createAnalyticsSlug } from '../../../utils/analytics';
import { useFormRouting } from '../../../hooks/useFormRouting';
import { useStorage } from '../../../hooks/useStorage';
import { makeSelectVeteranData, makeSelectApp } from '../../../selectors';

import {
  appointmentIcon,
  clinicName,
  findAppointment,
  findUpcomingAppointment,
} from '../../../utils/appointment';
import { APP_NAMES, phoneNumbers } from '../../../utils/appConstants';

import Wrapper from '../../layout/Wrapper';
import BackButton from '../../BackButton';
import AppointmentAction from '../../AppointmentDisplay/AppointmentAction';
import AppointmentMessage from '../../AppointmentDisplay/AppointmentMessage';
import AddressBlock from '../../AddressBlock';

import { makeSelectFeatureToggles } from '../../../utils/selectors/feature-toggles';

const AppointmentDetails = props => {
  const { router } = props;
  const { t } = useTranslation();
  const { goToPreviousPage, jumpToPage } = useFormRouting(router);
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { appointments, upcomingAppointments } = useSelector(selectVeteranData);
  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);
  const [appointment, setAppointment] = useState({});
  const [isUpcoming, setIsUpcoming] = useState(false);

  const appointmentDay = new Date(appointment?.startTime);
  const isPhoneAppointment = appointment?.kind === 'phone';
  const isCvtAppointment = appointment?.kind === 'cvt';
  const isVvcAppointment = appointment?.kind === 'vvc';
  const isInPersonAppointment = appointment?.kind === 'clinic';
  const { appointmentId } = router.params;
  const isPreCheckIn = app === 'preCheckIn';
  const { getPreCheckinComplete } = useStorage(isPreCheckIn);

  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const { is45MinuteReminderEnabled } = useSelector(selectFeatureToggles);

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

  const handleReviewClick = () => {
    recordEvent({
      event: createAnalyticsSlug(
        'details-review-information-button-clicked',
        'nav',
        app,
      ),
    });
    jumpToPage('contact-information');
  };

  const clinic = appointment && clinicName(appointment);

  let preCheckInSubTitle = (
    <p
      data-testid="in-person-appointment-subtitle"
      className="vads-u-margin--0"
    >
      {t('please-bring-your-insurance-cards-with-you-to-your-appointment')}
    </p>
  );
  if (is45MinuteReminderEnabled) {
    preCheckInSubTitle = (
      <p
        data-testid="in-person-appointment-subtitle"
        className="vads-u-margin--0"
      >
        {t('remember-to-bring-your-insurance-cards-with-you')}
      </p>
    );
  }
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

  const appointmentTitle = () => {
    switch (appointment?.kind) {
      case 'phone':
        return `${t('phone')} ${t('appointment')}`;
      case 'cvt':
        return t('video-appointment-at-facility', {
          facility: appointment.facility,
        });
      case 'vvc':
        return t('video-appointment--title');
      default:
        return t('in-person-appointment');
    }
  };

  const showReviewButton =
    isPreCheckIn && !isUpcoming && !getPreCheckinComplete(window)?.complete;

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
                  {app === APP_NAMES.PRE_CHECK_IN ? (
                    preCheckInSubTitle
                  ) : (
                    <div className="vads-u-margin-x--neg2 vads-u-margin-top--2">
                      <AppointmentMessage appointment={appointment} />
                    </div>
                  )}
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
                  <h2 className="vads-u-font-size--sm">{t('provider')}</h2>
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
                    <h2 className="vads-u-font-size--sm">{t('phone')}</h2>
                    <div data-testid="appointment-details--phone-value">
                      <i
                        aria-label="phone"
                        className="fas fa-phone vads-u-color--link-default vads-u-margin-right--1"
                        aria-hidden="true"
                      />
                      <va-telephone
                        onClick={handlePhoneNumberClick}
                        contact={appointment.clinicPhoneNumber}
                      />
                    </div>
                  </div>
                )}
              </div>
              {app === APP_NAMES.CHECK_IN &&
                !isUpcoming && (
                  <div className="vads-u-margin-top--2">
                    <AppointmentAction
                      appointment={appointment}
                      router={router}
                      event="check-in-clicked-VAOS-design"
                    />
                  </div>
                )}
              {showReviewButton && (
                <div className="vads-u-margin-top--2">
                  <va-button
                    uswds
                    big
                    onClick={handleReviewClick}
                    text={t('review-your-information-now')}
                    data-testid="review-information-button"
                    value="yes"
                  />
                </div>
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

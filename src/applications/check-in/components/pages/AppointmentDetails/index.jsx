import React, { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import isValid from 'date-fns/isValid';
import PropTypes from 'prop-types';

import { useFormRouting } from '../../../hooks/useFormRouting';
import {
  makeSelectActiveAppointment,
  makeSelectVeteranData,
} from '../../../selectors';

import Wrapper from '../../layout/Wrapper';
import BackButton from '../../BackButton';

const AppointmentDetails = props => {
  const { router } = props;
  const { t } = useTranslation();
  const { goToPreviousPage, jumpToPage } = useFormRouting(router);
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const selectActiveAppointment = useMemo(makeSelectActiveAppointment, []);
  const { appointments } = useSelector(selectVeteranData);
  const { activeAppointment } = useSelector(selectActiveAppointment);
  const [appointment, setAppointment] = useState([]);

  const appointmentDay = new Date(appointment.startTime);
  const isPhoneAppointment = appointment?.kind === 'phone';

  useEffect(
    () => {
      if (activeAppointment) {
        setAppointment(
          appointments.find(
            appointmentItem =>
              appointmentItem.appointmentIen === activeAppointment,
          ),
        );
      } else {
        jumpToPage('complete');
      }
    },
    [activeAppointment, appointments, jumpToPage],
  );

  const clinic = appointment.clinicFriendlyName
    ? appointment.clinicFriendlyName
    : appointment.clinicName;
  return (
    <>
      <BackButton
        router={router}
        action={goToPreviousPage}
        text={t('back-to-appointments')}
      />
      <Wrapper classNames="appointment-details-page" withBackButton>
        <div className="appointment-details--container vads-u-margin-top--2 vads-u-border--2px vads-u-border-color--gray-lighter vads-u-padding-x--2 vads-u-padding-top--4 vads-u-padding-bottom--2">
          <div className="appointment-details--icon">
            <i
              aria-label="Appointment type"
              className={`fas ${
                appointment?.kind === 'phone' ? 'fa-phone' : 'fa-building'
              }`}
              aria-hidden="true"
            />
          </div>
          <h1
            tabIndex="-1"
            data-testid="header"
            className="vads-u-font-size--h3"
          >
            {`${isPhoneAppointment ? t('phone') : t('in-person')} ${t(
              'appointment',
            )}`}
          </h1>
          <p className="vads-u-margin--0">
            {isPhoneAppointment
              ? t('your-provider-will-call-you-at-your-appointment-time')
              : t(
                  'please-bring-your-insurance-cards-with-you-to-your-appointment',
                )}
          </p>
          <div data-testid="appointment-details--when">
            <h2 className="vads-u-font-size--sm">{t('when')}</h2>
            <div data-testid="appointment-details--date-value">
              {isValid(appointmentDay) &&
                t('appointment-day', { date: appointmentDay })}
            </div>
          </div>
          <div data-testid="appointment-details--what">
            <h2 className="vads-u-font-size--sm">{t('what')}</h2>
            <div data-testid="appointment-details--appointment-value">
              {appointment.clinicStopCodeName ?? t('VA-appointment')}
            </div>
          </div>
          {appointment.doctorName && (
            <div data-testid="appointment-details--provider">
              <h2 className="vads-u-font-size--sm">{t('Provider')}</h2>
              <div data-testid="appointment-details--provider-value">
                {appointment.doctorName}
              </div>
            </div>
          )}
          <div data-testid="appointment-details--where">
            <h2 className="vads-u-font-size--sm">
              {isPhoneAppointment ? t('clinic') : t('where-to-attend')}
            </h2>
            {/* TODO add address for in person appointments */}
            <div data-testid="appointment-details--clinic-value">
              {isPhoneAppointment ? '' : t('clinic')}: {clinic}
            </div>
            {isPhoneAppointment ? (
              ''
            ) : (
              <div data-testid="appointment-details--location-value">
                {`${t('location')}: ${appointment.clinicLocation}`}
              </div>
            )}
          </div>
          {appointment.clinicPhoneNumber && (
            <div data-testid="appointment-details--phone">
              <h2 className="vads-u-font-size--sm">{t('phone')}</h2>
              <div data-testid="appointment-details--phone-value">
                <i
                  aria-label="phone"
                  className="fas fa-phone vads-u-color--link-default vads-u-margin-right--1"
                  aria-hidden="true"
                />
                <va-telephone contact={appointment.clinicPhoneNumber}>
                  {appointment.clinicPhoneNumber}
                </va-telephone>
              </div>
            </div>
          )}
          {appointment.reasonForVisit && (
            <div data-testid="appointment-details--reason">
              <h2 className="vads-u-font-size--sm">{t('reason-for-visit')}</h2>
              <div data-testid="appointment-details--reason-value">
                {appointment.reasonForVisit}
              </div>
            </div>
          )}
        </div>
      </Wrapper>
    </>
  );
};

AppointmentDetails.propTypes = {
  router: PropTypes.object,
};

export default AppointmentDetails;

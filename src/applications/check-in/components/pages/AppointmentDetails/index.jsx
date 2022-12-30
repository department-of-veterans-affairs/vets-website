import React, { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import isValid from 'date-fns/isValid';

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
  return (
    <>
      <BackButton
        router={router}
        action={goToPreviousPage}
        text={t('back-to-appointments')}
      />
      <Wrapper classNames="appointment-details-page" withBackButton>
        <div
          className="vads-u-border--2px vads-u-border-color--gray-lighter vads-u-padding-x--2 vads-u-padding-top--4 vads-u-padding-bottom--2"
          style={{ borderRadius: '20px' }}
        >
          <h1
            tabIndex="-1"
            data-testid="header"
            className="vads-u-font-size--h3"
          >
            {`${isPhoneAppointment ? t('phone') : t('in-person')} ${t(
              'appointment',
            )}`}
          </h1>
          <p>
            {isPhoneAppointment
              ? t('your-provider-will-call-you-at-your-appointment-time')
              : t(
                  'please-bring-your-insurance-cards-with-you-to-your-appointment',
                )}
          </p>
          <div className="appointment-details--when">
            <h2 className="vads-u-font-size--sm">{t('when')}</h2>
            {isValid(appointmentDay) &&
              t('appointment-day', { date: appointmentDay })}
          </div>
          <div className="appointment-details--what">
            <h2 className="vads-u-font-size--sm">{t('what')}</h2>
            {appointment.clinicStopCodeName ?? t('VA-appointment')}
          </div>
          {appointment.doctorName && (
            <div className="appointment-details--provider">
              <h2 className="vads-u-font-size--sm">{t('Provider')}</h2>
              {appointment.doctorName}
            </div>
          )}
          <div className="appointment-details--where">
            <h2 className="vads-u-font-size--sm">
              {isPhoneAppointment ? t('clinic') : t('where-to-attend')}
            </h2>
          </div>
          {appointment.clinicPhoneNumber && (
            <div className="appointment-details--phone">
              <h2 className="vads-u-font-size--sm">{t('phone')}</h2>
              <va-telephone contact={appointment.clinicPhoneNumber}>
                {appointment.clinicPhoneNumber}
              </va-telephone>
            </div>
          )}
          {appointment.reasonForVisit && (
            <div className="appointment-details--reason">
              <h2 className="vads-u-font-size--sm">{t('reason-for-visit')}</h2>
              {appointment.reasonForVisit}
            </div>
          )}
        </div>
      </Wrapper>
    </>
  );
};

export default AppointmentDetails;

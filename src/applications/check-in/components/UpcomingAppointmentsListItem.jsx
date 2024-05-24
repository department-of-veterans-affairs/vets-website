import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import {
  appointmentIcon,
  clinicName,
  getAppointmentId,
} from '../utils/appointment';
import DeleteChildren from './DeleteChildren';

const UpcomingAppointmentsListItem = props => {
  const { appointment, goToDetails, router, border } = props;
  const { t } = useTranslation();
  const appointmentDateTime = new Date(appointment.startTime);
  const clinic = clinicName(appointment);
  const isCanceled = appointment.status?.includes('CANCELLED');

  const appointmentInfo = () => {
    if (appointment?.kind === 'vvc') {
      return (
        <div data-testid="appointment-info-vvc">
          <DeleteChildren isDeleted={isCanceled}>{t('video')}</DeleteChildren>
        </div>
      );
    }
    if (appointment?.kind === 'cvt') {
      return (
        <div data-testid="appointment-info-cvt">
          <DeleteChildren isDeleted={isCanceled}>
            {`${t('video-at')} ${appointment.facility}`}
            <br />
            {`${t('clinic')}: ${clinic}`}
          </DeleteChildren>
        </div>
      );
    }
    if (appointment?.kind === 'phone') {
      return (
        <div data-testid="appointment-info-phone">
          <DeleteChildren isDeleted={isCanceled}>{t('phone')}</DeleteChildren>
        </div>
      );
    }
    return (
      <div data-testid="appointment-info-clinic">
        <DeleteChildren isDeleted={isCanceled}>
          {`${t('in-person-at')} ${appointment.facility}`} <br />
          {`${t('clinic')}: ${clinic}`}
        </DeleteChildren>
      </div>
    );
  };

  return (
    <li
      className={`check-in--appointment-item ${border &&
        'vads-u-border-bottom--1px vads-u-border-color--gray-light'}`}
      data-testid="appointment-list-item"
    >
      <div
        className="vads-u-margin-top--1p5 vads-u-margin-bottom--1"
        data-testid="appointment-time"
      >
        <DeleteChildren isDeleted={isCanceled}>
          {t('date-time', { date: appointmentDateTime })}
        </DeleteChildren>
      </div>
      <div
        data-testid="appointment-type-and-provider"
        className="vads-u-font-weight--bold vads-u-margin-bottom--1"
      >
        <DeleteChildren isDeleted={isCanceled}>
          {appointment.clinicStopCodeName
            ? appointment.clinicStopCodeName
            : t('VA-appointment')}
          {appointment.doctorName
            ? ` ${t('with')} ${appointment.doctorName}`
            : ''}
        </DeleteChildren>
      </div>
      <div className="vads-u-display--flex">
        <div
          data-testid="appointment-kind-icon"
          className="vads-u-margin-right--0p5 check-in--label"
        >
          {appointmentIcon(appointment)}
        </div>
        <div
          data-testid="appointment-kind-and-location"
          className="vads-u-display--inline"
        >
          <DeleteChildren isDeleted={isCanceled}>
            {appointmentInfo()}
          </DeleteChildren>
        </div>
      </div>
      <div className="vads-u-margin-top--1p5 vads-u-margin-bottom--2">
        <a
          data-testid="details-link"
          href={`${
            router.location.basename
          }/appointment-details/${getAppointmentId(appointment)}`}
          onClick={e => goToDetails(e, appointment)}
          aria-label={t('details-for-appointment-on-date-at-time', {
            dateTime: appointmentDateTime,
            type: appointment.clinicStopCodeName
              ? appointment.clinicStopCodeName
              : 'VA',
          })}
        >
          {t('details')}
        </a>
      </div>
    </li>
  );
};

UpcomingAppointmentsListItem.propTypes = {
  appointment: PropTypes.object.isRequired,
  border: PropTypes.bool.isRequired,
  goToDetails: PropTypes.func,
  router: PropTypes.object,
};

export default UpcomingAppointmentsListItem;

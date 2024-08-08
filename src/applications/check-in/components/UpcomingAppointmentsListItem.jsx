import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import {
  appointmentIcon,
  clinicName,
  getAppointmentId,
} from '../utils/appointment';
import { APP_NAMES } from '../utils/appConstants';
import { makeSelectFeatureToggles } from '../utils/selectors/feature-toggles';
import { useFormRouting } from '../hooks/useFormRouting';

import AppointmentMessage from './AppointmentDisplay/AppointmentMessage';
import UpcomingAppointmentsListItemAction from './UpcomingAppointmentsListItemAction';

const UpcomingAppointmentsListItem = props => {
  const { app, appointment, goToDetails, router, border } = props;
  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const { isUpcomingAppointmentsEnabled } = useSelector(selectFeatureToggles);
  const { t } = useTranslation();
  const { getCurrentPageFromRouter } = useFormRouting(router);
  const page = getCurrentPageFromRouter();
  const appointmentDateTime = new Date(appointment.startTime);
  const clinic = clinicName(appointment);
  const isCancelled = appointment.status?.includes('CANCELLED');

  const appointmentInfo = () => {
    if (appointment?.kind === 'vvc') {
      return <div data-testid="appointment-info-vvc">{t('video')}</div>;
    }
    if (appointment?.kind === 'cvt') {
      return (
        <div data-testid="appointment-info-cvt">
          {`${t('video-at')} ${appointment.facility}`}
          <br />
          {`${t('clinic')}: ${clinic}`}
        </div>
      );
    }
    if (appointment?.kind === 'phone') {
      return <div data-testid="appointment-info-phone">{t('phone')}</div>;
    }
    return (
      <div data-testid="appointment-info-clinic">
        {`${t('in-person-at')} ${appointment.facility}`} <br />
        {`${t('clinic')}: ${clinic}`}
      </div>
    );
  };

  const appointmentDetails = testId => {
    return (
      <div data-testid={testId}>
        <div
          className="vads-u-margin-top--1p5 vads-u-margin-bottom--1"
          data-testid="appointment-time"
        >
          {t('date-time', { date: appointmentDateTime })}
        </div>
        <div
          data-testid="appointment-type-and-provider"
          className="vads-u-font-weight--bold vads-u-margin-bottom--1"
        >
          {appointment.clinicStopCodeName
            ? appointment.clinicStopCodeName
            : t('VA-appointment')}
          {appointment.doctorName
            ? ` ${t('with')} ${appointment.doctorName}`
            : ''}
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
            {appointmentInfo()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <li
      className={`check-in--appointment-item ${border &&
        'vads-u-border-bottom--1px vads-u-border-color--gray-light'}`}
      data-testid="appointment-list-item"
    >
      {isCancelled ? (
        <del>{appointmentDetails('appointment-details-cancelled')}</del>
      ) : (
        appointmentDetails('appointment-details')
      )}
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
        {app === APP_NAMES.CHECK_IN &&
          !isUpcomingAppointmentsEnabled && (
            <div data-testid="appointment-action">
              <AppointmentMessage appointment={appointment} page={page} />
              <UpcomingAppointmentsListItemAction
                appointment={appointment}
                router={router}
                event="check-in-clicked-VAOS-design"
              />
            </div>
          )}
      </div>
    </li>
  );
};

UpcomingAppointmentsListItem.propTypes = {
  app: PropTypes.string.isRequired,
  appointment: PropTypes.object.isRequired,
  border: PropTypes.bool.isRequired,
  goToDetails: PropTypes.func,
  router: PropTypes.object,
};

export default UpcomingAppointmentsListItem;

import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import AppointmentMessage from './AppointmentMessage';
import AppointmentAction from './AppointmentAction';
import {
  appointmentIcon,
  clinicName,
  getAppointmentId,
} from '../../utils/appointment';
import { APP_NAMES } from '../../utils/appConstants';
import { makeSelectFeatureToggles } from '../../utils/selectors/feature-toggles';

const AppointmentListItem = props => {
  const { appointment, goToDetails, router, app, page } = props;
  const { t } = useTranslation();

  const appointmentDateTime = new Date(appointment.startTime);
  const clinic = clinicName(appointment);

  const pagesToShowDetails = ['details', 'complete', 'confirmation'];
  const showDetailsLink = pagesToShowDetails.includes(page) && goToDetails;

  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const { is45MinuteReminderEnabled } = useSelector(selectFeatureToggles);

  const detailsAriaLabel = () => {
    const modality = appointment.kind === 'phone' ? t('phone') : t('in-person');
    const type = appointment.clinicStopCodeName
      ? `${appointment.clinicStopCodeName} ${t('appointment')}`
      : t('VA-appointment');
    const provider = appointment.doctorName
      ? `${t('with')} ${appointment.doctorName}`
      : '';

    return `${t('details-for')} ${modality} ${type} ${provider} ${t(
      'on-date-at-time',
      { date: appointmentDateTime },
    )}`;
  };

  const infoBlockMessage = () => {
    if (appointment?.kind === 'phone') {
      return (
        <span data-testid="phone-msg-confirmation">
          {t('your-provider-will-call-you-at-your-appointment-time')}
        </span>
      );
    }
    if (is45MinuteReminderEnabled && appointment) {
      return (
        <span data-testid="in-person-msg-confirmation">
          {t('remember-to-bring-your-insurance-cards-with-you')}
        </span>
      );
    }
    return (
      <span data-testid="in-person-msg-confirmation">
        {t('please-bring-your-insurance-cards-with-you-to-your-appointment')}
      </span>
    );
  };

  return (
    <li
      className="vads-u-border-bottom--1px check-in--appointment-item"
      data-testid="appointment-list-item"
    >
      <div className="check-in--appointment-summary vads-u-margin-bottom--2 vads-u-margin-top--2p5">
        {page === 'confirmation' && (
          <div className="vads-u-font-family--serif vads-u-font-size--lg vads-u-line-height--2 vads-u-margin-bottom--1">
            {t('date-long', { date: appointmentDateTime })}
          </div>
        )}
        <div
          data-testid="appointment-time"
          className="vads-u-font-size--h2 vads-u-font-family--serif vads-u-font-weight--bold vads-u-line-height--1 vads-u-margin-bottom--2"
        >
          {t('date-time', { date: appointmentDateTime })}{' '}
        </div>
        <div
          data-testid="appointment-type-and-provider"
          className="vads-u-font-weight--bold"
        >
          {appointment.clinicStopCodeName
            ? appointment.clinicStopCodeName
            : t('VA-appointment')}
          {appointment.doctorName
            ? ` ${t('with')} ${appointment.doctorName}`
            : ''}
        </div>
        <div className="vads-u-display--flex vads-u-align-items--baseline">
          <div
            data-testid="appointment-kind-icon"
            className="vads-u-margin-right--1 check-in--label"
          >
            {appointmentIcon(appointment)}
          </div>
          <div
            data-testid="appointment-kind-and-location"
            className="vads-u-display--inline"
          >
            {appointment?.kind === 'phone' ? (
              t('phone')
            ) : (
              <>
                {`${t('in-person-at')} ${appointment.facility}`} <br />
                {`${t('clinic')}: ${clinic}`}
              </>
            )}
          </div>
        </div>
        {showDetailsLink && (
          <div className="vads-u-margin-y--2">
            <a
              data-testid="details-link"
              href={`${
                router.location.basename
              }/appointment-details/${getAppointmentId(appointment)}`}
              onClick={e => goToDetails(e, appointment)}
              aria-label={detailsAriaLabel()}
            >
              {t('details')}
            </a>
          </div>
        )}
        {app === APP_NAMES.CHECK_IN &&
          page !== 'confirmation' && (
            <>
              <AppointmentMessage appointment={appointment} />
              <AppointmentAction
                appointment={appointment}
                router={router}
                event="check-in-clicked-VAOS-design"
              />
            </>
          )}
      </div>
      {app === APP_NAMES.PRE_CHECK_IN &&
        page === 'confirmation' && (
          <va-alert
            show-icon
            data-testid="appointment-message"
            class="vads-u-margin-bottom--2"
            uswds
            slim
          >
            <div>{infoBlockMessage()}</div>
          </va-alert>
        )}
    </li>
  );
};

AppointmentListItem.propTypes = {
  app: PropTypes.string.isRequired,
  appointment: PropTypes.object.isRequired,
  page: PropTypes.string.isRequired,
  goToDetails: PropTypes.func,
  router: PropTypes.object,
};

export default AppointmentListItem;

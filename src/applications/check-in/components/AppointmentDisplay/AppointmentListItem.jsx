import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import {
  appointmentIcon,
  clinicName,
  getAppointmentId,
} from '../../utils/appointment';
import { APP_NAMES } from '../../utils/appConstants';

const AppointmentListItem = props => {
  const { appointment, goToDetails, router, app, page } = props;
  const { t } = useTranslation();

  const appointmentDateTime = new Date(appointment.startTime);
  const clinic = clinicName(appointment);

  const pagesToShowDetails = ['details', 'complete', 'confirmation'];
  const showDetailsLink = pagesToShowDetails.includes(page) && goToDetails;

  const detailsAriaLabel = () => {
    let modality;
    switch (appointment.kind) {
      case 'clinic':
        modality = t('in-person');
        break;
      case 'vvc':
      case 'cvt':
        modality = t('video-appointment');
        break;
      default:
        modality = t('phone');
    }

    const type =
      appointment.kind === 'cvt' || appointment.kind === 'vvc'
        ? ''
        : ` ${t('VA-appointment')}`;

    const provider = appointment.doctorName
      ? ` ${t('with')} ${appointment.doctorName}`
      : '';

    const facility =
      appointment.kind === 'cvt' ? ` ${t('at')} ${appointment.facility}` : '';

    return `${t('details-for')} ${modality}${type}${facility}${provider} ${t(
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
    if (appointment?.kind === 'vvc') {
      return (
        <span data-testid="video-vvc-confirmation">
          {t('you-can-join-your-appointment-by-using-our-appointments-tool')}
        </span>
      );
    }
    if (appointment?.kind === 'cvt') {
      return (
        <span data-testid="video-cvt-confirmation">
          {t('go-to-facility-for-this-video-appointment', {
            facility: appointment.facility,
          })}
        </span>
      );
    }
    return (
      <span data-testid="in-person-msg-confirmation">
        {t('remember-to-bring-your-insurance-cards-with-you')}
      </span>
    );
  };

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

  return (
    <li
      className="vads-u-border-bottom--1px vads-u-border-color--gray-light check-in--appointment-item"
      data-testid="appointment-list-item"
    >
      <div className="check-in--appointment-summary vads-u-margin-bottom--2 vads-u-margin-top--2p5">
        {page === 'confirmation' && (
          <div className="vads-u-font-family--serif vads-u-font-size--lg vads-u-line-height--2 vads-u-margin-bottom--1">
            {t('date-long', { date: appointmentDateTime })}
          </div>
        )}
        <h3
          data-testid="appointment-time"
          className="vads-u-font-size--h2 vads-u-margin-top--0 vads-u-font-family--serif vads-u-font-weight--bold vads-u-line-height--1 vads-u-margin-bottom--2"
        >
          {t('date-time', { date: appointmentDateTime })}{' '}
        </h3>
        <div
          data-testid="appointment-type-and-provider"
          className="vads-u-font-weight--bold"
        >
          {t('VA-appointment')}
          {appointment.doctorName
            ? ` ${t('with')} ${appointment.doctorName}`
            : ''}
        </div>
        <div className="vads-u-display--flex">
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
            {appointmentInfo()}
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

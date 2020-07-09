import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';

import ListBestTimeToCall from './ListBestTimeToCall';
import { sentenceCase } from '../utils/formatters';

import { APPOINTMENT_STATUS, TIME_TEXT } from '../utils/constants';
import AppointmentStatus from './AppointmentStatus';
import VAFacilityLocation from './VAFacilityLocation';
import AppointmentRequestCommunityCareLocation from './AppointmentRequestCommunityCareLocation';
import AdditionalInfoRow from './AdditionalInfoRow';

// Only use this when we need to pass data that comes back from one of our
// services files to one of the older api functions
function parseFakeFHIRId(id) {
  return id ? id.replace('var', '') : id;
}

export default class AppointmentRequestListItem extends React.Component {
  static propTypes = {
    appointment: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      showMore: false,
    };
  }

  toggleShowMore = () => {
    const { appointment, messages, fetchMessages } = this.props;
    const id = parseFakeFHIRId(appointment.id);
    const showMore = !this.state.showMore;

    if (showMore && !messages[id] && !appointment.vaos.isExpressCare) {
      fetchMessages(id);
    }

    this.setState({ showMore });
  };

  render() {
    const {
      appointment,
      index,
      messages,
      cancelAppointment,
      showCancelButton,
      facility,
      facilityId,
    } = this.props;

    const { showMore } = this.state;
    const isCC = appointment.vaos.isCommunityCare;
    const isExpressCare = appointment.vaos.isExpressCare;
    const videoType = appointment.vaos.videoType;
    const cancelled = appointment.status === APPOINTMENT_STATUS.cancelled;
    const firstMessage =
      messages?.[parseFakeFHIRId(appointment.id)]?.[0]?.attributes?.messageText;

    const patientInfo = appointment.participant.find(p =>
      p?.actor?.reference.includes('Patient'),
    )?.actor;

    const patientPhone = patientInfo?.telecom?.find(t => t?.system === 'phone')
      ?.value;

    const patientEmail = patientInfo?.telecom?.find(t => t?.system === 'email')
      ?.value;

    const facilityName = appointment.participant?.find(p =>
      p.actor.reference?.startsWith('Location'),
    )?.actor?.display;

    const itemClasses = classNames(
      'vaos-appts__list-item vads-u-background-color--gray-lightest vads-u-padding--2p5 vads-u-margin-bottom--3',
      {
        'vads-u-border-top--4px': true,
        'vads-u-border-color--warning-message': !cancelled,
        'vads-u-border-color--secondary-dark': cancelled,
      },
    );

    return (
      <li
        aria-labelledby={`card-${index} card-${index}-status`}
        data-request-id={appointment.id}
        className={itemClasses}
        data-is-cancelable={!isCC && !videoType ? 'true' : 'false'}
      >
        <div className="vaos-form__title vads-u-font-size--sm vads-u-font-weight--normal vads-u-font-family--sans">
          {isCC && 'Community Care'}
          {!isCC && !!videoType && 'VA Video Connect'}
          {!isCC && !videoType && 'VA Appointment'}
        </div>
        <h3
          id={`card-${index}`}
          className="vads-u-font-size--h3 vads-u-margin-y--0"
        >
          {sentenceCase(appointment.type?.coding?.[0]?.display)} appointment
        </h3>
        <AppointmentStatus status={appointment.status} index={index} />
        <div className="vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
          <div className="vads-u-flex--1 vads-u-margin-right--1 vaos-u-word-break--break-word">
            {isCC && (
              <AppointmentRequestCommunityCareLocation
                appointment={appointment}
              />
            )}
            {!isCC && (
              <VAFacilityLocation
                facility={facility}
                facilityName={facilityName}
                facilityId={parseFakeFHIRId(facilityId)}
              />
            )}
          </div>
          {!isExpressCare && (
            <div className="vads-u-flex--1 vaos-u-word-break--break-word">
              <dl className="vads-u-margin--0">
                <dt className="vads-u-font-weight--bold">
                  Preferred date and time
                </dt>
                <dd>
                  <ul className="usa-unstyled-list">
                    {appointment.requestedPeriod.map((option, optionIndex) => (
                      <li key={`${appointment.id}-option-${optionIndex}`}>
                        {moment.utc(option.start).format('ddd, MMMM D, YYYY')}{' '}
                        {option.start.includes('00:00:00')
                          ? TIME_TEXT.AM
                          : TIME_TEXT.PM}
                      </li>
                    ))}
                  </ul>
                </dd>
              </dl>
            </div>
          )}
        </div>
        <div className="vads-u-margin-top--2 vads-u-display--flex vads-u-flex-wrap--wrap">
          <AdditionalInfoRow
            id={appointment.id}
            open={showMore}
            triggerText={showMore ? 'Show less' : 'Show more'}
            onClick={this.toggleShowMore}
          >
            <div className="vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
              <div className="vaos_appts__message vads-u-flex--1 vads-u-margin-right--1 vaos-u-word-break--break-word">
                {isExpressCare && (
                  <dl className="vads-u-margin--0">
                    <dt className="vads-u-font-weight--bold">
                      Reason for appointment
                    </dt>
                    <dd>{appointment.reason}</dd>
                  </dl>
                )}
                {!isExpressCare && (
                  <dl className="vads-u-margin--0">
                    <dt className="vads-u-font-weight--bold">
                      {appointment.reason}
                    </dt>
                    <dd>{firstMessage}</dd>
                  </dl>
                )}
              </div>
              <div className="vads-u-flex--1 vads-u-margin-top--2 small-screen:vads-u-margin-top--0 vaos-u-word-break--break-word">
                <dl className="vads-u-margin--0">
                  <dt className="vads-u-font-weight--bold vads-u-display--block">
                    Your contact details
                  </dt>
                  <dd>
                    {patientEmail}
                    <br />
                    {patientPhone}
                    <br />
                    <span className="vads-u-font-style--italic">
                      <ListBestTimeToCall
                        timesToCall={appointment.legacyVAR?.bestTimeToCall}
                      />
                    </span>
                  </dd>
                </dl>
              </div>
            </div>
          </AdditionalInfoRow>
          {showCancelButton &&
            !cancelled && (
              <button
                className="vaos-appts__cancel-btn va-button-link vads-u-margin--0 vads-u-flex--0"
                onClick={() => cancelAppointment(appointment)}
                aria-label="Cancel appointment"
              >
                Cancel appointment
              </button>
            )}
          <div className="vaos-flex-break" />
        </div>
      </li>
    );
  }
}

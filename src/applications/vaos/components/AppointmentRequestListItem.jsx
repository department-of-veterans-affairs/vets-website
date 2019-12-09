import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';

import {
  getLocationHeader,
  getAppointmentLocation,
  getRequestDateOptions,
  getRequestTimeToCall,
  getPurposeOfVisit,
  sentenceCase,
} from '../utils/appointment';
import { APPOINTMENT_TYPES } from '../utils/constants';

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
    const id = appointment.id;
    const showMore = !this.state.showMore;

    if (showMore && !messages[id]) {
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
      type,
    } = this.props;
    const { showMore } = this.state;
    const canceled = appointment.status === 'Cancelled';
    const firstMessage =
      messages?.[appointment.id]?.[0]?.attributes?.messageText;

    const itemClasses = classNames(
      'vaos-appts__list-item vads-u-background-color--gray-lightest vads-u-padding--2p5 vads-u-margin-bottom--3',
      {
        'vads-u-border-top--4px': true,
        'vads-u-border-color--warning-message': !canceled,
        'vads-u-border-color--secondary-dark': canceled,
      },
    );

    return (
      <li
        aria-labelledby={`card-${index}`}
        data-request-id={appointment.id}
        className={itemClasses}
      >
        <div className="vaos-form__title vads-u-font-size--sm vads-u-font-weight--normal vads-u-font-family--sans">
          {type === APPOINTMENT_TYPES.ccRequest && 'Community Care'}
          {type === APPOINTMENT_TYPES.request &&
            appointment.visitType !== 'Telehealth' &&
            'VA Appointment'}
          {type === APPOINTMENT_TYPES.request &&
            appointment.visitType === 'Telehealth' &&
            'VA Video Connect'}
        </div>
        <h2
          id={`card-${index}`}
          className="vads-u-font-size--h3 vads-u-margin-top--0 vads-u-margin-bottom--2"
        >
          {sentenceCase(appointment.appointmentType)} appointment
        </h2>
        <div className="vads-u-display--flex vads-u-justify-content--space-between vads-u-margin-bottom--2">
          <div className="vaos-appts__status vads-u-padding-right--1">
            {canceled ? (
              <i className="fas fa-exclamation-circle" />
            ) : (
              <i className="fas fa-exclamation-triangle" />
            )}
          </div>
          <div className="vaos-appts__status vads-u-flex--1">
            <span className="vads-u-font-weight--bold vads-u-display--inline-block">
              <div className="vaos-appts__status-text vads-u-font-size--base vads-u-font-family--sans">
                {canceled ? (
                  'Canceled'
                ) : (
                  <>
                    <strong>Pending</strong>{' '}
                    <div className="vads-u-font-weight--normal">
                      The time and date of this appointment are still to be
                      determined.
                    </div>
                  </>
                )}
              </div>
            </span>
          </div>
        </div>
        <div className="vaos-appts__split-section">
          <div className="vads-u-flex--1 vads-u-margin-right--1">
            <dl className="vads-u-margin--0">
              <dt className="vads-u-font-weight--bold">
                {getLocationHeader(appointment)}
              </dt>
              <dd>{getAppointmentLocation(appointment, facility)}</dd>
            </dl>
          </div>
          <div className="vads-u-flex--1 vaos-appts__preferred-dates">
            <dl className="vads-u-margin--0">
              <dt className="vads-u-font-weight--bold">
                Preferred date and time
              </dt>
              <dd>
                <ul className="usa-unstyled-list">
                  {getRequestDateOptions(appointment)}
                </ul>
              </dd>
            </dl>
          </div>
        </div>
        <div className="vads-u-margin-top--2">
          <AdditionalInfo
            triggerText={showMore ? 'Show less' : 'Show more'}
            onClick={this.toggleShowMore}
          >
            <div className="vaos-appts__split-section">
              <div className="vaos_appts__message vads-u-flex--1">
                <dl className="vads-u-margin--0">
                  <dt className="vads-u-font-weight--bold">
                    {getPurposeOfVisit(appointment)}
                  </dt>
                  <dd>{firstMessage}</dd>
                </dl>
              </div>
              <div className="vads-u-flex--1">
                <dl className="vads-u-margin--0">
                  <dt className="vads-u-font-weight--bold vads-u-display--block">
                    Your contact details
                  </dt>
                  <dd>
                    {appointment.email}
                    <br />
                    {appointment.phoneNumber}
                    <br />
                    <span className="vads-u-font-style--italic">
                      {getRequestTimeToCall(appointment)}
                    </span>
                  </dd>
                </dl>
              </div>
            </div>
          </AdditionalInfo>
        </div>
        {!showCancelButton || canceled ? null : (
          <div className="vads-u-margin-top--2">
            <button
              className="vaos-appts__cancel-btn va-button-link vads-u-margin--0 vads-u-flex--0"
              onClick={() => cancelAppointment(appointment)}
              aria-label="Cancel appointment"
            >
              Cancel appointment
            </button>
          </div>
        )}
      </li>
    );
  }
}

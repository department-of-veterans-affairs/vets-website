import React from 'react';
import PropTypes from 'prop-types';
import {
  getLocationHeader,
  getAppointmentLocation,
  getRequestDateOptions,
  getRequestTimeToCall,
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
    const id = appointment.appointmentRequestId;
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
      messages?.[appointment.appointmentRequestId]?.[0]?.attributes
        ?.messageText;

    return (
      <li
        aria-labelledby={`card-${index}`}
        className="vaos-appts__list-item vads-u-background-color--gray-lightest vads-u-padding--2p5 vads-u-margin-bottom--3"
      >
        <div className="vads-u-display--flex vads-u-justify-content--space-between">
          <div className="vaos-appts__status vads-u-padding-right--1">
            {canceled ? (
              <i className="fas fa-exclamation-circle vads-u-color--secondary-dark" />
            ) : (
              <i className="fas fa-exclamation-triangle vads-u-color--warning-message" />
            )}
          </div>
          <div className="vaos-appts__status vads-u-flex--1">
            <span className="vads-u-font-weight--bold vads-u-display--inline-block">
              <div className="vaos-appts__status-text vads-u-font-size--base vads-u-font-family--sans">
                {canceled ? (
                  'Canceled'
                ) : (
                  <>
                    <strong>Pending -</strong>{' '}
                    <span className="vads-u-font-weight--normal">
                      The time and date are still to be determined.
                    </span>
                  </>
                )}
              </div>
            </span>
          </div>

          {!showCancelButton || canceled ? null : (
            <div>
              <button
                className="usa-button-secondary vads-u-margin--0 vads-u-flex--0"
                onClick={() => cancelAppointment(appointment)}
                aria-label="Cancel appointment"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        <div className="vaos-form__title vads-u-margin-top--1 vads-u-font-size--sm vads-u-font-weight--normal vads-u-font-family--sans">
          {type === APPOINTMENT_TYPES.ccRequest && 'Community Care'}
          {type === APPOINTMENT_TYPES.request &&
            appointment.visitType !== 'Telehealth' &&
            'VA Facility'}
          {type === APPOINTMENT_TYPES.request &&
            appointment.visitType === 'Telehealth' &&
            'VA Video Connect'}
        </div>
        <h2
          id={`card-${index}`}
          className="vads-u-font-size--h3 vads-u-margin-top--0 vads-u-margin-bottom--2"
        >
          {appointment.appointmentType} appointment
        </h2>
        <div className="vads-u-flex--1 vads-u-margin-bottom--2">
          <dl className="vads-u-margin--0">
            <dt className="vads-u-font-weight--bold">
              {getLocationHeader(appointment)}
            </dt>
            <dd>{getAppointmentLocation(appointment, facility)}</dd>
          </dl>
        </div>
        <hr className="vads-u-margin--0 vads-u-margin-top--1p5" />
        {showMore ? (
          <div className="vads-u-margin-top--2">
            <div className="vaos-appts__split-section">
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

            {firstMessage && (
              <div className="vaos_appts__message vads-u-flex--1 vads-u-margin-y--2">
                <dl className="vads-u-margin--0">
                  <dt className="vads-u-font-weight--bold">
                    Additional information
                  </dt>
                  <dd>{firstMessage}</dd>
                </dl>
              </div>
            )}
            <hr className="vads-u-margin--0 vads-u-margin-top--2" />
          </div>
        ) : null}
        <button
          type="button"
          className="va-button-link vaos-appts__expand-link vads-u-display--block vads-u-margin-top--1p5"
          onClick={this.toggleShowMore}
          aria-expanded={showMore}
        >
          {showMore ? (
            <>
              Show less
              <i className="fas fa-chevron-up" />
            </>
          ) : (
            <>
              Show more
              <i className="fas fa-chevron-down" />
            </>
          )}
        </button>
      </li>
    );
  }
}

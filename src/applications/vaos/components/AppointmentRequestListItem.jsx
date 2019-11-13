import React from 'react';
import PropTypes from 'prop-types';
import {
  titleCase,
  getClinicName,
  getAppointmentLocation,
  getRequestDateOptions,
  getRequestTimeToCall,
} from '../utils/appointment';

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

  render() {
    const {
      appointment,
      index,
      cancelAppointment,
      showCancelButton,
    } = this.props;
    const { showMore } = this.state;
    const canceled = appointment.status === 'Cancelled';
    const isCommunityCare = !!appointment.ccAppointmentRequest;

    return (
      <li
        aria-labelledby={`card-${index}`}
        className="vaos-appts__list-item vads-u-background-color--gray-lightest vads-u-padding--2p5 vads-u-margin-bottom--3"
      >
        <div className="vads-u-display--flex vads-u-justify-content--space-between">
          <div className="vaos-appts__status vads-u-flex--1">
            {canceled ? (
              <i className="fas fa-exclamation-circle vads-u-color--secondary-dark" />
            ) : (
              <i className="fas fa-exclamation-triangle vads-u-color--warning-message" />
            )}
            <span className="vads-u-font-weight--bold vads-u-display--inline-block">
              <div className="vaos-appts__status-text vads-u-font-size--base vads-u-font-family--sans">
                {canceled ? (
                  'Canceled'
                ) : (
                  <>
                    <span className="vads-u-font-weight--bold vads-u-display--inline-block vads-u-margin-right--0p5">
                      Pending
                    </span>
                    <span className="vads-u-display--none medium-screen:vads-u-display--block vads-u-font-weight--normal">
                      - The time and date are still to be determined.
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
        <h2
          id={`card-${index}`}
          className="vads-u-font-size--h3 vads-u-margin-y--2"
        >
          {titleCase(appointment.appointmentType)} appointment{' '}
          {isCommunityCare && '- Community Care'}
        </h2>
        <div className="vads-u-flex--1 vads-u-margin-bottom--2">
          {!isCommunityCare && (
            <dl className="vads-u-margin--0">
              <dt className="vads-u-font-weight--bold">
                {getClinicName(appointment)}
              </dt>
              <dd>{getAppointmentLocation(appointment)}</dd>
            </dl>
          )}
          {isCommunityCare && (
            <dl className="vads-u-margin--0">
              <dt className="vads-u-font-weight--bold">Preferred providers</dt>
              <dd>
                <ul className="usa-unstyled-list">
                  {appointment.ccAppointmentRequest.preferredProviders.map(
                    provider => (
                      <li key={`${provider.firstName} ${provider.lastName}`}>
                        {provider.practiceName}
                        <br />
                        {provider.firstName} {provider.lastName}
                      </li>
                    ),
                  )}
                  {!appointment.ccAppointmentRequest?.preferredProviders?.[0] &&
                    'Not specified'}
                </ul>
              </dd>
            </dl>
          )}
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

            <hr className="vads-u-margin--0 vads-u-margin-top--2" />
          </div>
        ) : null}
        <button
          type="button"
          className="va-button-link vaos-appts__expand-link vads-u-display--block vads-u-margin-top--1p5"
          onClick={() => this.setState({ showMore: !this.state.showMore })}
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

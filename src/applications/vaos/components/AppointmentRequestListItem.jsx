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
    const { appointment } = this.props;
    const { showMore } = this.state;
    const canceled = appointment.status === 'Cancelled';

    return (
      <li className="vaos-appts__list-item vads-u-background-color--gray-lightest vads-u-padding--2p5 vads-u-margin-bottom--3">
        <div className="vads-u-display--flex vads-u-justify-content--space-between">
          <div className="vaos-appts__status vads-u-flex--1">
            {canceled ? (
              <i className="fas fa-exclamation-circle vads-u-color--secondary-dark" />
            ) : (
              <i className="fas fa-exclamation-triangle vads-u-color--warning-message" />
            )}
            <span className="vads-u-font-weight--bold vads-u-display--inline-block">
              <h2 className="vaos-appts__status-text vads-u-font-size--base vads-u-font-family--sans">
                {canceled ? (
                  'Canceled'
                ) : (
                  <>
                    <span className="vads-u-font-weight--bold vads-u-display--inline-block vads-u-margin-right--0p5">
                      Pending
                    </span>
                    <span className="vads-u-font-weight--normal">
                      Date and time to be determined
                    </span>
                  </>
                )}
              </h2>
            </span>
          </div>

          {canceled ? null : (
            <div>
              <button
                className="usa-button-secondary vads-u-margin--0 vads-u-flex--0"
                aria-label="Cancel appointment"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        <dl className="vads-u-margin--0">
          <div className="vads-u-flex--1 vads-u-margin-y--1p5">
            <span className="vads-u-font-weight--bold">
              {titleCase(appointment.appointmentType)} appointment
            </span>
          </div>
          <div className="vads-u-flex--1 vads-u-margin-bottom--2">
            <dt className="vads-u-font-weight--bold">
              {getClinicName(appointment)}
            </dt>
            <dd>{getAppointmentLocation(appointment)}</dd>
          </div>
          <hr className="vads-u-margin--0 vads-u-margin-top--1p5" />
          {showMore ? (
            <div className="vads-u-margin-top--2">
              <div className="vaos-appts__split-section">
                <div className="vads-u-flex--1 vaos-appts__preferred-dates">
                  <span className="vads-u-font-weight--bold">
                    <dt>Preferred date and time</dt>
                  </span>
                  <dd>
                    <ul className="usa-unstyled-list">
                      {getRequestDateOptions(appointment)}
                    </ul>
                  </dd>
                </div>
                <div className="vads-u-flex--1">
                  <span className="vads-u-font-weight--bold vads-u-display--block">
                    <dt>Your contact details</dt>
                  </span>
                  <dd>
                    {appointment.email}
                    <br />
                    {appointment.phoneNumber}
                    <br />
                    <span className="vads-u-font-style--italic">
                      {getRequestTimeToCall(appointment)}
                    </span>
                  </dd>
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
        </dl>
      </li>
    );
  }
}

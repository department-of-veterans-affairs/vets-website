import React from 'react';
import PropTypes from 'prop-types';
import {
  titleCase,
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

  showMoreOnClick = e => {
    e.preventDefault();
    this.setState({ showMore: !this.state.showMore });
  };

  render() {
    const { appointment } = this.props;
    const { showMore } = this.state;
    const canceled = appointment.status === 'Cancelled';

    return (
      <li className="vads-u-background-color--gray-lightest vads-u-padding--2p5 vads-u-margin-bottom--3">
        <div className="vads-u-display--flex vads-u-justify-content--space-between">
          <div className="vaos-appts__status vads-u-flex--1 vads-u-margin-bottom--1">
            {canceled ? (
              <i className="fas fa-exclamation-circle vads-u-color--secondary-dark" />
            ) : (
              <i className="fas fa-exclamation-triangle vads-u-color--warning-message" />
            )}
            <span className="vads-u-font-weight--bold vads-u-display--inline-block">
              {canceled ? (
                <div className="vads-u-margin-left--1 vaos-appts__status-text">
                  Canceled
                </div>
              ) : (
                <div className="vaos-appts__status-text">
                  <span className="vads-u-font-weight--bold vads-u-display--inline-block vads-u-margin-right--1">
                    Pending
                  </span>
                  <span className="vads-u-font-weight--normal">
                    Date and time to be determined
                  </span>
                </div>
              )}
            </span>
          </div>

          {canceled ? null : (
            <div>
              <button className="usa-button-secondary vads-u-margin--0 vads-u-flex--0">
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="vads-u-flex--1 vads-u-margin-y--1p5">
          <span className="vads-u-font-weight--bold">
            {titleCase(appointment.appointmentType)} appointment
          </span>
        </div>
        <div className="vads-u-flex--1 vads-u-margin-bottom--2">
          <span className="vads-u-font-weight--bold">
            {appointment.friendlyLocationName || appointment.facility.name}
          </span>
          <br />
          {appointment.facility.city}, {appointment.facility.state}
        </div>
        <hr className="vads-u-margin--0 vads-u-margin-top--1p5" />
        {showMore ? (
          <div className="vads-u-margin-top--2">
            <div className="vaos-appts__split-section">
              <div className="vads-u-flex--1 vaos-appts__preferred-dates">
                <span className="vads-u-font-weight--bold">
                  Preferred date and time
                </span>
                <ul className="usa-unstyled-list">
                  {getRequestDateOptions(appointment)}
                </ul>
              </div>
              <div className="vads-u-flex--1">
                <span className="vads-u-font-weight--bold vads-u-display--block">
                  Your contact details
                </span>
                {appointment.email}
                <br />
                {appointment.phoneNumber}
                <br />
                <span className="vads-u-font-style--italic">
                  {getRequestTimeToCall(appointment)}
                </span>
              </div>
            </div>

            <hr className="vads-u-margin--0 vads-u-margin-top--2" />
          </div>
        ) : null}
        <a
          href="#"
          className="vaos-appts__expand-link vads-u-display--block vads-u-margin-top--1p5"
          onClick={this.showMoreOnClick}
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
        </a>
      </li>
    );
  }
}

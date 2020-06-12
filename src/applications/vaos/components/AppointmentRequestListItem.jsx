import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';

import ListBestTimeToCall from './ListBestTimeToCall';
import { sentenceCase } from '../utils/formatters';

import { APPOINTMENT_STATUS, TIME_TEXT } from '../utils/constants';
import AppointmentStatus from './AppointmentStatus';
import VAFacilityLocation from './VAFacilityLocation';
import AppointmentRequestCommunityCareLocation from './AppointmentRequestCommunityCareLocation';

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

    if (showMore && !messages[id] && !appointment.isExpressCare) {
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
    } = this.props;
    const { showMore } = this.state;
    const cancelled = appointment.status === APPOINTMENT_STATUS.cancelled;
    const firstMessage =
      messages?.[appointment.id]?.[0]?.attributes?.messageText;

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
        data-is-cancelable={
          !appointment.isCommunityCare && !appointment.videoType
            ? 'true'
            : 'false'
        }
      >
        <div className="vaos-form__title vads-u-font-size--sm vads-u-font-weight--normal vads-u-font-family--sans">
          {appointment.isCommunityCare && 'Community Care'}
          {!appointment.isCommunityCare &&
            !!appointment.videoType &&
            'VA Video Connect'}
          {!appointment.isCommunityCare &&
            !appointment.videoType &&
            'VA Appointment'}
        </div>
        <h3
          id={`card-${index}`}
          className="vads-u-font-size--h3 vads-u-margin-y--0"
        >
          {sentenceCase(appointment.typeOfCare)} appointment
        </h3>
        <AppointmentStatus status={appointment.status} index={index} />
        <div className="vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
          <div className="vads-u-flex--1 vads-u-margin-right--1 vaos-u-word-break--break-word">
            {appointment.isCommunityCare && (
              <AppointmentRequestCommunityCareLocation
                appointment={appointment}
              />
            )}
            {!appointment.isCommunityCare && (
              <VAFacilityLocation
                facility={facility}
                facilityName={appointment.facilityName}
                facilityId={appointment.facility.facilityCode}
              />
            )}
          </div>
          {!appointment.isExpressCare && (
            <div className="vads-u-flex--1 vaos-u-word-break--break-word">
              <dl className="vads-u-margin--0">
                <dt className="vads-u-font-weight--bold">
                  Preferred date and time
                </dt>
                <dd>
                  <ul className="usa-unstyled-list">
                    {appointment.dateOptions.map((option, optionIndex) => (
                      <li key={`${appointment.id}-option-${optionIndex}`}>
                        {option.date.format('ddd, MMMM D, YYYY')}{' '}
                        {TIME_TEXT[option.optionTime]}
                      </li>
                    ))}
                  </ul>
                </dd>
              </dl>
            </div>
          )}
        </div>
        <div className="vads-u-margin-top--2">
          <AdditionalInfo
            triggerText={showMore ? 'Show less' : 'Show more'}
            onClick={this.toggleShowMore}
          >
            <div className="vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
              <div className="vaos_appts__message vads-u-flex--1 vads-u-margin-right--1 vaos-u-word-break--break-word">
                {appointment.isExpressCare && (
                  <dl className="vads-u-margin--0">
                    <dt className="vads-u-font-weight--bold">
                      Reason for appointment
                    </dt>
                    <dd>{appointment.reason}</dd>
                  </dl>
                )}
                {!appointment.isExpressCare && (
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
                    {appointment.email}
                    <br />
                    {appointment.phoneNumber}
                    <br />
                    <span className="vads-u-font-style--italic">
                      <ListBestTimeToCall
                        timesToCall={appointment.bestTimetoCall}
                      />
                    </span>
                  </dd>
                </dl>
              </div>
            </div>
          </AdditionalInfo>
        </div>
        {showCancelButton &&
          !cancelled && (
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

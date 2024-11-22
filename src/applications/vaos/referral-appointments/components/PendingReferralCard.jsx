import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AppointmentFlexGrid from '../../appointment-list/components/AppointmentsPage/AppointmentFlexGrid';
import ListItem from '../../appointment-list/components/AppointmentsPage/ListItem';
import AppointmentRow from '../../appointment-list/components/AppointmentsPage/AppointmentRow';
import AppointmentColumn from '../../appointment-list/components/AppointmentsPage/AppointmentColumn';

const PendingReferralCard = ({ referral, handleClick }) => {
  const first = true;
  const grouped = true;
  const idClickable = `id-${referral.UUID.replace('.', '\\.')}`;
  const isCanceled = referral.status === 'cancelled';
  const typeOfCareName = referral.CategoryOfCare;

  const link = `schedule-referral/?id=${referral.UUID}`;

  const appointmentString =
    referral.numberOfAppointments === 1
      ? '1 appointment'
      : `${referral.numberOfAppointments} appointments`;

  return (
    <ListItem appointment={referral} borderBottom status="pending">
      <AppointmentFlexGrid idClickable={idClickable} link={link}>
        <AppointmentRow className="vads-u-margin-x--1p5 mobile:vads-u-flex-direction--row">
          <AppointmentColumn
            className={classNames(
              'vads-u-border-color--gray-medium',
              'vads-u-padding-y--2',
              {
                'vads-u-border-top--1px': grouped && !first,
              },
            )}
            size="1"
          >
            <AppointmentRow className="vaos-appts__column-gap--3 mobile-lg:vads-u-flex-direction--row">
              <AppointmentColumn size="1" className="vads-u-flex--4">
                <AppointmentRow className="vaos-appts__column-gap--3 vaos-appts__display--table mobile:vads-u-flex-direction--column mobile-lg:vads-u-flex-direction--row">
                  <AppointmentColumn
                    padding="0"
                    // canceled={isCanceled}
                    className="vads-u-font-weight--bold vaos-appts__display--table"
                  >
                    {typeOfCareName} request
                  </AppointmentColumn>
                  <AppointmentColumn
                    padding="0"
                    size="1"
                    className="vaos-appts__display--table"
                    canceled={isCanceled}
                  >
                    <span className="vaos-appts__display--table-cell vads-u-display--flex vads-u-align-items--center">
                      {`You have been approved for ${appointmentString}. All appointments for this referral must be scheduled by ${
                        referral.ReferralExpirationDate
                      }.`}
                    </span>
                  </AppointmentColumn>
                </AppointmentRow>
              </AppointmentColumn>

              <AppointmentColumn
                id={`vaos-referral-detail-${referral.UUID}`}
                className="vaos-hide-for-print"
                padding="0"
                size="1"
                aria-label="schedule your appointment"
              >
                <va-link-action
                  type="secondary"
                  href={link}
                  aria-describedby={`vaos-referral-detail-${referral.UUID}`}
                  message-aria-describedby="Custom message"
                  text="Schedule your appointment"
                  onClick={e => handleClick(e, referral.UUID)}
                />
              </AppointmentColumn>
            </AppointmentRow>
          </AppointmentColumn>
        </AppointmentRow>
      </AppointmentFlexGrid>
    </ListItem>
  );
};

PendingReferralCard.propTypes = {
  handleClick: PropTypes.func.isRequired,
  referral: PropTypes.object.isRequired,
};

export default PendingReferralCard;

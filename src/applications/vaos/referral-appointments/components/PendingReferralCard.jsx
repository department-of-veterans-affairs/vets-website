import React from 'react';
import { format, parseISO } from 'date-fns';
import PropTypes from 'prop-types';
import AppointmentFlexGrid from '../../components/AppointmentFlexGrid';
import ListItem from '../../components/ListItem';
import AppointmentRow from '../../components/AppointmentRow';
import AppointmentColumn from '../../components/AppointmentColumn';

const PendingReferralCard = ({ referral, index }) => {
  const first = index === 0;
  const idClickable = `id-${referral.uuid.replace('.', '\\.')}`;
  const isCanceled = referral.status === 'cancelled';
  const typeOfCareName = referral.categoryOfCare;

  const link = `schedule-referral?id=${referral.uuid}&referrer=referrals-requests`;

  const parsedDate = parseISO(referral.expirationDate);
  const expiration = format(parsedDate, 'MMMM d, yyyy');

  return (
    <ListItem
      appointment={referral}
      borderTop={first}
      borderBottom
      status="pending"
    >
      <AppointmentFlexGrid idClickable={idClickable} link={link}>
        <AppointmentRow className="vads-u-margin-x--0p5 mobile:vads-u-flex-direction--row">
          <AppointmentColumn className="vads-u-padding-y--1" size="1">
            <AppointmentRow className="vaos-appts__column-gap--3 mobile-lg:vads-u-flex-direction--row">
              <AppointmentColumn size="1" className="vads-u-flex--4">
                <AppointmentRow className="vaos-appts__column-gap--3 vaos-appts__display--table mobile:vads-u-flex-direction--column mobile-lg:vads-u-flex-direction--row">
                  <AppointmentColumn
                    padding="0"
                    // canceled={isCanceled}
                    className="vads-u-font-weight--bold vaos-appts__display--table"
                    data-testid="typeOfCare"
                  >
                    {`${typeOfCareName} referral`}
                  </AppointmentColumn>
                  <AppointmentColumn
                    padding="0p5"
                    size="1"
                    className="vaos-appts__display--table"
                    canceled={isCanceled}
                  >
                    <span className="vaos-appts__display--table-cell vads-u-display--flex vads-u-align-items--center">
                      {`We’ve approved your community care referral. You must schedule all appointments for this referral by ${expiration}.`}
                    </span>
                  </AppointmentColumn>
                </AppointmentRow>
              </AppointmentColumn>

              <AppointmentColumn
                id={`vaos-referral-detail-${referral.uuid}`}
                className="vaos-hide-for-print"
                padding="0p5"
                size="1"
                aria-label="schedule your appointment"
              >
                <va-link-action
                  type="secondary"
                  href={link}
                  aria-describedby={`vaos-referral-detail-${referral.uuid}`}
                  message-aria-describedby="Custom message"
                  text="Schedule your appointment"
                  onClick={e => e.preventDefault()}
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
  index: PropTypes.number.isRequired,
  referral: PropTypes.object.isRequired,
};

export default PendingReferralCard;

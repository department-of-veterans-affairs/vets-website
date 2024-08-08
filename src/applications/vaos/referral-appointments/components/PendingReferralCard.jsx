import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AppointmentFlexGrid from '../../appointment-list/components/AppointmentsPage/AppointmentFlexGrid';
import ListItem from '../../appointment-list/components/AppointmentsPage/ListItem';
import AppointmentRow from '../../appointment-list/components/AppointmentsPage/AppointmentRow';
import AppointmentColumn from '../../appointment-list/components/AppointmentsPage/AppointmentColumn';

export default function PendingReferralCard({ referral }) {
  const first = true;
  const grouped = true;
  const idClickable = `id-${referral.id.replace('.', '\\.')}`;
  const isCanceled = referral.status === 'cancelled';
  const typeOfCareName = referral.typeOfCare;

  const link = 'review-approved';

  return (
    <ListItem appointment={referral} borderBottom status="pending">
      <AppointmentFlexGrid idClickable={idClickable} link={link}>
        <AppointmentRow className="vads-u-margin-x--1p5 xsmall-screen:vads-u-flex-direction--row">
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
            <AppointmentRow className="vaos-appts__column-gap--3 small-screen:vads-u-flex-direction--row">
              <AppointmentColumn size="1" className="vads-u-flex--4">
                <AppointmentRow className="vaos-appts__column-gap--3 vaos-appts__display--table xsmall-screen:vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
                  <AppointmentColumn
                    padding="0"
                    // canceled={isCanceled}
                    className="vads-u-font-weight--bold vaos-appts__display--table"
                  >
                    {' '}
                    {typeOfCareName} referral
                  </AppointmentColumn>
                  <AppointmentColumn
                    padding="0"
                    size="1"
                    className="vaos-appts__display--table"
                    canceled={isCanceled}
                  >
                    <span className="vaos-appts__display--table-cell vads-u-display--flex vads-u-align-items--center">
                      You can now schedule your community care appointment
                    </span>
                  </AppointmentColumn>
                </AppointmentRow>
              </AppointmentColumn>

              <AppointmentColumn
                id={`vaos-referral-detail-${referral.id}`}
                className="vaos-hide-for-print"
                padding="0"
                size="1"
                aria-label="schedule your appointment"
              >
                <a
                  className="vaos-appts__focus--hide-outline"
                  aria-describedby={`vaos-referral-detail-${referral.id}`}
                  href={link}
                  onClick={e => e.preventDefault()}
                >
                  schedule your appointment
                </a>
              </AppointmentColumn>
            </AppointmentRow>
          </AppointmentColumn>{' '}
        </AppointmentRow>
      </AppointmentFlexGrid>
    </ListItem>
  );
}

PendingReferralCard.propTypes = {
  referral: PropTypes.object.isRequired,
};

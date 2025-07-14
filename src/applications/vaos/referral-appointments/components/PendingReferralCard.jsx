import React from 'react';
import { format, parseISO } from 'date-fns';
import PropTypes from 'prop-types';
import { titleCase } from '../../utils/formatters';
import AppointmentFlexGrid from '../../components/AppointmentFlexGrid';
import ListItem from '../../components/ListItem';
import AppointmentRow from '../../components/AppointmentRow';
import AppointmentColumn from '../../components/AppointmentColumn';
import { OPTOMETRY_STATION_IDS } from '../../utils/constants';

const PendingReferralCard = ({ referral, index }) => {
  const first = index === 0;
  const idClickable = `id-${referral.uuid.replace(/[.=\\]/g, '\\$&')}`;

  const link = `schedule-referral?id=${
    referral.uuid
  }&referrer=referrals-requests`;

  const parsedDate = parseISO(referral.expirationDate);
  const expiration = format(parsedDate, 'MMMM d, yyyy');
  const categoryOfCare = titleCase(referral.categoryOfCare);

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
                    id={`ref-title-${index}`}
                  >
                    <span data-dd-privacy="mask">{`${categoryOfCare} referral`}</span>
                  </AppointmentColumn>
                  <AppointmentColumn
                    padding="0p5"
                    size="1"
                    className="vaos-appts__display--table"
                  >
                    <span
                      id={`ref-desc-${index}`}
                      className="vaos-appts__display--table-cell vads-u-display--flex vads-u-align-items--center"
                    >
                      {`We’ve approved your community care referral. You must schedule all appointments for this referral by ${expiration}.`}
                    </span>
                  </AppointmentColumn>
                </AppointmentRow>
              </AppointmentColumn>
              {OPTOMETRY_STATION_IDS.includes(referral.stationId) ? (
                <AppointmentColumn
                  className="vaos-hide-for-print"
                  padding="0p5"
                  size="1"
                >
                  <va-link-action
                    type="secondary"
                    href={link}
                    aria-labelledby={`ref-title-${index} ref-desc-${index}`}
                    text="Schedule your appointment"
                    data-testid="schedule-appointment-link"
                    onClick={e => e.preventDefault()}
                  />
                </AppointmentColumn>
              ) : (
                <AppointmentColumn
                  className="vaos-hide-for-print"
                  padding="0p5"
                  size="1"
                >
                  <va-alert
                    status="warning"
                    visible
                    data-testid="referral-not-available-alert"
                  >
                    <h3
                      className="vads-u-font-size--h4 vads-u-margin-top--0"
                      slot="headline"
                    >
                      Online scheduling is not available for this referral at
                      this time. Please call your provider directly for help
                      scheduling an appointment.
                    </h3>
                    <va-link
                      href="/find-locations"
                      text="Find your community care provider’s phone number"
                      data-testid="referral-not-available-phone-link"
                    />
                  </va-alert>
                </AppointmentColumn>
              )}
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

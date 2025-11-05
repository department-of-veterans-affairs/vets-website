import React from 'react';
import { format, parseISO } from 'date-fns';
import PropTypes from 'prop-types';
import { titleCase } from '../../utils/formatters';
import AppointmentFlexGrid from '../../components/AppointmentFlexGrid';
import ListItem from '../../components/ListItem';
import AppointmentRow from '../../components/AppointmentRow';
import AppointmentColumn from '../../components/AppointmentColumn';
import { useIsInPilotReferralStation } from '../hooks/useIsInPilotReferralStation';
import FindCommunityCareOfficeLink from './FindCCFacilityLink';

const PendingReferralCard = ({ referral, index }) => {
  const first = index === 0;
  const stationIdValid = useIsInPilotReferralStation(referral);
  const idClickable = `id-${referral.uuid.replace(/[.=\\]/g, '\\$&')}`;
  const link = `schedule-referral?id=${
    referral.uuid
  }&referrer=referrals-requests`;

  const parsedDate = parseISO(referral.expirationDate);
  const expiration = format(parsedDate, 'MMMM d, yyyy');
  const categoryOfCare = titleCase(referral.categoryOfCare);

  if (!stationIdValid) {
    return (
      <li
        data-testid="referral-not-available-list-item"
        className="vads-u-margin--0 vads-u-border-bottom--1px vads-u-border-color--gray-medium"
      >
        <div>
          <AppointmentRow className="vads-u-margin-x--0p5 mobile:vads-u-flex-direction--row">
            <AppointmentColumn className="vads-u-padding-y--1" size="1">
              <div
                className="vads-u-font-weight--bold vaos-appts__display--table vads-u-padding--0p5"
                data-testid="typeOfCare"
                id={`ref-title-${index}`}
              >
                <span data-dd-privacy="mask">{`${categoryOfCare} referral`}</span>
              </div>
              <div className="vaos-appts__display--table vads-u-padding--0p5">
                <va-alert
                  slim
                  status="warning"
                  visible
                  data-testid="referral-not-available-alert"
                >
                  <span className="vads-u-font-size--h4 vads-u-margin-top--0 vads-u-margin-bottom--2 vads-u-display--block">
                    Online scheduling isn’t available for this referral right
                    now. Call your community care provider or your facility’s
                    community care office to schedule an appointment.
                  </span>
                  <FindCommunityCareOfficeLink />
                </va-alert>
              </div>
            </AppointmentColumn>
          </AppointmentRow>
        </div>
      </li>
    );
  }

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
            <div
              id={`ref-title-${index}`}
              data-testid="typeOfCare"
              // canceled={isCanceled}
              className="vads-u-font-weight--bold vaos-appts__display--table vads-u-padding--0p5"
            >
              <span data-dd-privacy="mask">{`${categoryOfCare} referral`}</span>
            </div>
            <div className="vaos-appts__display--table vads-u-padding--0p5">
              <span
                id={`ref-desc-${index}`}
                className="vaos-appts__display--table-cell vads-u-display--flex vads-u-align-items--center"
              >
                {`You must schedule all appointments for this referral by ${expiration}.`}
              </span>
            </div>
            <div className="vaos-hide-for-print vads-u-padding--0p5">
              <va-link-action
                type="secondary"
                href={link}
                aria-labelledby={`ref-title-${index} ref-desc-${index}`}
                text="Schedule your appointment"
                data-testid="schedule-appointment-link"
                onClick={e => e.preventDefault()}
              />
            </div>
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

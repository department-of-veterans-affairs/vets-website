import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import IconCTALink from '../IconCTALink';

const HealthCareCTA = ({
  hasInboxError,
  unreadMessagesCount,
  authenticatedWithSSOe,
  hasUpcomingAppointment,
  hasAppointmentsError,
  shouldShowPrescriptions,
}) => {
  return (
    <>
      <h3 className="sr-only">Popular actions for Health Care</h3>
      {hasInboxError ||
        (unreadMessagesCount === 0 && (
          <IconCTALink
            text="Send a secure message to your health care team"
            icon="comments"
            href={mhvUrl(authenticatedWithSSOe, 'secure-messaging')}
            onClick={() =>
              recordEvent({
                event: 'nav-linkslist',
                'links-list-header': 'View your messages',
                'links-list-section-header': 'Health care',
              })
            }
          />
        ))}
      {!hasUpcomingAppointment &&
        !hasAppointmentsError && (
          <IconCTALink
            href="/health-care/schedule-view-va-appointments/appointments"
            icon="calendar"
            text="Schedule and manage your appointments"
            onClick={() => {
              recordEvent({
                event: 'nav-linkslist',
                'links-list-header': 'Schedule and manage your appointments',
                'links-list-section-header': 'Health care',
              });
            }}
          />
        )}

      {/* Prescriptions */}
      {shouldShowPrescriptions ? (
        <IconCTALink
          href={mhvUrl(
            authenticatedWithSSOe,
            'web/myhealthevet/refill-prescriptions',
          )}
          icon="prescription-bottle"
          text="Refill and track your prescriptions"
          onClick={() => {
            recordEvent({
              event: 'nav-linkslist',
              'links-list-header': 'Refill and track your prescriptions',
              'links-list-section-header': 'Health care',
            });
          }}
        />
      ) : null}

      {/* Request travel reimbursement */}
      <IconCTALink
        href="/health-care/get-reimbursed-for-travel-pay/"
        icon="suitcase"
        text="Request travel reimbursement"
        onClick={() => {
          recordEvent({
            event: 'nav-linkslist',
            'links-list-header': 'Request travel reimbursement"',
            'links-list-section-header': 'Health care',
          });
        }}
      />

      {/* VA Medical records */}
      <IconCTALink
        href={mhvUrl(authenticatedWithSSOe, 'download-my-data')}
        icon="file-medical"
        text="Get your VA medical records"
        onClick={() => {
          recordEvent({
            event: 'nav-linkslist',
            'links-list-header': 'Get your VA medical records',
            'links-list-section-header': 'Health care',
          });
        }}
      />
    </>
  );
};

HealthCareCTA.propTypes = {
  authenticatedWithSSOe: PropTypes.bool,
  hasAppointmentsError: PropTypes.bool,
  hasInboxError: PropTypes.bool,
  hasUpcomingAppointment: PropTypes.bool,
  shouldShowPrescriptions: PropTypes.bool,
  unreadMessagesCount: PropTypes.number,
};

export default HealthCareCTA;

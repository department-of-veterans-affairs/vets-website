import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import IconCTALink from '../IconCTALink';

const HealthCareCTAV2 = ({
  hasInboxError,
  unreadMessagesCount,
  authenticatedWithSSOe,
  hasAppointmentsError,
  hasUpcomingAppointment,
  isVAPatient,
}) => {
  return (
    <>
      <h3 className="sr-only">Popular actions for Health Care</h3>
      {!isVAPatient && (
        <IconCTALink
          text="Learn how to apply for VA health care"
          icon="file-medical"
          newTab
          href="/health-care/apply/application"
          testId="apply-va-healthcare-link-from-cta"
          onClick={() =>
            recordEvent({
              event: 'nav-linkslist',
              'links-list-header': 'Apply for VA health care',
              'links-list-section-header': 'Health care',
            })
          }
        />
      )}
      {isVAPatient && (
        <>
          {hasInboxError ||
            (unreadMessagesCount === 0 && (
              <IconCTALink
                text="Send a secure message to your health care team"
                icon="comments"
                newTab
                href={mhvUrl(authenticatedWithSSOe, 'secure-messaging')}
                testId="view-your-messages-link-from-cta"
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
                icon="calendar-check"
                newTab
                text="Schedule and manage your appointments"
                testId="view-manage-appointments-link-from-cta"
                onClick={() => {
                  recordEvent({
                    event: 'nav-linkslist',
                    'links-list-header':
                      'Schedule and manage your appointments',
                    'links-list-section-header': 'Health care',
                  });
                }}
              />
            )}

          {/* Prescriptions */}
          <IconCTALink
            href={mhvUrl(
              authenticatedWithSSOe,
              'web/myhealthevet/refill-prescriptions',
            )}
            icon="prescription-bottle"
            newTab
            text="Refill and track your prescriptions"
            testId="refill-prescriptions-link-from-cta"
            onClick={() => {
              recordEvent({
                event: 'nav-linkslist',
                'links-list-header': 'Refill and track your prescriptions',
                'links-list-section-header': 'Health care',
              });
            }}
          />

          {/* Request travel reimbursement */}
          <IconCTALink
            href="/health-care/get-reimbursed-for-travel-pay/"
            icon="suitcase"
            newTab
            text="Request travel reimbursement"
            testId="request-travel-reimbursement-link-from-cta"
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
            newTab
            text="Get your VA medical records and lab and test results"
            testId="get-medical-records-link-from-cta"
            onClick={() => {
              recordEvent({
                event: 'nav-linkslist',
                'links-list-header': 'Get your VA medical records',
                'links-list-section-header': 'Health care',
              });
            }}
          />
        </>
      )}
    </>
  );
};

HealthCareCTAV2.propTypes = {
  authenticatedWithSSOe: PropTypes.bool,
  hasAppointmentsError: PropTypes.bool,
  hasInboxError: PropTypes.bool,
  hasUpcomingAppointment: PropTypes.bool,
  isVAPatient: PropTypes.bool,
  unreadMessagesCount: PropTypes.number,
};

export default HealthCareCTAV2;

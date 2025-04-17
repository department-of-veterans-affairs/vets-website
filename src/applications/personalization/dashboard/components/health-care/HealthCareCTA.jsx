import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import IconCTALink from '../IconCTALink';

const HealthCareCTA = ({
  authenticatedWithSSOe,
  hasAppointmentsError,
  hasUpcomingAppointment,
  isVAPatient,
  isLOA1,
  unreadMessagesCount,
}) => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

  // viewMhvLink will be true if toggle is on
  const viewMhvLink = useToggleValue(TOGGLE_NAMES.myVaEnableMhvLink);

  let urls = {
    applyForVAHealthcare: '/health-care/apply-for-health-care-form-10-10ez/',
    myHealthEVet: '/my-health/',
    inbox: mhvUrl(authenticatedWithSSOe, 'secure-messaging'),
    appointments: '/my-health/appointments/',
    refillPrescriptions: mhvUrl(
      authenticatedWithSSOe,
      'web/myhealthevet/refill-prescriptions',
    ),
    travelReimbursement: '/health-care/get-reimbursed-for-travel-pay/',
    medicalRecords: mhvUrl(authenticatedWithSSOe, 'download-my-data'),
  };

  if (useToggleValue(TOGGLE_NAMES.myVaNewMhvUrls)) {
    urls = {
      ...urls,
      inbox: '/my-health/secure-messages/inbox/',
      refillPrescriptions: '/my-health/medications/refill/',
      medicalRecords: '/my-health/medical-records',
      travelReimbursement: 'https://dvagov-btsss.dynamics365portals.us/signin',
    };
  }

  if (useToggleValue(TOGGLE_NAMES.myVaMhvLinkDesignUpdate)) {
    return (
      <>
        {!isLOA1 && viewMhvLink && (
          <div className="vads-u-margin-bottom--2">
            <va-link
              active
              text="Go to My HealtheVet"
              href={urls.myHealthEVet}
              testId="visit-mhv-on-va-gov"
              onClick={() =>
                recordEvent({
                  event: 'nav-linkslist',
                  'links-list-header': 'Visit MHV on Va.gov',
                  'links-list-section-header': 'Health care',
                })
              }
            />
          </div>
        )}

        {(!isVAPatient || isLOA1) && (
          <IconCTALink
            text="Apply for VA health care"
            icon="note_add"
            href={urls.applyForVAHealthcare}
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

        {isVAPatient && !isLOA1 && (
          <>
            {!hasUpcomingAppointment && !hasAppointmentsError && (
              <IconCTALink
                href={urls.appointments}
                icon="calendar_today"
                text="Schedule and manage appointments"
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

            <IconCTALink
              text="Go to inbox"
              icon="forum"
              dotIndicator={unreadMessagesCount > 0}
              ariaLabel={
                unreadMessagesCount > 0 &&
                'You have unread messages. Go to your inbox.'
              }
              href={urls.inbox}
              testId="view-your-messages-link-from-cta"
              onClick={() =>
                recordEvent({
                  event: 'nav-linkslist',
                  'links-list-header': 'View your messages',
                  'links-list-section-header': 'Health care',
                })
              }
            />

            {/* Prescriptions */}
            <IconCTALink
              href={urls.refillPrescriptions}
              icon="pill"
              text="Refill medications"
              testId="refill-prescriptions-link-from-cta"
              onClick={() => {
                recordEvent({
                  event: 'nav-linkslist',
                  'links-list-header': 'Refill and track your prescriptions',
                  'links-list-section-header': 'Health care',
                });
              }}
            />

            {/* VA Medical records */}
            <IconCTALink
              href={urls.medicalRecords}
              icon="note_add"
              text="Get medical records"
              testId="get-medical-records-link-from-cta"
              onClick={() => {
                recordEvent({
                  event: 'nav-linkslist',
                  'links-list-header': 'Get your VA medical records',
                  'links-list-section-header': 'Health care',
                });
              }}
            />

            {/* Request travel reimbursement */}
            <IconCTALink
              href={urls.travelReimbursement}
              icon="attach_money"
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
          </>
        )}
      </>
    );
  }

  return (
    <>
      {(!isVAPatient || isLOA1) && (
        <IconCTALink
          text="Apply for VA health care"
          icon="note_add"
          href={urls.applyForVAHealthcare}
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
      {!isLOA1 && viewMhvLink && (
        <IconCTALink
          text="Visit My HealtheVet on VA.gov"
          icon="language"
          href={urls.myHealthEVet}
          testId="visit-mhv-on-va-gov"
          onClick={() =>
            recordEvent({
              event: 'nav-linkslist',
              'links-list-header': 'Visit MHV on Va.gov',
              'links-list-section-header': 'Health care',
            })
          }
        />
      )}
      {isVAPatient && !isLOA1 && (
        <>
          <IconCTALink
            text="Go to your inbox"
            icon="inbox"
            dotIndicator={unreadMessagesCount > 0}
            ariaLabel={
              unreadMessagesCount > 0 &&
              'You have unread messages. Go to your inbox.'
            }
            href={urls.inbox}
            testId="view-your-messages-link-from-cta"
            onClick={() =>
              recordEvent({
                event: 'nav-linkslist',
                'links-list-header': 'View your messages',
                'links-list-section-header': 'Health care',
              })
            }
          />
          {!hasUpcomingAppointment && !hasAppointmentsError && (
            <IconCTALink
              href={urls.appointments}
              icon="calendar_today"
              text="Schedule and manage your appointments"
              testId="view-manage-appointments-link-from-cta"
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
          <IconCTALink
            href={urls.refillPrescriptions}
            icon="pill"
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
            href={urls.travelReimbursement}
            icon="work"
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
            href={urls.medicalRecords}
            icon="note_add"
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

HealthCareCTA.propTypes = {
  authenticatedWithSSOe: PropTypes.bool,
  hasAppointmentsError: PropTypes.bool,
  hasInboxError: PropTypes.bool,
  hasUpcomingAppointment: PropTypes.bool,
  isLOA1: PropTypes.bool,
  isVAPatient: PropTypes.bool,
  unreadMessagesCount: PropTypes.number,
};

export default HealthCareCTA;

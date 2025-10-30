import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import IconCTALink from '../IconCTALink';

const HealthCareCTA = ({
  hasAppointmentsError,
  hasUpcomingAppointment,
  isVAPatient,
  isLOA1,
  unreadMessagesCount,
}) => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

  const smocEnabled = useToggleValue(
    TOGGLE_NAMES.travelPaySubmitMileageExpense,
  );

  let urls = {
    applyForVAHealthcare: '/health-care/apply-for-health-care-form-10-10ez/',
    myHealthEVet: '/my-health/',
    inbox: '/my-health/secure-messages/inbox/',
    appointments: '/my-health/appointments/',
    refillPrescriptions: '/my-health/medications/refill/',
    travelReimbursement: 'https://dvagov-btsss.dynamics365portals.us/signin',
    medicalRecords: '/my-health/medical-records',
  };

  if (smocEnabled) {
    urls = {
      ...urls,
      travelReimbursement: '/my-health/travel-pay/claims',
    };
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
      {!isLOA1 && (
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
      {isVAPatient &&
        !isLOA1 && (
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
            {!hasUpcomingAppointment &&
              !hasAppointmentsError && (
                <IconCTALink
                  href={urls.appointments}
                  icon="calendar_today"
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
              text={
                smocEnabled
                  ? 'Review and file travel claims'
                  : 'Request travel reimbursement'
              }
              testId="request-travel-reimbursement-link-from-cta"
              onClick={() => {
                recordEvent({
                  event: 'nav-linkslist',
                  'links-list-header': smocEnabled
                    ? 'Review and file travel claims'
                    : 'Request travel reimbursement',
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
  hasAppointmentsError: PropTypes.bool,
  hasInboxError: PropTypes.bool,
  hasUpcomingAppointment: PropTypes.bool,
  isLOA1: PropTypes.bool,
  isVAPatient: PropTypes.bool,
  unreadMessagesCount: PropTypes.number,
};

export default HealthCareCTA;

import React, { useEffect } from 'react';
import { focusElement } from 'platform/utilities/ui';
import AppointmentBlock from '../../components/AppointmentBlock';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

/**
 * MOCK DATA
 */

const mockTime = new Date();
const appointments = [
  {
    facility: 'LOMA LINDA VA CLINIC',
    clinicPhoneNumber: '5551234567',
    clinicFriendlyName: 'TEST CLINIC',
    clinicName: 'LOM ACC CLINIC TEST',
    appointmentIen: 'some-ien',
    startTime: mockTime,
    eligibility: 'ELIGIBLE',
    facilityId: 'some-facility',
    checkInWindowStart: mockTime,
    checkInWindowEnd: mockTime,
    checkedInTime: '',
  },
  {
    facility: 'LOMA LINDA VA CLINIC',
    clinicPhoneNumber: '5551234567',
    clinicFriendlyName: 'TEST CLINIC',
    clinicName: 'LOM ACC CLINIC TEST',
    appointmentIen: 'some-other-ien',
    startTime: mockTime,
    eligibility: 'ELIGIBLE',
    facilityId: 'some-facility',
    checkInWindowStart: mockTime,
    checkInWindowEnd: mockTime,
    checkedInTime: '',
  },
];

const updates = {
  demographicsUpToDate: true,
  nextOfKinUpToDate: false,
};

const hasUpdates = () => {
  return Object.values(updates).includes(true);
};

/**
 * END MOCK DATA
 */

const Confirmation = () => {
  useEffect(() => {
    focusElement('h1');
  }, []);
  return (
    <div className="vads-l-grid-container vads-u-padding-bottom--3 vads-u-padding-top--3">
      <h1>You’ve completed pre check-in</h1>
      <AppointmentBlock appointments={appointments} />
      {hasUpdates ? (
        <va-alert background-only status="info">
          {/** TODO INFO ICON */}
          <div>
            A staff member will help you on the day of your appointment to
            update your information.
          </div>
        </va-alert>
      ) : (
        <></>
      )}
      <p className={hasUpdates ? `vads-u-padding-left--2` : ``}>
        <a href="https://va.gov/health-care/schedule-view-va-appointments/appointments/">
          Go to your appointment
        </a>
      </p>
      <p className={hasUpdates ? `vads-u-padding-left--2` : ``}>
        Please bring your insurance cards with you to your appointment.
      </p>
      <h3>What if I have questions about my appointment?</h3>
      <p>Call your VA health care team:</p>
      {appointments.map((appointment, index) => {
        return (
          <p key={index}>
            {appointment.clinicFriendlyName} at{' '}
            <Telephone contact={appointment.clinicPhoneNumber} />
          </p>
        );
      })}
    </div>
  );
};

export default Confirmation;

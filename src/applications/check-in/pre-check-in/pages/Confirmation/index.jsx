import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

import AppointmentBlock from '../../components/AppointmentBlock';
import { makeSelectVeteranData, makeSelectForm } from '../../selectors';

const Confirmation = () => {
  useEffect(() => {
    focusElement('h1');
  }, []);
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const selectFormData = useMemo(makeSelectForm, []);
  const { appointments } = useSelector(selectVeteranData);
  const { data: formData } = useSelector(selectFormData);
  const hasUpdates = Object.values(formData).includes('no');
  if (appointments.length === 0) {
    return <></>;
  } else {
    return (
      <div
        className="vads-l-grid-container vads-u-padding-bottom--3 vads-u-padding-top--3"
        data-testid="confirmation-wrapper"
      >
        <h1 tabIndex="-1" className="vads-u-margin-top--2">
          You’ve completed pre-check-in
        </h1>
        <AppointmentBlock appointments={appointments} />
        {hasUpdates ? (
          <va-alert
            background-only
            status="info"
            show-icon
            data-testid="confirmation-update-alert"
          >
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
        <h3 data-testid="appointment-questions">
          What if I have questions about my appointment?
        </h3>
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
  }
};

export default Confirmation;

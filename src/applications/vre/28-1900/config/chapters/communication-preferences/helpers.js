import React from 'react';

export const VreCommunicationInformation = (
  <section>
    <p>
      <strong>VR&E has several options</strong> available that could make
      counseling easier. If you answer yes to the questions below, we will call
      or email you with more details. Please let us know which options work best
      for you.
    </p>
    <p>
      VR&E has an <strong>electronic-Virtual Assistant (e-VA)</strong> to let
      you schedule appointments, contact your counselor, and send documentation.
      Everything is private and secure. To use e-VA, you’ll need a smartphone,
      tablet, or computer.
    </p>
  </section>
);

export const TeleCounselingInformation = (
  <section>
    <p>
      VR&E has a virtual communication tool to host{' '}
      <strong>Tele-counseling</strong> sessions. This will work on any device
      with a camera and microphone. Tele-counseling can save time and travel,
      and can get you better access to services.
    </p>
  </section>
);

export const AppointmentPreferencesInformation = (
  <section>
    <p>
      VR&E will work hard to assign a counselor who is available during your
      preferred hours, but we can't guarantee one will be available then.
    </p>
  </section>
);

export const validateAtLeastOneSelected = (errors, fieldData) => {
  if (!Object.values(fieldData).some(val => val === true)) {
    errors.addError('Please select at least one option');
  }
};
